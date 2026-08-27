const projects = [
  {
    id: "cosmograph",
    name: "CosmoGraph 3D",
    kind: "Obsidian plugin",
    summary: "Выберите площадку, чтобы открыть формат и задачу публикации.",
    image: "assets/cosmograph-hero.jpg",
    canvas: { width: 1180, height: 720 },
    nodes: [
      {
        id: "project",
        title: "CosmoGraph 3D",
        mark: "CG",
        type: "Проект",
        x: 250,
        y: 310,
        width: 190,
        className: "project-node",
        sections: [
          ["Цель", "Привести пользователей к установке плагина и поддержке репозитория."],
          ["Основное действие", "Установить CosmoGraph 3D из Community Plugins."],
          ["Поддержка", "Поставить GitHub star, открыть issue или прислать сценарий использования."]
        ]
      },
      {
        id: "habr",
        title: "Habr",
        mark: "H",
        type: "Платформа",
        x: 620,
        y: 72,
        width: 154,
        className: "platform",
        sections: [
          ["Формат", "Глубокая статья с кодом, архитектурой, измерениями и честными ограничениями."],
          ["Раскрыть", "Как сделано, что не сработало и почему выбран текущий подход."],
          ["Действие", "Открыть GitHub, запустить benchmark или создать содержательный issue."]
        ]
      },
      {
        id: "vc",
        title: "vc.ru",
        mark: "vc",
        type: "Платформа",
        x: 620,
        y: 206,
        width: 154,
        className: "platform",
        sections: [
          ["Формат", "Авторская история со скриншотами и понятным пользовательским сценарием."],
          ["Раскрыть", "Проблему, идею решения, заметный результат и границы продукта."],
          ["Действие", "Установить инструмент и попробовать его на собственном vault."]
        ]
      },
      {
        id: "github",
        title: "GitHub",
        mark: "GH",
        type: "Платформа",
        x: 620,
        y: 340,
        width: 154,
        className: "platform",
        sections: [
          ["Формат", "README, demo, Release, roadmap и проверяемые артефакты."],
          ["Раскрыть", "Установку, возможности, ограничения и планы разработки."],
          ["Действие", "Установить, поставить star, открыть issue или сделать PR."]
        ]
      },
      {
        id: "telegram",
        title: "Telegram",
        mark: "TG",
        type: "Платформа",
        x: 620,
        y: 474,
        width: 154,
        className: "platform",
        sections: [
          ["Формат", "Один инсайт, промежуточный результат, скриншот или GIF."],
          ["Раскрыть", "Небольшую победу, наблюдение или вопрос к аудитории."],
          ["Действие", "Ответить, перейти к релизу или открыть полную статью."]
        ]
      },
      {
        id: "community",
        title: "Reddit / Forum",
        mark: "EN",
        type: "Второй контур",
        x: 900,
        y: 140,
        width: 164,
        className: "platform",
        sections: [
          ["Формат", "Demo, английское описание и конкретная просьба проверить сценарий."],
          ["Действие", "Получить обратную связь, реальные vault и новых contributors."],
          ["Когда", "После понятной установки, английского README и готовности отвечать сообществу."]
        ]
      },
      {
        id: "social",
        title: "X / LinkedIn",
        mark: "X",
        type: "Второй контур",
        x: 900,
        y: 430,
        width: 164,
        className: "platform",
        sections: [
          ["Формат", "Before/after, короткий thread или инженерный кейс."],
          ["Раскрыть", "Одно наблюдаемое изменение и один вывод из разработки."],
          ["Действие", "Привести читателя к demo, релизу или технической статье."]
        ]
      }
    ],
    edges: [
      ["project", "habr", "primary"],
      ["project", "vc", "primary"],
      ["project", "github", "primary"],
      ["project", "telegram", "primary"],
      ["habr", "community", "secondary"],
      ["telegram", "social", "secondary"]
    ]
  }
];

const projectList = document.getElementById("project-list");
const graphCanvas = document.getElementById("graph-canvas");
const graphSurface = document.getElementById("graph-surface");
const graphNodes = document.getElementById("graph-nodes");
const connections = document.getElementById("connections");
const zoomLevel = document.getElementById("zoom-level");
const projectTitle = document.getElementById("project-title");
const projectKind = document.getElementById("project-kind");
const projectSummary = document.getElementById("project-summary");
const detailPanel = document.getElementById("detail-panel");
const detailBackdrop = document.getElementById("detail-backdrop");
const detailType = document.getElementById("detail-type");
const detailTitle = document.getElementById("detail-title");
const detailSections = document.getElementById("detail-sections");
const closeDetailButton = document.getElementById("close-detail");

