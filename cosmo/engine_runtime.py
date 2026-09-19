"""Browser adapter for the Cosmo Python engine running inside Pyodide."""

import base64
import copy
import json
import mimetypes
import shutil
from pathlib import Path

from scripts.serve import build_package, clear_operator_runs, process_request
from src.cosmo.case_data import load_json
from src.cosmo.common import json_value


ROOT = Path(__file__).resolve().parent
RUN_ROOT = Path("/tmp/cosmo-runs")
DOWNLOAD_NAMES = {
    "run-package.zip",
    "manifest.json",
    "report.html",
    "input-package.json",
    "annual.csv",
    "payments.csv",
    "deliveries.csv",
    "contracts.csv",
    "violations.csv",
    "inventory.csv",
}


def _default_package():
    saved = ROOT / "results/project/selected-base/input-package.json"
    return load_json(saved) if saved.exists() else build_package({})


def _embed_downloads(result):
    run_url = result.get("run_url") or ""
    run_id = run_url.rstrip("/").split("/")[-1]
    directory = RUN_ROOT / run_id
    files = {}
    if run_id and directory.is_dir():
        for path in sorted(directory.iterdir()):
            if path.name not in DOWNLOAD_NAMES or not path.is_file():
                continue
            mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
            files[path.name] = {
                "mime": mime,
                "data": base64.b64encode(path.read_bytes()).decode("ascii"),
            }
    result["download_files"] = files
    result["run_url"] = ""
    for item in result.get("comparison", []):
        item["run_url"] = ""
    return result


def handle_request(path, payload):
    if path == "/api/default":
        return {"package": _default_package()}
    if path == "/api/cleanup":
        outcome = clear_operator_runs(root=RUN_ROOT)
        if RUN_ROOT.exists() and not any(RUN_ROOT.iterdir()):
            shutil.rmtree(RUN_ROOT)
        return outcome
    if path == "/api/run":
        RUN_ROOT.mkdir(parents=True, exist_ok=True)
        return _embed_downloads(process_request(payload, output_root=RUN_ROOT))
    raise ValueError("Неизвестный маршрут расчётного ядра")


def handle_json(path, payload_json):
    payload = json.loads(payload_json) if payload_json else {}
    response = handle_request(path, copy.deepcopy(payload))
    return json.dumps(json_value(response), ensure_ascii=False, separators=(",", ":"))
