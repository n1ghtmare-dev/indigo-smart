(function () {
  "use strict";

  const worker = new Worker(new URL("runtime-worker.js", document.baseURI), { type: "module" });
  const pending = new Map();
  const objectUrls = new Set();
  let nextId = 1;

  const decode = encoded => {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes;
  };

  const attachDownloads = result => {
    if (!result?.download_files) return result;
    result.download_urls = {};
    for (const [name, file] of Object.entries(result.download_files)) {
      const url = URL.createObjectURL(new Blob([decode(file.data)], { type: file.mime }));
      objectUrls.add(url);
      result.download_urls[name] = url;
    }
    delete result.download_files;
    return result;
  };

  worker.onmessage = event => {
    const task = pending.get(event.data.id);
    if (!task) return;
    pending.delete(event.data.id);
    if (event.data.error) task.reject(new Error(event.data.error));
    else task.resolve(attachDownloads(event.data.result));
  };

  worker.onerror = event => {
    const error = new Error(event.message || "Не удалось запустить расчётное ядро");
    for (const task of pending.values()) task.reject(error);
    pending.clear();
  };

  window.CosmoRuntime = {
    request(path, payload) {
      if (path === "/api/cleanup") {
        for (const url of objectUrls) URL.revokeObjectURL(url);
        objectUrls.clear();
      }
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        worker.postMessage({ id, path, payload });
      });
    }
  };

  window.addEventListener("pagehide", () => {
    for (const url of objectUrls) URL.revokeObjectURL(url);
    worker.terminate();
  }, { once: true });
})();