let activeProjectId = projects[0].id;
let activeNodeId = null;
let lastTrigger = null;
const camera = { x: 0, y: 0, scale: 1 };
const pointers = new Map();
let panStart = null;
let pinchStart = null;

const MIN_SCALE = 0.42;
const MAX_SCALE = 1.8;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyCamera() {
  graphSurface.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`;
  graphCanvas.style.backgroundPosition = `${camera.x}px ${camera.y}px`;
  graphCanvas.style.backgroundSize = `${22 * camera.scale}px ${22 * camera.scale}px`;
  zoomLevel.value = `${Math.round(camera.scale * 100)}%`;
  zoomLevel.textContent = zoomLevel.value;
}

function resetCamera() {
  const project = projects.find((item) => item.id === activeProjectId);
  if (!project) return;

  const bounds = graphCanvas.getBoundingClientRect();
  const horizontalRoom = Math.max(220, bounds.width - 100);
  const verticalRoom = Math.max(300, bounds.height - 150);
  camera.scale = clamp(Math.min(horizontalRoom / project.canvas.width, verticalRoom / project.canvas.height, 1), MIN_SCALE, 1);
  camera.x = (bounds.width - project.canvas.width * camera.scale) / 2;
  camera.y = Math.max(104, (bounds.height - project.canvas.height * camera.scale) / 2 + 34);
  applyCamera();
}

function zoomAt(nextScale, clientX, clientY) {
  const bounds = graphCanvas.getBoundingClientRect();
  const anchorX = clientX - bounds.left;
  const anchorY = clientY - bounds.top;
  const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
  const worldX = (anchorX - camera.x) / camera.scale;
  const worldY = (anchorY - camera.y) / camera.scale;

  camera.x = anchorX - worldX * scale;
  camera.y = anchorY - worldY * scale;
  camera.scale = scale;
  applyCamera();
}

function zoomFromCenter(factor) {
  const bounds = graphCanvas.getBoundingClientRect();
  zoomAt(camera.scale * factor, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
}

function renderProjects() {
  projectList.innerHTML = projects.map((project) => `
    <button class="project-button" type="button" data-project="${project.id}" aria-current="${project.id === activeProjectId}">
      <img src="${project.image}" alt="">
      <span>
        <strong>${project.name}</strong>
        <small>${project.kind}</small>
      </span>
    </button>
  `).join("");

  projectList.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => selectProject(button.dataset.project));
  });
}

function nodeById(project, id) {
  return project.nodes.find((node) => node.id === id);
}

function edgePath(from, to) {
  const fromX = from.x + from.width;
  const fromY = from.y + 38;
  const toX = to.x;
  const toY = to.y + 38;
  const distance = Math.max(48, (toX - fromX) * 0.48);
  return `M ${fromX} ${fromY} C ${fromX + distance} ${fromY}, ${toX - distance} ${toY}, ${toX} ${toY}`;
}

function renderGraph(project) {
  graphSurface.style.width = `${project.canvas.width}px`;
  graphSurface.style.height = `${project.canvas.height}px`;
  connections.setAttribute("viewBox", `0 0 ${project.canvas.width} ${project.canvas.height}`);

  graphNodes.innerHTML = project.nodes.map((node) => `
    <button
      class="node ${node.className}"
      type="button"
      data-node="${node.id}"
      style="left:${node.x}px;top:${node.y}px;width:${node.width}px"
      aria-label="Открыть описание: ${node.title}"
    >
      <span class="port in" aria-hidden="true"></span>
      <span class="node-mark" aria-hidden="true">${node.mark}</span>
      <span>
        <strong>${node.title}</strong>
      </span>
      <span class="port out" aria-hidden="true"></span>
    </button>
  `).join("");

  connections.innerHTML = project.edges.map(([fromId, toId, kind]) => {
    const from = nodeById(project, fromId);
    const to = nodeById(project, toId);
    return `<path class="edge ${kind === "secondary" ? "secondary" : ""}" d="${edgePath(from, to)}"></path>`;
  }).join("");

  graphNodes.querySelectorAll("[data-node]").forEach((button) => {
    button.addEventListener("click", () => openDetail(project, button.dataset.node, button));
  });

  requestAnimationFrame(resetCamera);
}

function selectProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return;

  activeProjectId = project.id;
  activeNodeId = null;
  closeDetail(false);
  projectTitle.textContent = project.name;
  projectKind.textContent = project.kind;
  projectSummary.textContent = project.summary;
  renderProjects();
  renderGraph(project);
}

function openDetail(project, nodeId, trigger) {
  const node = nodeById(project, nodeId);
  if (!node) return;

  activeNodeId = nodeId;
  lastTrigger = trigger;
  graphNodes.querySelectorAll(".node").forEach((item) => item.classList.toggle("is-selected", item.dataset.node === nodeId));
  detailType.textContent = node.type;
  detailTitle.textContent = node.title;
  detailSections.innerHTML = node.sections.map(([label, copy]) => `
    <section class="detail-section">
      <span>${label}</span>
      <p>${copy}</p>
    </section>
  `).join("");
  detailPanel.classList.add("is-open");
  detailPanel.setAttribute("aria-hidden", "false");
  detailPanel.removeAttribute("inert");
  detailBackdrop.classList.add("is-visible");
  closeDetailButton.focus();
}

function closeDetail(returnFocus = true) {
  detailPanel.classList.remove("is-open");
  detailPanel.setAttribute("aria-hidden", "true");
  detailPanel.setAttribute("inert", "");
  detailBackdrop.classList.remove("is-visible");
  graphNodes.querySelectorAll(".node").forEach((item) => item.classList.remove("is-selected"));
  activeNodeId = null;
  if (returnFocus && lastTrigger) lastTrigger.focus();
}

closeDetailButton.addEventListener("click", () => closeDetail());
detailBackdrop.addEventListener("click", () => closeDetail());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeNodeId) closeDetail();
});

graphCanvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const factor = Math.exp(-event.deltaY * 0.0015);
  zoomAt(camera.scale * factor, event.clientX, event.clientY);
}, { passive: false });

graphCanvas.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".node, .canvas-controls")) return;

  graphCanvas.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  graphCanvas.classList.add("is-panning");

  if (pointers.size === 1) {
    panStart = { clientX: event.clientX, clientY: event.clientY, x: camera.x, y: camera.y };
  } else if (pointers.size === 2) {
    const [first, second] = [...pointers.values()];
    pinchStart = {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      scale: camera.scale,
      centerX: (first.x + second.x) / 2,
      centerY: (first.y + second.y) / 2
    };
  }
});

graphCanvas.addEventListener("pointermove", (event) => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (pointers.size === 1 && panStart) {
    camera.x = panStart.x + event.clientX - panStart.clientX;
    camera.y = panStart.y + event.clientY - panStart.clientY;
    applyCamera();
  } else if (pointers.size === 2 && pinchStart) {
    const [first, second] = [...pointers.values()];
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    const centerX = (first.x + second.x) / 2;
    const centerY = (first.y + second.y) / 2;
    zoomAt(pinchStart.scale * (distance / pinchStart.distance), centerX, centerY);
  }
});

function releasePointer(event) {
  pointers.delete(event.pointerId);
  if (pointers.size === 0) {
    panStart = null;
    pinchStart = null;
    graphCanvas.classList.remove("is-panning");
  } else if (pointers.size === 1) {
    const [point] = pointers.values();
    panStart = { clientX: point.x, clientY: point.y, x: camera.x, y: camera.y };
    pinchStart = null;
  }
}

graphCanvas.addEventListener("pointerup", releasePointer);
graphCanvas.addEventListener("pointercancel", releasePointer);

graphCanvas.querySelectorAll("[data-canvas-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.canvasAction;
    if (action === "zoom-in") zoomFromCenter(1.2);
    if (action === "zoom-out") zoomFromCenter(1 / 1.2);
    if (action === "reset") resetCamera();
  });
});

graphCanvas.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 80 : 36;
  if (event.key === "ArrowLeft") camera.x += step;
  else if (event.key === "ArrowRight") camera.x -= step;
  else if (event.key === "ArrowUp") camera.y += step;
  else if (event.key === "ArrowDown") camera.y -= step;
  else if (event.key === "+" || event.key === "=") zoomFromCenter(1.2);
  else if (event.key === "-") zoomFromCenter(1 / 1.2);
  else if (event.key === "0") resetCamera();
  else return;
  event.preventDefault();
  applyCamera();
});

window.addEventListener("resize", resetCamera);

renderProjects();
selectProject(activeProjectId);
