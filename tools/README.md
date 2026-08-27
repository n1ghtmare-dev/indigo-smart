# Служебные скрипты

Не деплоятся: на сервер уезжает только `landing-root/`.

## build-cubanoid-articles.py

Пересобирает страницы статей девлога Cubanoid из markdown-исходников.

- **Читает:** `C:\www-Oleg\Cubanoid\docs\devlog\*.md` и `docs/devlog/img/*.png`
- **Пишет:** `landing-root/plans/cubanoid-articles/` (страницы + `img/`)

```sh
python tools/build-cubanoid-articles.py
```

Запускать после правки текста статьи или когда появятся новые скриншоты игры.
Новые кадры сначала кладутся в `Cubanoid/docs/devlog/part-1/`, затем
прописываются в словарь `IMAGES` внутри скрипта — иначе на их месте останется
заглушка «нужен скриншот».
