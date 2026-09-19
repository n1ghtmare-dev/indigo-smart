import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

const ready = (async () => {
  const pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });
  const archiveResponse = await fetch(new URL("engine.zip", import.meta.url));
  if (!archiveResponse.ok) throw new Error(`Не удалось загрузить ядро: ${archiveResponse.status}`);
  pyodide.unpackArchive(new Uint8Array(await archiveResponse.arrayBuffer()), "zip");
  await pyodide.runPythonAsync("import sys\nsys.path.insert(0, '.')\nfrom engine_runtime import handle_json");
  return { pyodide, handle: pyodide.globals.get("handle_json") };
})();

async function execute({ id, path, payload }) {
  try {
    const { handle } = await ready;
    const result = JSON.parse(handle(path, JSON.stringify(payload || {})));
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: error?.message || String(error) });
  }
}

let queue = Promise.resolve();
self.onmessage = event => {
  queue = queue.then(() => execute(event.data), () => execute(event.data));
};
