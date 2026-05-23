# Автодеплой через GitHub Actions — дизайн

**Дата:** 2026-05-23
**Репозиторий:** `n1ghtmare-dev/indigo-smart`
**Ветка:** `main`

## Цель

Настроить непрерывный деплой: после `git push` в `main` обновлённые backend и frontend автоматически разворачиваются на VPS без ручных действий.

## Контекст

Проект `IndigoSmart` — IoT-дашборд умного дома (дипломный проект). Состоит из трёх сервисов в одном `docker-compose.yml`:

- `mysql` — MySQL 9.0 c томом `mysql_data` и инициализирующими SQL-скриптами
- `backend` — FastAPI на Python 3.12 (`smart-app/`), порт 8000
- `frontend` — React SPA, отдаётся через nginx (`smart-board/`), порт 3000

На VPS уже стоит Docker, проект развёрнут (склонирован, контейнеры запущены).

## Ограничения и решения

| Вопрос | Решение |
|---|---|
| Куда деплоим | Свой VPS по SSH |
| Как доставляются образы | Build в CI → push в GHCR → `docker compose pull` на сервере |
| Когда запускается | На каждый push в `main` |
| Тесты в CI | Нет (для дипломного проекта избыточно) |
| Dev/prod конфиг | Отдельный `docker-compose.prod.yml`, секреты из `.env` на сервере |

## Архитектура workflow

```
push в main
    │
    ▼
GitHub Actions: .github/workflows/deploy.yml
    │
    ├─ job: build-and-push  (runs-on: ubuntu-latest)
    │   ├─ checkout
    │   ├─ docker/login-action → ghcr.io (через встроенный GITHUB_TOKEN)
    │   ├─ docker/setup-buildx-action
    │   ├─ build smart-app   → ghcr.io/n1ghtmare-dev/indigo-smart-backend:{latest, <sha>}
    │   └─ build smart-board → ghcr.io/n1ghtmare-dev/indigo-smart-frontend:{latest, <sha>}
    │       (с кэшем cache-from: type=gha, cache-to: type=gha,mode=max)
    │
    └─ job: deploy  (needs: build-and-push)
        └─ appleboy/ssh-action → выполняет на VPS:
            cd $DEPLOY_PATH
            echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u <user> --password-stdin
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
            docker image prune -f
```

## Файлы, добавляемые в репозиторий

### 1. `.github/workflows/deploy.yml`

Workflow с двумя job — сначала собираем и пушим образы, потом по SSH триггерим обновление на сервере.

Ключевые элементы:
- `on: push: branches: [main]` + `workflow_dispatch` (кнопка ручного запуска)
- `permissions: contents: read, packages: write` — нужно для push в GHCR
- В шаге логина используется `${{ secrets.GITHUB_TOKEN }}` — токен встроен в Actions, отдельный PAT не нужен
- Тегирование: `:latest` и `:${{ github.sha }}` — для возможности отката
- `appleboy/ssh-action@v1` с параметрами `host`, `username`, `key`, `script`

### 2. `docker-compose.prod.yml`

Копия `docker-compose.yml`, но:
- Сервисы `backend` и `frontend`: `build:` заменён на `image: ghcr.io/n1ghtmare-dev/indigo-smart-backend:latest` (и `-frontend`)
- Все хардкод-значения заменены на интерполяцию из `.env`:
  - `MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}`
  - `MYSQL_PASSWORD: ${MYSQL_PASSWORD}`
  - `DB_PASSWORD: ${DB_PASSWORD}`
  - `JWT_SECRET: ${JWT_SECRET}`
  - `REACT_APP_API_URL: ${REACT_APP_API_URL}`

### 3. `.env.prod.example`

Шаблон `.env` для сервера. Документирует все требуемые переменные с заглушками. Коммитится в репо.

```env
# MySQL
MYSQL_ROOT_PASSWORD=change-me
MYSQL_PASSWORD=change-me

# Backend
DB_PASSWORD=change-me
JWT_SECRET=generate-with-openssl-rand-hex-32

# Frontend
REACT_APP_API_URL=https://api.example.com
```

### 4. Дополнение к `.gitignore`

Добавить строку `.env` (если ещё не закрыта), чтобы реальный `.env` никогда не попал в репо.

## Что готовится на сервере (одноразово, вручную)

Документируется отдельно в `docs/deploy-server-setup.md`:

1. Убедиться, что репо склонировано в `$DEPLOY_PATH` (например, `/home/deploy/indigo-smart`)
2. Скопировать `.env.prod.example` → `.env`, заполнить реальными значениями
3. Создать SSH-ключ для деплоя:
   ```
   ssh-keygen -t ed25519 -f ~/.ssh/indigo_deploy -N ""
   cat ~/.ssh/indigo_deploy.pub >> ~/.ssh/authorized_keys
   ```
4. Приватный ключ (`~/.ssh/indigo_deploy`) → GitHub Secret `SSH_KEY`
5. Первый запуск: `docker login ghcr.io` локально на сервере под тем же пользователем — не обязательно, т.к. workflow логинится сам, но можно для верификации

## GitHub Secrets

Заводятся в Settings → Secrets and variables → Actions:

| Имя | Значение | Где используется |
|---|---|---|
| `SSH_HOST` | IP или домен VPS | `appleboy/ssh-action.host` |
| `SSH_USER` | Логин на сервере (`deploy` / `root`) | `appleboy/ssh-action.username` |
| `SSH_KEY` | Приватный ключ ed25519 (весь файл) | `appleboy/ssh-action.key` |
| `DEPLOY_PATH` | Абсолютный путь к compose на сервере | `script: cd $DEPLOY_PATH` |

`GHCR_TOKEN` — **не нужен**: используется встроенный `secrets.GITHUB_TOKEN`, у которого есть `packages: write` при правильной настройке `permissions:` блока workflow.

## Безопасность и устойчивость

- `.env` никогда не коммитится — все секреты только на сервере
- `:latest` + `:<sha>` тегирование — откат через ручное редактирование compose на тег нужной версии
- `restart: unless-stopped` уже в compose — контейнер сам поднимется
- `docker image prune -f` после деплоя — старые образы не забивают диск
- `mysql_data` — именованный volume, при `up -d` данные сохраняются
- Минимум прав у SSH-юзера: достаточно прав на `docker compose` (членство в группе `docker`)

## Что НЕ делаем (явно out of scope)

- Тесты, линт в CI
- Rolling deploy / health-check ожидание
- Blue/green
- Migrations runner (миграции по-прежнему через `docker-entrypoint-initdb.d`)
- Slack/Telegram нотификации об ошибках деплоя
- Отдельные окружения staging/prod (только prod)

## Критерии приёмки

1. После `git push` в `main` workflow запускается автоматически
2. Оба образа собираются и пушатся в `ghcr.io/n1ghtmare-dev/indigo-smart-backend` и `-frontend` с тегами `:latest` и `:<sha>`
3. После сборки workflow заходит на VPS по SSH и выполняет `docker compose pull && up -d`
4. Изменение в коде (например, текст на странице фронта) видно на проде через 2–4 минуты после push
5. Кнопка «Run workflow» в GitHub UI работает (ручной триггер)
6. `.env` НЕ попадает в репо; `.env.prod.example` попадает
