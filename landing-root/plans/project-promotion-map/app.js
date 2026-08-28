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
  },
  {
    id: "cubanoid",
    name: "Cubanoid",
    kind: "Браузерная 3D-игра",
    summary: "Два контура на одну воронку: игроки и инженерное портфолио. Выберите узел, чтобы открыть формат и задачу.",
    image: "assets/cubanoid-hero.jpg",
    canvas: { width: 1440, height: 900 },
    nodes: [
      {
        id: "project",
        title: "Cubanoid",
        mark: "CB",
        type: "Проект",
        x: 44,
        y: 372,
        width: 200,
        className: "project-node",
        sections: [
          ["Что это", "Браузерная 3D-головоломка: катаешь желейный куб по парящим в небе плитам. Масса — единственный ресурс: она же здоровье, размер и ключ. Смертей нет, есть потеря массы."],
          ["Цель продвижения", "Привести игрока к playable-ссылке, а затем к профилю автора. Две цели, одна воронка: сначала человек играет, потом узнаёт, кто это сделал."],
          ["Основное действие", "Открыть cubanoid.vercel.app и пройти уровень — без установки, без регистрации, в один клик."],
          ["Состояние на 27.08.2026", "Версия 0.1.0: один уровень и песочница, Three.js и Rapier, лицензия MIT, деплой на Vercel живой, репозиторий пока приватный."],
          ["Порядок", "Витрина и Профиль → DTF → itch.io → английский контур. Habr и three.js Showcase включаются только после открытия репозитория."]
        ]
      },
      {
        id: "gate-showcase",
        title: "Витрина",
        mark: "01",
        type: "Шлюз",
        x: 326,
        y: 110,
        width: 186,
        className: "gate",
        sections: [
          ["Зачем", "Ни одна публикация не выходит, пока витрина не готова. Иначе трафик приходит на текст и уходит, так и не увидев игру."],
          ["Уже есть", "Playable-ссылка cubanoid.vercel.app отвечает и отдаёт игру. Это единственная точка входа во всех публикациях — отдельных сборок не заводим."],
          ["Что доделать", "GIF на 20 секунд: куб катится, табличка «ПРЫГАЙ!», удар о шип и потеря массы. Описание репозитория и топики threejs, rapier, webgl, puzzle-game. README, где GIF и управление стоят выше кода."],
          ["Условие выхода", "Незнакомый человек по одной ссылке понимает, что это, и играет без объяснений."]
        ]
      },
      {
        id: "gate-profile",
        title: "Профиль",
        mark: "02",
        type: "Шлюз",
        x: 326,
        y: 340,
        width: 186,
        className: "gate",
        sections: [
          ["Зачем", "Вторая цель — продвинуть GitHub. Трафик из публикаций придёт на профиль, поэтому профиль готовится раньше публикаций, а не после."],
          ["Что не так сейчас", "Из 39 публичных репозиториев 27 без описания, звёзд нет ни на одном. В profile README бейджи Python, FastAPI, MySQL, Linux — ни TypeScript, ни Three.js, ни WebGL, хотя делается именно это."],
          ["Что сделать", "Cubanoid витриной в самом верху README: GIF и ссылка. Добавить TypeScript, Three.js и WebGL в навыки. Описания и топики топ-5 репозиториям — cubanoid, obsidian-cosmograph, sberbank-pilot-abort и другим живым."],
          ["Условие выхода", "Человек, пришедший с DTF, за десять секунд на профиле понимает, кто вы и что смотреть первым."]
        ]
      },
      {
        id: "gate-open",
        title: "Открыть репозиторий",
        mark: "03",
        type: "Развилка",
        x: 326,
        y: 572,
        width: 186,
        className: "gate",
        sections: [
          ["Решение", "Открываем позже, по готовности — не на старте."],
          ["Почему это шлюз", "Habr, three.js Showcase и GitHub как точка подписки без публичного кода не работают. До открытия живёт только игровой контур."],
          ["Условие выхода", "Три уровня вместо одного, README с GIF и управлением, зелёные npm test, lint и build, внятная история коммитов."],
          ["Прятать нечего", "Лицензия MIT уже стоит, собранный билд и так публичен на Vercel. Открытие не раскроет ничего сверх того, что браузер уже получает."]
        ]
      },
      {
        id: "articles",
        title: "Статьи · 1 из 6",
        mark: "04",
        type: "Материалы",
        x: 326,
        y: 740,
        width: 186,
        className: "gate",
        sections: [
          ["Статус", "Опубликована 1 из 6. Остальные пять лежат готовыми черновиками на Хабре: со своими хабами, ключевыми словами, обложками и картинками. Выкладывать можно в любые дни и в любом порядке."],
          ["Опубликовано 28.08.2026", "«У моего героя нет здоровья, ключей и очков. Есть масса, и это всё сразу». Хабы: Разработка игр, Дизайн игр, TypeScript, Логические игры, JavaScript."],
          ["Что осталось сделать", "Проверить в черновиках, что картинки видны: они вставлены ссылками на indigosmart.ru. Надёжнее перетащить файлы прямо в редактор — тогда статья не зависит от нашего сервера."],
          ["Порядок остальных", "02 хроника по скриншотам → 06 дешёвые правки → 03 физика → 05 рендер → 04 архитектура. Первые две визуальные и лёгкие, они собирают аудиторию на технические."]
        ],
        links: [
          ["✅ 01 · Опубликовано на Хабре", "https://habr.com/ru/articles/1075536/", "live"],
          ["Черновик 02 · Пять скриншотов", "https://habr.com/ru/articles/1075546/", "draft"],
          ["Черновик 03 · Куб спотыкался", "https://habr.com/ru/articles/1075548/", "draft"],
          ["Черновик 04 · Домен и Three.js", "https://habr.com/ru/articles/1075550/", "draft"],
          ["Черновик 05 · Чёрные тени", "https://habr.com/ru/articles/1075552/", "draft"],
          ["Черновик 06 · Дешёвые правки", "https://habr.com/ru/articles/1075650/", "draft"],
          ["Все тексты у нас на сайте", "/plans/cubanoid-articles/"]
        ]
      },
      {
        id: "dtf",
        title: "DTF",
        mark: "DTF",
        type: "Площадка · RU · первая",
        x: 636,
        y: 48,
        width: 166,
        className: "platform",
        sections: [
          ["Формат", "Девлог с гифками. Не «представляю игру», а «вот что я пытался сделать и что из этого вышло»."],
          ["Крючок", "Смертей нет — есть потеря массы. Куб уменьшается от урона, и маленьким кубом проходятся места, куда большой не пролезает. Одна фраза объясняет всю игру."],
          ["Действие", "Сыграть по ссылке из первого абзаца и написать в комментариях, где стало непонятно или неудобно."],
          ["Что даёт профилю", "Основной источник первых игроков и живого фидбека по уровням. Ссылка на GitHub идёт в конце, без нажима."]
        ]
      },
      {
        id: "telegram",
        title: "Telegram",
        mark: "TG",
        type: "Площадка · RU · первая",
        x: 636,
        y: 196,
        width: 166,
        className: "platform",
        sections: [
          ["Состояние", "Своего канала нет, в profile README только личный контакт @mrlinux0. Заводить канал ради трёх постов не нужно."],
          ["Формат сейчас", "Чужие инди-геймдев чаты: короткий GIF, один вопрос, ссылка. Просить не «оцените», а конкретное — пройдите первый уровень и скажите, где застряли."],
          ["Когда свой канал", "Когда набирается ритм: девлог хотя бы раз в неделю. Раньше канал выглядит заброшенным и работает против вас."],
          ["Что даёт профилю", "Самый быстрый отклик из всех площадок и единственный канал, где видно живого автора, а не проект."]
        ]
      },
      {
        id: "vc",
        title: "vc.ru",
        mark: "vc",
        type: "Площадка · RU · третья",
        x: 636,
        y: 344,
        width: 166,
        className: "platform",
        sections: [
          ["Формат", "Авторская история: зачем студент делает браузерную игру и что это дало."],
          ["Когда", "Третьим шагом, не на старте — когда с DTF и itch.io уже есть цифры и отзывы, о которых можно рассказать. Без них текст пустой."],
          ["Крючок", "Аудитория vc.ru — не игроки, поэтому цепляет не геймплей, а процесс и результат: сроки, инструменты, что сломалось и сколько стоило."],
          ["Что даёт профилю", "Читатели vc.ru чаще смотрят на автора, чем на продукт — отсюда самый прямой переход к подписке."]
        ]
      },
      {
        id: "habr",
        title: "Habr",
        mark: "H",
        type: "Площадка · RU · после 03",
        x: 636,
        y: 640,
        width: 166,
        className: "platform",
        sections: [
          ["Уже сделано", "28.08.2026 вышла первая статья цикла — про массу как единственный ресурс. Ещё четыре готовы и ждут в черновиках, ссылки в узле «Статьи»."],
          ["Формат", "Технический разбор с кодом и замерами: Three.js и Rapier, детерминированное перекатывание куба через грань, желейный материал, SSAO, борьба с самозатенением."],
          ["Требование", "Работает только после открытия репозитория: читатель Habr идёт в код, и статья без ссылки на исходники теряет половину смысла."],
          ["Крючок", "Честные ограничения — что не сработало и почему выбран текущий подход. В истории коммитов такого материала много: «restore collider merge (no more tripping)», «smooth jelly cube edges»."],
          ["Что даёт профилю", "Главный узел инженерного контура. Читатель Habr — тот, кто ставит звезду и подписывается."]
        ]
      },
      {
        id: "github",
        title: "GitHub",
        mark: "GH",
        type: "Точка конверсии",
        x: 636,
        y: 492,
        width: 166,
        className: "platform",
        sections: [
          ["Роль", "Не хранилище кода, а точка конверсии: сюда ведут все публикации, и здесь читатель превращается в подписчика."],
          ["Формат", "README, где GIF и управление выше установки. Топики threejs, rapier, webgl, puzzle-game. Релизы с человеческим описанием. Пара issue с меткой good first issue."],
          ["Действие", "Поставить звезду, открыть issue с багом или прислать свой уровень: формат уровней — простой JSON, это низкий порог для вклада."],
          ["Отправная точка", "Ноль звёзд на всех 39 публичных репозиториях. Первая звезда на cubanoid — честная метрика того, что контур работает."]
        ]
      },
      {
        id: "itch",
        title: "itch.io",
        mark: "IT",
        type: "Мост RU → EN",
        x: 926,
        y: 130,
        width: 172,
        className: "platform",
        sections: [
          ["Роль", "Мост из русского контура в английский и ссылка, которую не стыдно кинуть куда угодно."],
          ["Формат", "Страница с GIF, встроенной игрой и devlog. Тот же билд, что на Vercel — отдельной сборки не требуется."],
          ["Крючок", "В листингах itch решают первые три секунды гифки. На обложку идёт момент удара и потери массы, а не статичный кадр уровня."],
          ["Что даёт профилю", "Приводит англоязычную аудиторию без единой английской статьи и служит адресом для Reddit и X."]
        ]
      },
      {
        id: "reddit",
        title: "Reddit",
        mark: "RD",
        type: "Второй контур · EN",
        x: 1200,
        y: 48,
        width: 180,
        className: "platform",
        sections: [
          ["Где", "r/WebGames — про игру, r/threejs — про то, как сделано, r/IndieDev — про процесс. Три разных поста, а не один и тот же."],
          ["Формат", "Короткий пост на английском: GIF, прямая ссылка, одна просьба."],
          ["Правило", "Никакого маркетингового тона. Reddit наказывает за него быстрее, чем даёт трафик."],
          ["Когда", "После itch.io и после того, как русский фидбек уже вычистил очевидные проблемы первого уровня."],
          ["Что даёт профилю", "Самый крупный единичный всплеск трафика из всех узлов и главный источник первых звёзд."]
        ]
      },
      {
        id: "social",
        title: "X / Bluesky",
        mark: "X",
        type: "Второй контур · EN",
        x: 1200,
        y: 270,
        width: 180,
        className: "platform",
        sections: [
          ["Формат", "Короткое видео и тред «как сделан желейный куб». Теги #screenshotsaturday, #threejs, #gamedev."],
          ["Крючок", "Визуальный, а не текстовый: squash and stretch при приземлении и отлетающая капля массы читаются без единого слова."],
          ["Что даёт профилю", "Three.js-сообщество здесь плотное и активное. Это контур портфолио, а не игроков — и оценивать его надо по подпискам, а не по заходам в игру."]
        ]
      },
      {
        id: "threejs",
        title: "three.js Showcase",
        mark: "3JS",
        type: "Второй контур · после 03",
        x: 926,
        y: 560,
        width: 172,
        className: "platform",
        sections: [
          ["Где", "Раздел Showcase на discourse.threejs.org и канал showcase в Discord."],
          ["Формат", "Скриншот, ссылка, пара слов о стеке и о том, что было сложным."],
          ["Требование", "Нужен публичный репозиторий: в Showcase смотрят исходники."],
          ["Что даёт профилю", "Чистый портфолио-узел. Аудитория — те, кто нанимает и оценивает WebGL-разработчиков. Игроков отсюда почти не будет, и это нормально."]
        ]
      }
    ],
    edges: [
      ["project", "gate-showcase", "primary"],
      ["project", "gate-profile", "primary"],
      ["project", "gate-open", "primary"],
      ["project", "articles", "primary"],
      ["articles", "habr", "primary"],
      ["articles", "vc", "secondary"],
      ["gate-showcase", "dtf", "primary"],
      ["gate-showcase", "telegram", "primary"],
      ["gate-showcase", "vc", "primary"],
      ["gate-profile", "github", "primary"],
      ["gate-open", "habr", "primary"],
      ["gate-open", "github", "primary"],
      ["gate-showcase", "itch", "secondary"],
      ["dtf", "itch", "secondary"],
      ["itch", "reddit", "secondary"],
      ["telegram", "social", "secondary"],
      ["habr", "threejs", "secondary"]
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

function projectIdFromUrl() {
  const requested = new URLSearchParams(window.location.search).get("project");
  return projects.some((item) => item.id === requested) ? requested : projects[0].id;
}

if (new URLSearchParams(window.location.search).get("embed") === "1") {
  document.body.classList.add("is-embedded");
}

let activeProjectId = projectIdFromUrl();
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

function syncUrl(projectId) {
  const url = new URL(window.location.href);
  url.searchParams.set("project", projectId);
  window.history.replaceState({}, "", url);
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
  syncUrl(project.id);
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
  const sectionsHtml = node.sections.map(([label, copy]) => `
    <section class="detail-section">
      <span>${label}</span>
      <p>${copy}</p>
    </section>
  `).join("");
  const linksHtml = node.links
    ? `<section class="detail-section">
        <span>Открыть</span>
        <nav class="detail-links">${node.links
          .map(([title, href, state]) => {
            const external = /^https?:/.test(href);
            const rel = external ? ' target="_blank" rel="noreferrer"' : "";
            const cls = state ? ` class="is-${state}"` : "";
            return `<a href="${href}"${rel}${cls}>${title}</a>`;
          })
          .join("")}</nav>
      </section>`
    : "";
  detailSections.innerHTML = sectionsHtml + linksHtml;
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
