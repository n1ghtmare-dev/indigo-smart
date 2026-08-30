# cosmograph-demo.js — как собран

Это артефакт сборки: настоящий рендерер плагина, вынутый из его репозитория
без UI-обвязки прототипа. Держим здесь, потому что лендинг обязан открываться
без внешних CDN.

Источник: https://github.com/n1ghtmare-dev/obsidian-cosmograph (MIT).
Внутрь входит three.js (MIT).

## Пересборка

```bash
git clone https://github.com/n1ghtmare-dev/obsidian-cosmograph
cd obsidian-cosmograph && npm install
```

Точка входа `src/demo-embed.ts` — тонкая обёртка, ничего своего не рисует:

```ts
import { SphericalGraph } from "./graph/SphericalGraph";
import { sampleGraph } from "./data/sample";
import type { GraphNode } from "./types";

type Opts = {
  onSelect?: (node: GraphNode | null) => void;
  onHover?: (node: GraphNode | null, x: number, y: number) => void;
};

export function mount(canvas: HTMLCanvasElement, opts: Opts = {}) {
  const graph = new SphericalGraph(canvas);
  graph.setSphereStyle("radiant");
  graph.setLabelMode("important");
  graph.setHandlers(
    (node) => opts.onSelect?.(node),
    (node, x, y) => opts.onHover?.(node, x, y),
  );
  graph.setData(sampleGraph);
  return graph;
}
```

Конфиг `vite.demo.config.mjs`:

```js
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: { entry: "src/demo-embed.ts", formats: ["es"], fileName: () => "cosmograph-demo.js" },
    outDir: "demo-dist", emptyOutDir: true, target: "es2020", minify: "esbuild",
  },
});
```

```bash
npx vite build --config vite.demo.config.mjs
```

Готовый файл — `demo-dist/cosmograph-demo.js` (~900 КБ, ~192 КБ gzip).
Скопировать сюда и вернуть лицензионную шапку в первые строки.

## Что важно знать про сам рендерер

- Размер берётся у родителя холста (`parentElement.clientWidth/Height`),
  следит `ResizeObserver` — родителю нужен `position: relative` и явная высота.
- Подписи узлов рисует `CSS2DRenderer` в слой `.graph-label-layer`, который
  дописывается к родителю холста. Стили `.graph-label*` продублированы в
  `index.html` из `src/style.css` плагина.
- `wheel` перехватывается с `preventDefault`, поэтому над запущенной сферой
  страница не прокручивается — об этом предупреждает подсказка в HUD.
- Pinch-зума нет: на тач-устройствах доступны только вращение и тап по узлу.
- Контекст WebGL привязан к холсту навсегда: при закрытии демо элемент
  заменяется на новый, иначе повторный запуск не поднимется.
