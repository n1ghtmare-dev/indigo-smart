(function () {
  "use strict";

  const ACTIVE_MAP_KEY = "learning-map-active-v1";
  const VOCABULARY_STORAGE_KEY = "english-vocabulary-v1";
  const LEARNED_LEVEL = 3;
  const DAY = 24 * 60 * 60 * 1000;
  const REVIEW_INTERVALS = [0, DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY];
  const CELL_COST = 60;
  const CELL_SIZE = 13;
  const PITCH = 16;
  const GRID_WIDTH = 116;
  const GRID_HEIGHT = 70;
  const WORLD_WIDTH = GRID_WIDTH * PITCH;
  const WORLD_HEIGHT = GRID_HEIGHT * PITCH;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const englishIslandSpecs = [
    {
      id: "pronunciation",
      cx: 11,
      cy: 13,
      seed: 11,
      blobs: [[0, 0, 5.7, 4.7], [4.7, 1.5, 3.5, 2.8], [-2.8, -4.0, 2.4, 2.0]]
    },
    {
      id: "vocabulary",
      label: "Vocabulary",
      description: "Личный словарь, интервальные повторения и запас активных слов.",
      cx: 31,
      cy: 8,
      seed: 23,
      blobs: [[0, 0, 6.6, 4.3], [5.2, -1.0, 3.1, 2.6], [-4.7, 2.2, 2.8, 2.4]]
    },
    {
      id: "grammar",
      cx: 53,
      cy: 14,
      seed: 37,
      blobs: [[0, 0, 7.1, 5.7], [-5.5, -2.2, 3.3, 2.9], [5.7, 2.3, 3.6, 3.0]]
    },
    {
      id: "listening",
      cx: 78,
      cy: 8,
      seed: 41,
      blobs: [[0, 0, 5.8, 4.2], [4.6, 2.2, 3.6, 2.8], [-3.8, -3.1, 2.7, 2.1]]
    },
    {
      id: "speaking",
      label: "Speaking",
      description: "Разговорная практика, скорость ответа и уверенность в диалоге.",
      cx: 94,
      cy: 18,
      seed: 53,
      blobs: [[0, 0, 6.7, 5.4], [-5.1, 2.9, 3.4, 2.8], [3.9, -4.0, 2.8, 2.4]]
    },
    {
      id: "reading",
      cx: 18,
      cy: 35,
      seed: 67,
      blobs: [[0, 0, 6.5, 4.8], [5.0, -1.8, 3.1, 2.8], [-4.9, 2.8, 3.0, 2.4]]
    },
    {
      id: "writing",
      cx: 42,
      cy: 33,
      seed: 79,
      blobs: [[0, 0, 6.3, 4.5], [-4.8, -2.5, 3.0, 2.6], [4.7, 2.4, 3.2, 2.8]]
    },
    {
      id: "idioms",
      cx: 65,
      cy: 35,
      seed: 83,
      blobs: [[0, 0, 5.2, 4.0], [4.2, -2.0, 2.7, 2.2], [-3.8, 2.5, 2.6, 2.1]]
    },
    {
      id: "media",
      cx: 91,
      cy: 35,
      seed: 97,
      blobs: [[0, 0, 7.2, 4.8], [5.8, 2.0, 3.7, 2.8], [-5.8, -2.5, 3.6, 2.7]]
    },
    {
      id: "work",
      cx: 11,
      cy: 57,
      seed: 101,
      blobs: [[0, 0, 5.5, 3.9], [4.5, 1.8, 2.9, 2.3], [-3.8, -2.6, 2.7, 2.0]]
    },
    {
      id: "travel",
      cx: 35,
      cy: 56,
      seed: 107,
      blobs: [[0, 0, 5.7, 3.8], [-4.1, 2.1, 2.8, 2.1], [4.8, -2.2, 3.1, 2.3]]
    },
    {
      id: "culture",
      cx: 59,
      cy: 57,
      seed: 109,
      blobs: [[0, 0, 6.4, 4.5], [5.0, 1.7, 3.3, 2.7], [-4.7, -2.5, 3.0, 2.4]]
    },
    {
      id: "fluency",
      cx: 91,
      cy: 57,
      seed: 127,
      blobs: [[0, 0, 7.8, 5.7], [-6.3, 2.7, 3.9, 3.2], [6.2, -2.6, 4.0, 3.2], [1.5, -5.7, 3.0, 2.4]]
    }
  ];

  const itIslandSpecs = [
    {
      id: "it-01",
      cx: 10,
      cy: 11,
      seed: 151,
      blobs: [[0, 0, 5.5, 4.4], [4.3, 2.0, 3.0, 2.5], [-2.6, -3.8, 2.2, 1.9]]
    },
    {
      id: "it-02",
      cx: 30,
      cy: 17,
      seed: 163,
      blobs: [[0, 0, 6.8, 4.7], [-5.0, 1.6, 3.2, 2.6], [4.8, -2.7, 3.1, 2.4]]
    },
    {
      id: "it-03",
      cx: 50,
      cy: 8,
      seed: 173,
      blobs: [[0, 0, 6.0, 4.1], [4.8, 1.5, 3.1, 2.5], [-3.9, -2.8, 2.5, 2.0]]
    },
    {
      id: "it-04",
      cx: 73,
      cy: 15,
      seed: 181,
      blobs: [[0, 0, 7.2, 5.4], [-5.6, -2.1, 3.5, 2.8], [5.8, 2.2, 3.7, 3.0]]
    },
    {
      id: "it-05",
      cx: 98,
      cy: 10,
      seed: 191,
      blobs: [[0, 0, 5.8, 4.3], [-4.2, 2.4, 2.8, 2.3], [3.8, -3.1, 2.6, 2.1]]
    },
    {
      id: "it-06",
      cx: 17,
      cy: 37,
      seed: 199,
      blobs: [[0, 0, 6.5, 5.0], [5.0, -1.8, 3.2, 2.7], [-4.8, 2.7, 3.0, 2.5]]
    },
    {
      id: "it-07",
      cx: 42,
      cy: 33,
      seed: 211,
      blobs: [[0, 0, 7.5, 5.8], [-5.8, -2.5, 3.6, 3.0], [5.6, 2.5, 3.7, 3.1]]
    },
    {
      id: "it-08",
      cx: 67,
      cy: 38,
      seed: 223,
      blobs: [[0, 0, 5.4, 4.2], [4.4, -2.0, 2.8, 2.3], [-3.7, 2.6, 2.6, 2.2]]
    },
    {
      id: "it-09",
      cx: 94,
      cy: 34,
      seed: 227,
      blobs: [[0, 0, 7.0, 4.9], [5.6, 2.1, 3.6, 2.9], [-5.5, -2.4, 3.5, 2.8]]
    },
    {
      id: "it-10",
      cx: 10,
      cy: 59,
      seed: 233,
      blobs: [[0, 0, 5.3, 3.9], [4.1, 1.7, 2.7, 2.2], [-3.5, -2.5, 2.5, 2.0]]
    },
    {
      id: "it-11",
      cx: 34,
      cy: 57,
      seed: 239,
      blobs: [[0, 0, 6.0, 4.1], [-4.4, 2.2, 2.9, 2.3], [4.9, -2.1, 3.2, 2.4]]
    },
    {
      id: "it-12",
      cx: 60,
      cy: 60,
      seed: 251,
      blobs: [[0, 0, 6.7, 4.7], [5.2, 1.8, 3.4, 2.8], [-4.9, -2.7, 3.1, 2.5]]
    },
    {
      id: "it-13",
      cx: 88,
      cy: 57,
      seed: 263,
      blobs: [[0, 0, 7.8, 5.8], [-6.2, 2.7, 3.9, 3.2], [6.1, -2.6, 4.0, 3.2], [1.4, -5.8, 3.0, 2.4]]
    }
  ];

  const mapConfigs = {
    english: {
      storageKey: "english-map-v1",
      code: "EN",
      title: "English Map",
      kicker: "Территория английского",
      genericName: "English island",
      genericDescription: "Часть общей территории английского. Засчитывается любая практика.",
      ariaName: "английского",
      claimName: "английской карты",
      defaultIsland: "speaking",
      islandSpecs: englishIslandSpecs
    },
    it: {
      storageKey: "it-map-v1",
      code: "IT",
      title: "IT Map",
      kicker: "Территория IT",
      genericName: "IT island",
      genericDescription: "Часть общей территории IT. Засчитывается обучение, код и практика.",
      ariaName: "IT",
      claimName: "IT-карты",
      defaultIsland: "it-07",
      islandSpecs: itIslandSpecs
    }
  };

  const canvas = document.getElementById("mapCanvas");
  const context = canvas.getContext("2d", { alpha: false });
  const balanceValue = document.getElementById("balanceValue");
  const mobileBalanceValue = document.getElementById("mobileBalanceValue");
  const studiedValue = document.getElementById("studiedValue");
  const claimedValue = document.getElementById("claimedValue");
  const islandName = document.getElementById("islandName");
  const islandDescription = document.getElementById("islandDescription");
  const islandClaimed = document.getElementById("islandClaimed");
  const islandTotal = document.getElementById("islandTotal");
  const claimNextButton = document.getElementById("claimNext");
  const timerButton = document.getElementById("timerButton");
  const timeDialog = document.getElementById("timeDialog");
  const timeForm = document.getElementById("timeForm");
  const timeAmount = document.getElementById("timeAmount");
  const timeHelp = document.getElementById("timeHelp");
  const timeError = document.getElementById("timeError");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastAction = document.getElementById("toastAction");
  const brandMark = document.getElementById("brandMark");
  const brandTitle = document.getElementById("brandTitle");
  const islandKicker = document.getElementById("islandKicker");
  const mapSwitchButtons = Array.from(document.querySelectorAll("[data-map]"));
  const vocabularyDialog = document.getElementById("vocabularyDialog");
  const vocabularyLearnedValue = document.getElementById("vocabularyLearnedValue");
  const vocabularyTotal = document.getElementById("vocabularyTotal");
  const vocabularyLearned = document.getElementById("vocabularyLearned");
  const vocabularyDue = document.getElementById("vocabularyDue");
  const vocabularyDueBadge = document.getElementById("vocabularyDueBadge");
  const reviewCalloutCount = document.getElementById("reviewCalloutCount");
  const startDueReviewButton = document.getElementById("startDueReview");
  const wordForm = document.getElementById("wordForm");
  const wordTerm = document.getElementById("wordTerm");
  const wordTranslation = document.getElementById("wordTranslation");
  const wordExample = document.getElementById("wordExample");
  const wordError = document.getElementById("wordError");
  const wordSearch = document.getElementById("wordSearch");
  const wordList = document.getElementById("wordList");
  const wordEmpty = document.getElementById("wordEmpty");
  const vocabularyListPanel = document.getElementById("vocabularyListPanel");
  const vocabularyReviewPanel = document.getElementById("vocabularyReviewPanel");
  const vocabularyViewButtons = Array.from(document.querySelectorAll("[data-vocabulary-view]"));
  const wordFilterButtons = Array.from(document.querySelectorAll("[data-word-filter]"));
  const reviewStage = document.getElementById("reviewStage");
  const reviewFinish = document.getElementById("reviewFinish");
  const reviewProgress = document.getElementById("reviewProgress");
  const reviewTerm = document.getElementById("reviewTerm");
  const reviewExample = document.getElementById("reviewExample");
  const reviewAnswer = document.getElementById("reviewAnswer");
  const reviewTranslation = document.getElementById("reviewTranslation");
  const reviewReveal = document.getElementById("reviewReveal");
  const reviewRatings = document.getElementById("reviewRatings");
  const reviewFinishTitle = document.getElementById("reviewFinishTitle");
  const reviewFinishText = document.getElementById("reviewFinishText");

  function clampLevel(value) {
    const number = Math.floor(Number(value));
    return Number.isFinite(number) ? Math.max(0, Math.min(REVIEW_INTERVALS.length - 1, number)) : 0;
  }

  function makeWordId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
  }

  function normalizeWord(item, index) {
    if (!item || typeof item !== "object") return null;
    const term = String(item.term || "").trim().slice(0, 80);
    const translation = String(item.translation || "").trim().slice(0, 140);
    if (!term || !translation) return null;
    const now = Date.now();
    return {
      id: typeof item.id === "string" && item.id ? item.id : makeWordId(),
      term: term,
      translation: translation,
      example: String(item.example || "").trim().slice(0, 240),
      createdAt: Number.isFinite(item.createdAt) ? item.createdAt : now - index,
      level: clampLevel(item.level),
      streak: Math.max(0, Math.floor(Number(item.streak) || 0)),
      reviewCount: Math.max(0, Math.floor(Number(item.reviewCount) || 0)),
      nextReviewAt: Number.isFinite(item.nextReviewAt) ? item.nextReviewAt : 0,
      lastReviewedAt: Number.isFinite(item.lastReviewedAt) ? item.lastReviewedAt : null
    };
  }

  function readVocabulary() {
    try {
      const parsed = JSON.parse(localStorage.getItem(VOCABULARY_STORAGE_KEY) || "null");
      const source = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.words) ? parsed.words : [];
      return source.map(normalizeWord).filter(Boolean).slice(0, 5000);
    } catch (error) {
      return [];
    }
  }

  let vocabulary = readVocabulary();
  let wordFilter = "all";
  let reviewQueue = [];
  let reviewIndex = 0;
  let reviewRemembered = 0;
  let reviewForgotten = 0;
  let reviewStartLearned = 0;
  let reviewPracticeOnly = false;
  let pendingDeleteWordId = null;
  let pendingDeleteTimer = null;

  function persistVocabulary() {
    try {
      localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify({ version: 1, words: vocabulary }));
    } catch (error) {
      if (!vocabularyDialog.open) showToast("Не удалось сохранить словарь в этом браузере.");
    }
  }

  function wordIsLearned(word) {
    return word.level >= LEARNED_LEVEL;
  }

  function wordIsDue(word) {
    return !word.nextReviewAt || word.nextReviewAt <= Date.now();
  }

  function vocabularyStats() {
    return vocabulary.reduce(function (result, word) {
      if (wordIsLearned(word)) result.learned += 1;
      if (wordIsDue(word)) result.due += 1;
      return result;
    }, { total: vocabulary.length, learned: 0, due: 0 });
  }

  function formatNextReview(word) {
    if (wordIsDue(word)) return "сейчас";
    const delta = word.nextReviewAt - Date.now();
    if (delta < 60 * 60 * 1000) return "через " + Math.max(1, Math.ceil(delta / 60000)) + " мин";
    if (delta < DAY) return "через " + Math.ceil(delta / (60 * 60 * 1000)) + " ч";
    return new Intl.DateTimeFormat("ru", { day: "numeric", month: "short" }).format(new Date(word.nextReviewAt));
  }

  function wordStatus(word) {
    if (wordIsLearned(word)) return { label: "Выучено", className: "is-learned" };
    if (!word.reviewCount) return { label: "Новое", className: "" };
    return { label: "Учу " + word.level + "/" + LEARNED_LEVEL, className: "" };
  }

  function renderWordList() {
    const query = wordSearch.value.trim().toLocaleLowerCase("ru");
    const visibleWords = vocabulary.filter(function (word) {
      const matchesFilter = wordFilter === "all" ||
        (wordFilter === "learned" && wordIsLearned(word)) ||
        (wordFilter === "learning" && !wordIsLearned(word));
      if (!matchesFilter) return false;
      if (!query) return true;
      return [word.term, word.translation, word.example].some(function (value) {
        return value.toLocaleLowerCase("ru").includes(query);
      });
    }).sort(function (a, b) {
      if (wordIsDue(a) !== wordIsDue(b)) return wordIsDue(a) ? -1 : 1;
      return b.createdAt - a.createdAt;
    });

    wordList.replaceChildren();
    wordEmpty.hidden = visibleWords.length > 0;
    const emptyTitle = wordEmpty.querySelector("h3");
    const emptyText = wordEmpty.querySelector("p");
    if (!visibleWords.length && vocabulary.length) {
      emptyTitle.textContent = "По этому фильтру пусто";
      emptyText.textContent = "Попробуй другой запрос или покажи все слова.";
    } else {
      emptyTitle.textContent = "Первое слово задаст ритм";
      emptyText.textContent = "Добавь слово слева. Оно сразу появится в режиме повторения.";
    }

    visibleWords.forEach(function (word) {
      const item = document.createElement("article");
      item.className = "word-item";

      const copy = document.createElement("div");
      copy.className = "word-item__copy";
      const term = document.createElement("strong");
      term.lang = "en";
      term.textContent = word.term;
      const translation = document.createElement("span");
      translation.textContent = word.translation;
      copy.append(term, translation);
      if (word.example) {
        const example = document.createElement("small");
        example.lang = "en";
        example.textContent = word.example;
        copy.append(example);
      }

      const status = wordStatus(word);
      const statusBox = document.createElement("div");
      statusBox.className = "word-status";
      const statusLabel = document.createElement("b");
      statusLabel.className = status.className;
      statusLabel.textContent = status.label;
      const nextReview = document.createElement("small");
      nextReview.textContent = formatNextReview(word);
      statusBox.append(statusLabel, nextReview);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "word-delete";
      remove.dataset.wordDelete = word.id;
      remove.setAttribute("aria-label", "Удалить " + word.term);
      if (pendingDeleteWordId === word.id) {
        remove.classList.add("is-confirm");
        remove.textContent = "✓";
        remove.title = "Нажми ещё раз, чтобы удалить";
      } else {
        remove.textContent = "×";
        remove.title = "Удалить слово";
      }

      item.append(copy, statusBox, remove);
      wordList.append(item);
    });
  }

  function updateVocabularyInterface() {
    const stats = vocabularyStats();
    vocabularyLearnedValue.textContent = stats.learned;
    vocabularyTotal.textContent = stats.total;
    vocabularyLearned.textContent = stats.learned;
    vocabularyDue.textContent = stats.due;
    vocabularyDueBadge.textContent = stats.due;
    reviewCalloutCount.textContent = stats.due;
    startDueReviewButton.disabled = stats.total === 0;
    startDueReviewButton.textContent = stats.due ? "Начать повторение →" : "Открыть режим →";
    renderWordList();
  }

  function setVocabularyView(view) {
    const showList = view === "list";
    vocabularyListPanel.hidden = !showList;
    vocabularyReviewPanel.hidden = showList;
    vocabularyViewButtons.forEach(function (button) {
      button.setAttribute("aria-selected", String(button.dataset.vocabularyView === view));
    });
    document.querySelector(".vocabulary-shell").scrollTop = 0;
    if (showList) renderWordList();
  }

  function showReviewFinish(hadSession) {
    reviewStage.hidden = true;
    reviewFinish.hidden = false;
    reviewProgress.textContent = reviewQueue.length ? reviewQueue.length + " / " + reviewQueue.length : "0 / 0";
    const learnedNow = vocabularyStats().learned;
    const learnedGain = Math.max(0, learnedNow - reviewStartLearned);
    const reviewAllWords = document.getElementById("reviewAllWords");
    reviewAllWords.hidden = vocabulary.length === 0;

    if (hadSession) {
      reviewFinishTitle.textContent = reviewPracticeOnly ? "Свободное повторение завершено" : "Повторение завершено";
      reviewFinishText.textContent = "Помнишь: " + reviewRemembered + ". Повторить раньше: " + reviewForgotten +
        (learnedGain ? ". Новых выученных: " + learnedGain + "." : ".");
    } else if (!vocabulary.length) {
      reviewFinishTitle.textContent = "Слов пока нет";
      reviewFinishText.textContent = "Добавь первое слово, и оно сразу появится здесь.";
    } else {
      reviewFinishTitle.textContent = "На сегодня всё";
      reviewFinishText.textContent = "По расписанию слов нет. Можно повторить весь словарь без изменения очереди.";
    }
  }

  function showCurrentReviewWord() {
    if (reviewIndex >= reviewQueue.length) {
      showReviewFinish(reviewQueue.length > 0);
      return;
    }
    const word = vocabulary.find(function (item) { return item.id === reviewQueue[reviewIndex]; });
    if (!word) {
      reviewIndex += 1;
      showCurrentReviewWord();
      return;
    }

    reviewStage.hidden = false;
    reviewFinish.hidden = true;
    reviewProgress.textContent = reviewIndex + 1 + " / " + reviewQueue.length;
    reviewTerm.textContent = word.term;
    reviewTranslation.textContent = word.translation;
    reviewExample.textContent = word.example;
    reviewExample.hidden = !word.example;
    reviewAnswer.hidden = true;
    reviewRatings.hidden = true;
    reviewReveal.hidden = false;
    reviewReveal.focus({ preventScroll: true });
  }

  function startReview(includeAll) {
    const candidates = vocabulary.filter(function (word) { return includeAll || wordIsDue(word); });
    candidates.sort(function (a, b) {
      return (a.nextReviewAt || 0) - (b.nextReviewAt || 0) || a.level - b.level || a.createdAt - b.createdAt;
    });
    reviewQueue = candidates.map(function (word) { return word.id; });
    reviewIndex = 0;
    reviewRemembered = 0;
    reviewForgotten = 0;
    reviewStartLearned = vocabularyStats().learned;
    reviewPracticeOnly = Boolean(includeAll);
    setVocabularyView("review");
    if (reviewQueue.length) showCurrentReviewWord();
    else showReviewFinish(false);
  }

  function recordReview(result) {
    const word = vocabulary.find(function (item) { return item.id === reviewQueue[reviewIndex]; });
    if (!word) {
      reviewIndex += 1;
      showCurrentReviewWord();
      return;
    }

    const now = Date.now();
    if (result === "remember") {
      reviewRemembered += 1;
    } else {
      reviewForgotten += 1;
    }

    if (!reviewPracticeOnly) {
      word.lastReviewedAt = now;
      word.reviewCount += 1;
      if (result === "remember") {
        word.level = Math.min(REVIEW_INTERVALS.length - 1, word.level + 1);
        word.streak += 1;
        word.nextReviewAt = now + REVIEW_INTERVALS[word.level];
      } else {
        word.level = Math.max(0, word.level - 1);
        word.streak = 0;
        word.nextReviewAt = now + 10 * 60 * 1000;
      }
      persistVocabulary();
      updateVocabularyInterface();
    }
    reviewIndex += 1;
    showCurrentReviewWord();
  }

  function noise(x, y, seed) {
    let value = Math.imul(x + seed * 17, 374761393) + Math.imul(y - seed * 11, 668265263);
    value = (value ^ (value >>> 13)) >>> 0;
    value = Math.imul(value, 1274126177) >>> 0;
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  }

  function buildCells(spec) {
    const cells = [];
    const extentX = Math.max.apply(null, spec.blobs.map(function (blob) { return Math.abs(blob[0]) + blob[2]; })) + 2;
    const extentY = Math.max.apply(null, spec.blobs.map(function (blob) { return Math.abs(blob[1]) + blob[3]; })) + 2;

    for (let gy = Math.max(1, Math.floor(spec.cy - extentY)); gy <= Math.min(GRID_HEIGHT - 2, Math.ceil(spec.cy + extentY)); gy += 1) {
      for (let gx = Math.max(1, Math.floor(spec.cx - extentX)); gx <= Math.min(GRID_WIDTH - 2, Math.ceil(spec.cx + extentX)); gx += 1) {
        let nearest = Infinity;
        spec.blobs.forEach(function (blob) {
          const dx = (gx - (spec.cx + blob[0])) / blob[2];
          const dy = (gy - (spec.cy + blob[1])) / blob[3];
          nearest = Math.min(nearest, dx * dx + dy * dy);
        });
        const shoreline = 0.91 + (noise(gx, gy, spec.seed) - 0.5) * 0.28;
        if (nearest <= shoreline) {
          cells.push({
            id: spec.id + ":" + gx + "," + gy,
            islandId: spec.id,
            gx: gx,
            gy: gy,
            x: gx * PITCH,
            y: gy * PITCH,
            centerDistance: Math.pow(gx - spec.cx, 2) + Math.pow(gy - spec.cy, 2),
            tone: noise(gx + 19, gy - 7, spec.seed)
          });
        }
      }
    }

    return cells.sort(function (a, b) {
      return a.centerDistance - b.centerDistance || a.id.localeCompare(b.id);
    });
  }

  const mapDataById = Object.keys(mapConfigs).reduce(function (result, mapId) {
    const islandsForMap = mapConfigs[mapId].islandSpecs.map(function (spec) {
      return Object.assign({}, spec, { cells: buildCells(spec) });
    });
    const cellsForMap = islandsForMap.flatMap(function (island) { return island.cells; });
    result[mapId] = {
      islands: islandsForMap,
      islandById: new Map(islandsForMap.map(function (island) { return [island.id, island]; })),
      allCells: cellsForMap,
      cellById: new Map(cellsForMap.map(function (cell) { return [cell.id, cell]; })),
      cellAtGrid: new Map(cellsForMap.map(function (cell) { return [cell.gx + "," + cell.gy, cell]; }))
    };
    return result;
  }, {});

  let savedMapId = null;
  try {
    savedMapId = localStorage.getItem(ACTIVE_MAP_KEY);
  } catch (error) {
    savedMapId = null;
  }
  let activeMapId = Object.prototype.hasOwnProperty.call(mapConfigs, savedMapId) ? savedMapId : "english";
  let mapConfig = mapConfigs[activeMapId];
  let islands = mapDataById[activeMapId].islands;
  let islandById = mapDataById[activeMapId].islandById;
  let allCells = mapDataById[activeMapId].allCells;
  let cellById = mapDataById[activeMapId].cellById;
  let cellAtGrid = mapDataById[activeMapId].cellAtGrid;

  function safeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
  }

  function readState() {
    const fallback = {
      balanceMinutes: 0,
      totalMinutes: 0,
      captured: [],
      selectedIsland: mapConfig.defaultIsland,
      timerStartedAt: null,
      sessions: []
    };

    try {
      const parsed = JSON.parse(localStorage.getItem(mapConfig.storageKey) || "null");
      if (!parsed || typeof parsed !== "object") return fallback;
      const captured = Array.isArray(parsed.captured)
        ? parsed.captured.filter(function (id) { return cellById.has(id); })
        : [];
      return {
        balanceMinutes: Math.floor(Number.isFinite(parsed.balanceMinutes) ? safeNumber(parsed.balanceMinutes) : safeNumber(parsed.balanceSeconds) / 60),
        totalMinutes: Math.floor(Number.isFinite(parsed.totalMinutes) ? safeNumber(parsed.totalMinutes) : safeNumber(parsed.totalSeconds) / 60),
        captured: Array.from(new Set(captured)),
        selectedIsland: islandById.has(parsed.selectedIsland) ? parsed.selectedIsland : mapConfig.defaultIsland,
        timerStartedAt: Number.isFinite(parsed.timerStartedAt) && parsed.timerStartedAt <= Date.now() ? parsed.timerStartedAt : null,
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions.slice(-120) : []
      };
    } catch (error) {
      return fallback;
    }
  }

  let state = readState();
  let captured = new Set(state.captured);
  let selectedIslandId = state.selectedIsland;
  let hoverCellId = null;
  let toastTimer = null;
  let toastCallback = null;
  let animationFrame = null;
  let claimPulse = null;
  let unit = "minutes";
  let viewportWidth = 0;
  let viewportHeight = 0;
  let didInitialFit = false;

  const camera = { x: 0, y: 0, zoom: 0.65 };

  function syncMapChrome() {
    document.body.dataset.map = activeMapId;
    document.title = mapConfig.title + " | Карта обучения";
    brandMark.textContent = mapConfig.code;
    brandTitle.textContent = mapConfig.title;
    islandKicker.textContent = mapConfig.kicker;
    mapSwitchButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.map === activeMapId));
    });
  }

  function activateMap(mapId, announce) {
    if (!Object.prototype.hasOwnProperty.call(mapConfigs, mapId) || mapId === activeMapId) return;

    clearTimeout(toastTimer);
    toastCallback = null;
    toast.classList.remove("is-visible");
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
    claimPulse = null;
    hoverCellId = null;

    activeMapId = mapId;
    mapConfig = mapConfigs[activeMapId];
    islands = mapDataById[activeMapId].islands;
    islandById = mapDataById[activeMapId].islandById;
    allCells = mapDataById[activeMapId].allCells;
    cellById = mapDataById[activeMapId].cellById;
    cellAtGrid = mapDataById[activeMapId].cellAtGrid;
    state = readState();
    captured = new Set(state.captured);
    selectedIslandId = state.selectedIsland;

    try {
      localStorage.setItem(ACTIVE_MAP_KEY, activeMapId);
    } catch (error) {
      // The active map still works for this session when storage is unavailable.
    }

    syncMapChrome();
    updateInterface();
    if (activeMapId !== "english" && vocabularyDialog.open) vocabularyDialog.close();
    if (viewportWidth && viewportHeight) fitCamera(false);
    if (announce) showToast(mapConfig.title + " открыта.");
  }

  function persist() {
    state.captured = Array.from(captured);
    state.selectedIsland = selectedIslandId;
    try {
      localStorage.setItem(mapConfig.storageKey, JSON.stringify(state));
    } catch (error) {
      showToast("Не удалось сохранить прогресс в этом браузере.");
    }
  }

  function plural(value, forms) {
    const number = Math.abs(Math.floor(value)) % 100;
    const last = number % 10;
    if (number > 10 && number < 20) return forms[2];
    if (last > 1 && last < 5) return forms[1];
    if (last === 1) return forms[0];
    return forms[2];
  }

  function formatClock(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const secs = safe % 60;
    return [hours, minutes, secs].map(function (value) { return String(value).padStart(2, "0"); }).join(":");
  }

  function formatBalance(minutesValue) {
    const safe = Math.max(0, Math.floor(minutesValue));
    const hours = Math.floor(safe / 60);
    const minutes = safe % 60;
    return hours + " ч " + String(minutes).padStart(2, "0") + " м";
  }

  function formatDuration(minutesValue) {
    const minutes = Math.max(0, Math.floor(minutesValue));
    if (minutes < 60) return minutes + " " + plural(minutes, ["минута", "минуты", "минут"]);
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? hours + " ч " + rest + " мин" : hours + " " + plural(hours, ["час", "часа", "часов"]);
  }

  function capturedOnIsland(island) {
    return island.cells.reduce(function (total, cell) { return total + (captured.has(cell.id) ? 1 : 0); }, 0);
  }

  function updateInterface() {
    const selected = islandById.get(selectedIslandId) || islands[0];
    const islandCount = capturedOnIsland(selected);
    const available = Math.floor(state.balanceMinutes / CELL_COST);
    const totalCaptured = captured.size;

    balanceValue.textContent = formatBalance(state.balanceMinutes);
    mobileBalanceValue.textContent = formatBalance(state.balanceMinutes);
    studiedValue.textContent = formatDuration(state.totalMinutes);
    claimedValue.textContent = totalCaptured + " " + plural(totalCaptured, ["клетка", "клетки", "клеток"]);
    islandName.textContent = selected.label || mapConfig.genericName;
    islandDescription.textContent = selected.description || mapConfig.genericDescription;
    islandClaimed.textContent = islandCount;
    islandTotal.textContent = selected.cells.length;

    if (islandCount >= selected.cells.length) {
      claimNextButton.textContent = "Остров полностью захвачен";
      claimNextButton.disabled = true;
    } else if (available < 1) {
      const missing = CELL_COST - state.balanceMinutes;
      claimNextButton.textContent = "Нужно ещё " + formatDuration(missing);
      claimNextButton.disabled = true;
    } else {
      claimNextButton.textContent = "Захватить клетку за 1 час";
      claimNextButton.disabled = false;
    }

    canvas.setAttribute(
      "aria-label",
      "Карта " + mapConfig.ariaName + ". Захвачено " + totalCaptured + " из " + allCells.length + " клеток. Доступно " + available + " " + plural(available, ["клетка", "клетки", "клеток"]) + "."
    );
    updateTimerButton();
  }

  function showToast(message, actionLabel, callback) {
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastCallback = typeof callback === "function" ? callback : null;
    toastAction.hidden = !toastCallback;
    toastAction.textContent = actionLabel || "Отменить";
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      toastCallback = null;
    }, toastCallback ? 5200 : 3400);
  }

  function addTime(minutesValue, source) {
    const amount = Math.max(1, Math.round(minutesValue));
    state.balanceMinutes += amount;
    state.totalMinutes += amount;
    state.sessions.push({ at: Date.now(), minutes: amount, source: source });
    state.sessions = state.sessions.slice(-120);
    persist();
    updateInterface();
    render();
    showToast(formatDuration(amount) + " добавлено на баланс " + mapConfig.title + ".");
  }

  function beginPulse(cell) {
    claimPulse = { cell: cell, startedAt: performance.now() };
    if (reduceMotion) {
      render();
      return;
    }
    if (!animationFrame) animationFrame = requestAnimationFrame(animatePulse);
  }

  function animatePulse(now) {
    render(now);
    if (claimPulse && now - claimPulse.startedAt < 700) {
      animationFrame = requestAnimationFrame(animatePulse);
    } else {
      claimPulse = null;
      animationFrame = null;
      render();
    }
  }

  function claimCell(cell) {
    selectedIslandId = cell.islandId;
    if (captured.has(cell.id)) {
      persist();
      updateInterface();
      render();
      return;
    }

    if (state.balanceMinutes < CELL_COST) {
      persist();
      updateInterface();
      render();
      showToast("До следующей клетки не хватает " + formatDuration(CELL_COST - state.balanceMinutes) + ".");
      return;
    }

    captured.add(cell.id);
    state.balanceMinutes -= CELL_COST;
    persist();
    updateInterface();
    beginPulse(cell);

    const island = islandById.get(cell.islandId);
    const claimMessage = island.label ? "Клетка " + island.label + " захвачена." : "Клетка " + mapConfig.claimName + " захвачена.";
    showToast(claimMessage, "Отменить", function () {
      if (!captured.has(cell.id)) return;
      captured.delete(cell.id);
      state.balanceMinutes += CELL_COST;
      persist();
      updateInterface();
      render();
      showToast("Захват отменён. Один час возвращён на баланс.");
    });
  }

  function claimNextOnSelected() {
    const selected = islandById.get(selectedIslandId);
    if (!selected) return;
    const next = selected.cells.find(function (cell) { return !captured.has(cell.id); });
    if (next) claimCell(next);
  }

  function fitCamera(fullMap) {
    if (!viewportWidth || !viewportHeight) return;
    const padding = viewportWidth < 760 ? 26 : 58;
    const fitZoom = Math.min(
      (viewportWidth - padding * 2) / WORLD_WIDTH,
      (viewportHeight - padding * 2) / WORLD_HEIGHT
    );
    camera.zoom = fullMap ? Math.max(0.18, fitZoom) : Math.max(0.46, fitZoom);
    if (!fullMap && viewportWidth < 760) {
      const selected = islandById.get(selectedIslandId) || islands[0];
      camera.x = viewportWidth * 0.5 - selected.cx * PITCH * camera.zoom;
      camera.y = viewportHeight * 0.38 - selected.cy * PITCH * camera.zoom;
    } else {
      camera.x = (viewportWidth - WORLD_WIDTH * camera.zoom) / 2;
      camera.y = (viewportHeight - WORLD_HEIGHT * camera.zoom) / 2;
    }
    render();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const previousWidth = viewportWidth;
    const previousHeight = viewportHeight;
    viewportWidth = Math.max(1, rect.width);
    viewportHeight = Math.max(1, rect.height);
    canvas.width = Math.round(viewportWidth * dpr);
    canvas.height = Math.round(viewportHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const crossedMobileBreakpoint = previousWidth > 0 && (previousWidth < 760) !== (viewportWidth < 760);
    const sizeChangedSignificantly = previousWidth > 0 && (
      Math.abs(viewportWidth - previousWidth) > previousWidth * 0.24 ||
      Math.abs(viewportHeight - previousHeight) > previousHeight * 0.24
    );
    if (!didInitialFit || crossedMobileBreakpoint || sizeChangedSignificantly) {
      didInitialFit = true;
      fitCamera(false);
    } else {
      render();
    }
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawSea() {
    const gradient = context.createRadialGradient(
      viewportWidth * 0.54,
      viewportHeight * 0.42,
      20,
      viewportWidth * 0.54,
      viewportHeight * 0.42,
      Math.max(viewportWidth, viewportHeight) * 0.78
    );
    gradient.addColorStop(0, "#0e1820");
    gradient.addColorStop(0.56, "#091118");
    gradient.addColorStop(1, "#070c12");
    context.fillStyle = gradient;
    context.fillRect(0, 0, viewportWidth, viewportHeight);

    context.save();
    context.translate(camera.x, camera.y);
    context.scale(camera.zoom, camera.zoom);
    context.fillStyle = "rgba(166, 205, 119, 0.055)";
    for (let gy = 0; gy <= GRID_HEIGHT; gy += 5) {
      for (let gx = 0; gx <= GRID_WIDTH; gx += 5) {
        const size = (gx + gy) % 10 === 0 ? 2.1 : 1.2;
        context.fillRect(gx * PITCH + 5, gy * PITCH + 5, size, size);
      }
    }
    context.restore();
  }

  function drawIslandLabel(island) {
    if (camera.zoom < 0.27) return;
    const x = island.cx * PITCH;
    const y = island.cy * PITCH;
    const claimedCount = capturedOnIsland(island);
    const title = island.label ? island.label.toUpperCase() : mapConfig.code;
    const subline = claimedCount + " / " + island.cells.length + " H";
    const titleSize = 15 / Math.max(camera.zoom, 0.48);
    const subSize = 9 / Math.max(camera.zoom, 0.48);

    context.save();
    context.font = "500 " + titleSize + "px 'English Display', sans-serif";
    const titleWidth = context.measureText(title).width;
    context.font = "600 " + subSize + "px 'English Mono', monospace";
    const subWidth = context.measureText(subline).width;
    const width = Math.max(titleWidth, subWidth) + 20 / camera.zoom;
    const height = 39 / camera.zoom;
    const left = x - width / 2;
    const top = y - height / 2;

    roundedRect(context, left, top, width, height, 6 / camera.zoom);
    context.fillStyle = island.id === selectedIslandId ? "rgba(11, 18, 23, 0.92)" : "rgba(10, 17, 23, 0.78)";
    context.fill();
    context.strokeStyle = island.id === selectedIslandId ? "rgba(195, 229, 154, 0.55)" : "rgba(218, 231, 234, 0.18)";
    context.lineWidth = 1 / camera.zoom;
    context.stroke();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "500 " + titleSize + "px 'English Display', sans-serif";
    context.fillStyle = "rgba(238, 243, 240, 0.96)";
    context.fillText(title, x, y - 6 / camera.zoom);
    context.font = "600 " + subSize + "px 'English Mono', monospace";
    context.fillStyle = claimedCount ? "#c3e59a" : "rgba(153, 167, 170, 0.85)";
    context.fillText(subline, x, y + 10 / camera.zoom);
    context.restore();
  }

  function render(now) {
    if (!viewportWidth || !viewportHeight) return;
    drawSea();

    context.save();
    context.translate(camera.x, camera.y);
    context.scale(camera.zoom, camera.zoom);

    islands.forEach(function (island) {
      const isSelected = island.id === selectedIslandId;
      island.cells.forEach(function (cell) {
        const isCaptured = captured.has(cell.id);
        const isHover = cell.id === hoverCellId;
        let fill = cell.tone > 0.63 ? "#28353d" : cell.tone > 0.3 ? "#243139" : "#202c34";

        if (!isSelected) context.globalAlpha = 0.73;
        if (isCaptured) {
          fill = cell.tone > 0.55 ? "#b4d987" : "#9fc873";
          context.globalAlpha = 1;
        } else if (isHover) {
          fill = "#34443d";
          context.globalAlpha = 1;
        } else if (isSelected) {
          context.globalAlpha = 0.96;
        }

        context.fillStyle = fill;
        context.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);

        if (isHover && !isCaptured) {
          context.strokeStyle = "#c3e59a";
          context.lineWidth = Math.max(1, 1.25 / camera.zoom);
          context.strokeRect(cell.x - 1, cell.y - 1, CELL_SIZE + 2, CELL_SIZE + 2);
        }
        context.globalAlpha = 1;
      });
    });

    if (claimPulse) {
      const elapsed = Math.max(0, (typeof now === "number" ? now : performance.now()) - claimPulse.startedAt);
      const progress = Math.min(1, elapsed / 700);
      const centerX = claimPulse.cell.x + CELL_SIZE / 2;
      const centerY = claimPulse.cell.y + CELL_SIZE / 2;
      context.beginPath();
      context.arc(centerX, centerY, CELL_SIZE * (0.8 + progress * 3.2), 0, Math.PI * 2);
      context.strokeStyle = "rgba(195, 229, 154, " + (1 - progress) * 0.72 + ")";
      context.lineWidth = 2 / camera.zoom;
      context.stroke();
    }

    islands.forEach(drawIslandLabel);
    context.restore();
  }

  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - camera.x) / camera.zoom,
      y: (clientY - rect.top - camera.y) / camera.zoom
    };
  }

  function cellFromPoint(clientX, clientY) {
    const world = screenToWorld(clientX, clientY);
    const gx = Math.floor(world.x / PITCH);
    const gy = Math.floor(world.y / PITCH);
    const cell = cellAtGrid.get(gx + "," + gy);
    if (!cell) return null;
    const localX = world.x - cell.x;
    const localY = world.y - cell.y;
    return localX >= 0 && localX <= CELL_SIZE && localY >= 0 && localY <= CELL_SIZE ? cell : null;
  }

  function zoomAt(factor, clientX, clientY) {
    const before = screenToWorld(clientX, clientY);
    camera.zoom = Math.max(0.18, Math.min(2.25, camera.zoom * factor));
    const rect = canvas.getBoundingClientRect();
    camera.x = clientX - rect.left - before.x * camera.zoom;
    camera.y = clientY - rect.top - before.y * camera.zoom;
    render();
  }

  let pointer = null;
  canvas.addEventListener("pointerdown", function (event) {
    pointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });

  canvas.addEventListener("pointermove", function (event) {
    if (pointer && pointer.id === event.pointerId) {
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 4) pointer.moved = true;
      if (pointer.moved) {
        camera.x += dx;
        camera.y += dy;
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        render();
      }
      return;
    }

    const hovered = cellFromPoint(event.clientX, event.clientY);
    const nextHover = hovered ? hovered.id : null;
    if (nextHover !== hoverCellId) {
      hoverCellId = nextHover;
      canvas.style.cursor = hovered ? "pointer" : "grab";
      render();
    }
  });

  canvas.addEventListener("pointerup", function (event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const wasMoved = pointer.moved;
    pointer = null;
    canvas.classList.remove("is-dragging");
    if (!wasMoved) {
      const cell = cellFromPoint(event.clientX, event.clientY);
      if (cell) claimCell(cell);
    }
  });

  canvas.addEventListener("pointercancel", function () {
    pointer = null;
    canvas.classList.remove("is-dragging");
  });

  canvas.addEventListener("pointerleave", function () {
    if (!pointer && hoverCellId) {
      hoverCellId = null;
      render();
    }
  });

  canvas.addEventListener("wheel", function (event) {
    event.preventDefault();
    zoomAt(event.deltaY < 0 ? 1.1 : 0.9, event.clientX, event.clientY);
  }, { passive: false });

  canvas.addEventListener("keydown", function (event) {
    const pan = 40;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      claimNextOnSelected();
    } else if (event.key === "ArrowLeft") {
      camera.x += pan;
    } else if (event.key === "ArrowRight") {
      camera.x -= pan;
    } else if (event.key === "ArrowUp") {
      camera.y += pan;
    } else if (event.key === "ArrowDown") {
      camera.y -= pan;
    } else if (event.key === "+" || event.key === "=") {
      zoomAt(1.12, canvas.getBoundingClientRect().left + viewportWidth / 2, canvas.getBoundingClientRect().top + viewportHeight / 2);
      return;
    } else if (event.key === "-") {
      zoomAt(0.88, canvas.getBoundingClientRect().left + viewportWidth / 2, canvas.getBoundingClientRect().top + viewportHeight / 2);
      return;
    } else {
      return;
    }
    event.preventDefault();
    render();
  });

  mapSwitchButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activateMap(button.dataset.map, true);
    });
  });

  document.getElementById("openVocabulary").addEventListener("click", function () {
    wordError.hidden = true;
    wordForm.reset();
    updateVocabularyInterface();
    setVocabularyView("list");
    vocabularyDialog.showModal();
    window.setTimeout(function () { wordTerm.focus(); }, 0);
  });

  document.getElementById("closeVocabularyDialog").addEventListener("click", function () {
    vocabularyDialog.close();
  });

  vocabularyDialog.addEventListener("click", function (event) {
    const rect = vocabularyDialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) vocabularyDialog.close();
  });

  vocabularyViewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.vocabularyView === "review") startReview(false);
      else setVocabularyView("list");
    });
  });

  wordFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      wordFilter = button.dataset.wordFilter;
      wordFilterButtons.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderWordList();
    });
  });

  wordSearch.addEventListener("input", renderWordList);

  wordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const term = wordTerm.value.trim();
    const translation = wordTranslation.value.trim();
    const example = wordExample.value.trim();
    const duplicate = vocabulary.find(function (word) {
      return word.term.toLocaleLowerCase("en") === term.toLocaleLowerCase("en");
    });

    if (!term || !translation) {
      wordError.textContent = "Заполни слово и перевод.";
      wordError.hidden = false;
      return;
    }
    if (duplicate) {
      wordError.textContent = "Такое слово уже есть в словаре.";
      wordError.hidden = false;
      wordTerm.focus();
      return;
    }

    vocabulary.unshift({
      id: makeWordId(),
      term: term.slice(0, 80),
      translation: translation.slice(0, 140),
      example: example.slice(0, 240),
      createdAt: Date.now(),
      level: 0,
      streak: 0,
      reviewCount: 0,
      nextReviewAt: 0,
      lastReviewedAt: null
    });
    persistVocabulary();
    wordError.hidden = true;
    wordForm.reset();
    wordFilter = "all";
    wordFilterButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.wordFilter === "all"));
    });
    wordSearch.value = "";
    updateVocabularyInterface();

    const submitButton = wordForm.querySelector("button[type='submit']");
    submitButton.textContent = "Добавлено ✓";
    window.setTimeout(function () { submitButton.textContent = "Добавить в словарь"; }, 900);
    wordTerm.focus();
  });

  wordList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-word-delete]");
    if (!button) return;
    const wordId = button.dataset.wordDelete;
    if (pendingDeleteWordId !== wordId) {
      pendingDeleteWordId = wordId;
      clearTimeout(pendingDeleteTimer);
      pendingDeleteTimer = window.setTimeout(function () {
        pendingDeleteWordId = null;
        renderWordList();
      }, 2600);
      renderWordList();
      return;
    }

    clearTimeout(pendingDeleteTimer);
    pendingDeleteWordId = null;
    vocabulary = vocabulary.filter(function (word) { return word.id !== wordId; });
    persistVocabulary();
    updateVocabularyInterface();
  });

  startDueReviewButton.addEventListener("click", function () { startReview(false); });
  document.getElementById("reviewBack").addEventListener("click", function () { setVocabularyView("list"); });
  document.getElementById("reviewFinishBack").addEventListener("click", function () { setVocabularyView("list"); });
  document.getElementById("reviewAllWords").addEventListener("click", function () { startReview(true); });

  reviewReveal.addEventListener("click", function () {
    reviewAnswer.hidden = false;
    reviewReveal.hidden = true;
    reviewRatings.hidden = false;
    reviewRatings.querySelector("[data-review-result='remember']").focus({ preventScroll: true });
  });

  reviewRatings.addEventListener("click", function (event) {
    const button = event.target.closest("[data-review-result]");
    if (button) recordReview(button.dataset.reviewResult);
  });

  function updateTimerButton() {
    if (!state.timerStartedAt) {
      timerButton.classList.remove("is-running");
      timerButton.textContent = "Начать занятие";
      return;
    }
    timerButton.classList.add("is-running");
    timerButton.textContent = "Завершить " + formatClock((Date.now() - state.timerStartedAt) / 1000);
  }

  timerButton.addEventListener("click", function () {
    if (!state.timerStartedAt) {
      state.timerStartedAt = Date.now();
      persist();
      updateTimerButton();
      showToast("Таймер занятия запущен.");
      return;
    }

    const elapsed = Math.floor((Date.now() - state.timerStartedAt) / 60000);
    state.timerStartedAt = null;
    if (elapsed < 1) {
      persist();
      updateInterface();
      showToast("Сессия короче минуты не добавлена на баланс.");
      return;
    }
    addTime(elapsed, "timer");
  });

  window.setInterval(function () {
    if (state.timerStartedAt) updateTimerButton();
  }, 1000);

  document.querySelectorAll("[data-add-minutes]").forEach(function (button) {
    button.addEventListener("click", function () {
      addTime(Number(button.dataset.addMinutes), "quick");
    });
  });

  document.getElementById("openTimeDialog").addEventListener("click", function () {
    timeError.hidden = true;
    timeDialog.showModal();
    window.setTimeout(function () {
      timeAmount.focus();
      timeAmount.select();
    }, 0);
  });

  document.getElementById("closeTimeDialog").addEventListener("click", function () {
    timeDialog.close();
  });

  timeDialog.addEventListener("click", function (event) {
    const rect = timeDialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) timeDialog.close();
  });

  document.querySelectorAll("[data-unit]").forEach(function (button) {
    button.addEventListener("click", function () {
      unit = button.dataset.unit;
      document.querySelectorAll("[data-unit]").forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      if (unit === "hours") {
        timeAmount.min = "0.25";
        timeAmount.max = "24";
        timeAmount.step = "0.25";
        timeAmount.value = "1";
        timeHelp.textContent = "Можно добавлять четверти часа, например 1,25.";
      } else {
        timeAmount.min = "1";
        timeAmount.max = "1440";
        timeAmount.step = "1";
        timeAmount.value = "30";
        timeHelp.textContent = "Можно добавить от 1 до 1440 минут.";
      }
      timeError.hidden = true;
      timeAmount.focus();
      timeAmount.select();
    });
  });

  timeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = Number(String(timeAmount.value).replace(",", "."));
    const min = unit === "hours" ? 0.25 : 1;
    const max = unit === "hours" ? 24 : 1440;
    if (!Number.isFinite(value) || value < min || value > max) {
      timeError.textContent = unit === "hours" ? "Укажи значение от 0,25 до 24 часов." : "Укажи значение от 1 до 1440 минут.";
      timeError.hidden = false;
      timeAmount.focus();
      return;
    }
    const minutes = value * (unit === "hours" ? 60 : 1);
    timeDialog.close();
    addTime(minutes, "manual");
  });

  claimNextButton.addEventListener("click", claimNextOnSelected);

  document.getElementById("zoomIn").addEventListener("click", function () {
    const rect = canvas.getBoundingClientRect();
    zoomAt(1.15, rect.left + viewportWidth / 2, rect.top + viewportHeight / 2);
  });

  document.getElementById("zoomOut").addEventListener("click", function () {
    const rect = canvas.getBoundingClientRect();
    zoomAt(0.86, rect.left + viewportWidth / 2, rect.top + viewportHeight / 2);
  });

  document.getElementById("fitMap").addEventListener("click", function () {
    fitCamera(true);
  });

  toastAction.addEventListener("click", function () {
    const callback = toastCallback;
    toastCallback = null;
    toast.classList.remove("is-visible");
    if (callback) callback();
  });

  window.addEventListener("storage", function (event) {
    if (event.key === VOCABULARY_STORAGE_KEY) {
      vocabulary = readVocabulary();
      updateVocabularyInterface();
      return;
    }
    if (event.key === ACTIVE_MAP_KEY && Object.prototype.hasOwnProperty.call(mapConfigs, event.newValue)) {
      activateMap(event.newValue, false);
      return;
    }
    if (event.key !== mapConfig.storageKey) return;
    state = readState();
    captured = new Set(state.captured);
    selectedIslandId = state.selectedIsland;
    updateInterface();
    render();
  });

  const observer = new ResizeObserver(resizeCanvas);
  observer.observe(canvas);
  document.fonts.ready.then(render);
  syncMapChrome();
  updateVocabularyInterface();
  updateInterface();
})();
