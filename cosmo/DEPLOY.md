# Cosmo route

`/cosmo/` is a static deployment of the CosmoHackaton operator interface.
The original Python model runs in a module Web Worker through pinned Pyodide;
inputs stay in the browser and exported reports are exposed as temporary Blob URLs.

`engine.zip` contains the standard-library-only model, frozen case inputs and the
browser adapter. Rebuild it whenever the source model or selected base package changes.
