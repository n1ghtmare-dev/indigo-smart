# GitHub Actions Auto-Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Настроить непрерывный деплой: после `git push` в `main` обновлённые backend и frontend автоматически собираются в GHCR и разворачиваются на VPS через SSH.

**Architecture:** Двухjob workflow в GitHub Actions. Первый job собирает Docker-образы `smart-app` и `smart-board` с помощью buildx и пушит их в `ghcr.io/n1ghtmare-dev/indigo-smart-{backend,frontend}` с тегами `:latest` и `:<sha>`. Второй job по SSH (через `appleboy/ssh-action`) логинится на VPS и выполняет `docker compose -f docker-compose.prod.yml pull && up -d`. Прод-конфигурация лежит в отдельном `docker-compose.prod.yml` (`image:` вместо `build:`), секреты — в `.env` на сервере.

**Tech Stack:** GitHub Actions (workflow YAML), Docker Buildx, GitHub Container Registry (GHCR), `docker/build-push-action@v6`, `appleboy/ssh-action@v1`, Docker Compose v2.

**Spec:** `docs/superpowers/specs/2026-05-23-github-actions-deploy-design.md`

---

## File Structure

| Файл | Действие | Назначение |
|---|---|---|
| `.gitignore` | Modify (или restore) | Гарантировать, что `.env` не попадает в репо, но `.env.prod.example` попадает |
| `.env.prod.example` | Create | Шаблон переменных окружения для прода (коммитится) |
| `docker-compose.prod.yml` | Create | Прод-compose: образы из GHCR, секреты из `.env` |
| `.github/workflows/deploy.yml` | Create | CI/CD pipeline: build → push → SSH deploy |
| `docs/deploy-server-setup.md` | Create | Одноразовая инструкция по настройке VPS |

---

## Task 1: Защитить `.env` через `.gitignore`

**Files:**
- Modify: `.gitignore`

**Контекст:** В рабочем дереве `.gitignore` помечен как deleted (`git status` → `D .gitignore`). В коммите он содержит `.env` и `.env.*` — но шаблон `.env.*` заодно блокирует `.env.prod.example`, который мы хотим коммитить. Нужно восстановить `.gitignore` и добавить явное исключение.

- [ ] **Step 1: Проверить текущее состояние `.gitignore`**

Run: `git status --short -- .gitignore` и `Read .gitignore` (если файл существует в рабочем дереве)

Ожидаемые сценарии:
- Файл отсутствует (deleted) → восстановить из HEAD: `git checkout HEAD -- .gitignore`
- Файл есть → переходим к Step 2

- [ ] **Step 2: Добавить исключение для `.env.prod.example`**

В файл `.gitignore` после строки `*.env` добавить:

```gitignore
!.env.prod.example
```

Финальный фрагмент верха файла должен выглядеть так:

```gitignore
.gitignore
.env
.env.*
*.env
!.env.prod.example

__pycache__/
```

- [ ] **Step 3: Проверить, что правило работает**

Run: `git check-ignore -v .env.prod.example`
Expected: команда возвращает exit code 1 (файл НЕ игнорируется) — это успех. Если вернёт строку с правилом — что-то не так.

Run: `git check-ignore -v .env`
Expected: выводится строка `.gitignore:2:.env	.env` — файл корректно игнорируется.

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: разрешить коммит .env.prod.example в .gitignore"
```

---

## Task 2: Создать `.env.prod.example`

**Files:**
- Create: `.env.prod.example`

- [ ] **Step 1: Написать шаблон**

Создать файл `.env.prod.example` в корне репо с содержимым:

```env
# === MySQL ===
# Пароль root-пользователя MySQL (используется backend и init-скриптами)
MYSQL_ROOT_PASSWORD=change-me-strong-password

# Пароль для непривилегированного пользователя `indigo` (не используется backend, но создаётся MySQL)
MYSQL_PASSWORD=change-me-user-password

# === Backend (FastAPI) ===
# Пароль БД, под которым подключается backend (равен MYSQL_ROOT_PASSWORD, т.к. в compose DB_USER=root)
DB_PASSWORD=change-me-strong-password

# Секрет для подписи JWT-токенов. Сгенерировать: openssl rand -hex 32
JWT_SECRET=replace-with-openssl-rand-hex-32

# === Frontend (React) ===
# Публичный URL backend API, как его видит браузер пользователя
# Примеры: https://api.indigosmart.example.com  |  http://YOUR_VPS_IP:8000
REACT_APP_API_URL=http://localhost:8000
```

- [ ] **Step 2: Проверить, что файл не игнорируется**

Run: `git check-ignore -v .env.prod.example`
Expected: exit code 1, никакого вывода (правильно — файл должен трекаться).

Run: `git status --short -- .env.prod.example`
Expected: `?? .env.prod.example` (новый untracked файл, готов к add).

- [ ] **Step 3: Commit**

```bash
git add .env.prod.example
git commit -m "chore: добавить шаблон .env для продакшена"
```

---

## Task 3: Создать `docker-compose.prod.yml`

**Files:**
- Create: `docker-compose.prod.yml`

**Контекст:** Существующий `docker-compose.yml` останется для локальной разработки (с `build:`). Прод-файл будет тянуть готовые образы из GHCR и читать секреты из `.env`.

- [ ] **Step 1: Создать `docker-compose.prod.yml` в корне репо**

```yaml
version: "3.9"

services:
  mysql:
    image: mysql:9.0
    container_name: indigo_mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: smart_home_db
      MYSQL_USER: indigo
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./smart_home_db.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
      - ./smart-app/migration_v2.sql:/docker-entrypoint-initdb.d/02-migration.sql:ro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      retries: 10

  backend:
    image: ghcr.io/n1ghtmare-dev/indigo-smart-backend:latest
    container_name: indigo_backend
    restart: unless-stopped
    environment:
      DB_USER: root
      DB_PASSWORD: ${DB_PASSWORD}
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: smart_home_db
      JWT_SECRET: ${JWT_SECRET}
      SIMULATOR_AUTOSTART: "true"
    ports:
      - "8000:8000"
    depends_on:
      mysql:
        condition: service_healthy

  frontend:
    image: ghcr.io/n1ghtmare-dev/indigo-smart-frontend:latest
    container_name: indigo_frontend
    restart: unless-stopped
    environment:
      REACT_APP_API_URL: ${REACT_APP_API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mysql_data:
```

- [ ] **Step 2: Валидация синтаксиса compose**

Эта проверка требует Docker. Локально (Windows) у пользователя Docker может не быть установлен — пропустить, если так.

Если Docker есть, создать временный `.env` рядом с compose для подстановки и проверить парсинг:

```bash
cp .env.prod.example .env.test
docker compose -f docker-compose.prod.yml --env-file .env.test config > /dev/null
rm .env.test
```

Expected: exit code 0, никаких ошибок про неинтерполированные переменные.

Если Docker недоступен — пропустить, валидация произойдёт на сервере при первом деплое.

- [ ] **Step 3: Commit**

```bash
git add docker-compose.prod.yml
git commit -m "feat: добавить docker-compose.prod.yml для деплоя из GHCR"
```

---

## Task 4: Создать workflow `.github/workflows/deploy.yml`

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Создать директорию и файл**

Создать файл `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_BACKEND: ghcr.io/${{ github.repository_owner }}/indigo-smart-backend
  IMAGE_FRONTEND: ghcr.io/${{ github.repository_owner }}/indigo-smart-frontend

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend
        uses: docker/build-push-action@v6
        with:
          context: ./smart-app
          file: ./smart-app/Dockerfile
          push: true
          tags: |
            ${{ env.IMAGE_BACKEND }}:latest
            ${{ env.IMAGE_BACKEND }}:${{ github.sha }}
          cache-from: type=gha,scope=backend
          cache-to: type=gha,mode=max,scope=backend

      - name: Build and push frontend
        uses: docker/build-push-action@v6
        with:
          context: ./smart-board
          file: ./smart-board/Dockerfile
          push: true
          tags: |
            ${{ env.IMAGE_FRONTEND }}:latest
            ${{ env.IMAGE_FRONTEND }}:${{ github.sha }}
          cache-from: type=gha,scope=frontend
          cache-to: type=gha,mode=max,scope=frontend

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          envs: GHCR_TOKEN,GHCR_USER,DEPLOY_PATH
          script: |
            set -e
            cd "$DEPLOY_PATH"
            echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
            docker image prune -f
            docker logout ghcr.io
        env:
          GHCR_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GHCR_USER: ${{ github.actor }}
          DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
```

Замечание про передачу `GITHUB_TOKEN` на сервер: `appleboy/ssh-action` копирует переменные из `env:` блока (нашего шага) в SSH-сессию по списку в `envs:`. Это даёт серверу одноразовый токен на время выполнения workflow.

- [ ] **Step 2: Локально проверить YAML-синтаксис**

Run (если установлен Python):
```bash
python -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"
```
Expected: exit code 0, никакого вывода.

Если Python недоступен — пропустить, GitHub отвергнет невалидный YAML с понятной ошибкой.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: добавить workflow автодеплоя в GHCR и на VPS"
```

---

## Task 5: Документация по настройке VPS

**Files:**
- Create: `docs/deploy-server-setup.md`

- [ ] **Step 1: Создать инструкцию**

```markdown
# Настройка VPS под автодеплой

Одноразовые шаги, которые нужно выполнить на сервере **до** первого запуска workflow.

## 1. Предварительные требования

- Установлен Docker Engine + Docker Compose v2 (`docker compose version`)
- Пользователь, под которым будет работать деплой (например, `deploy`), состоит в группе `docker`:
  ```bash
  sudo usermod -aG docker deploy
  ```
- Доступ по SSH к серверу по IP/домену

## 2. Подготовка каталога проекта

Под пользователем деплоя:

```bash
mkdir -p ~/indigo-smart
cd ~/indigo-smart
git clone https://github.com/n1ghtmare-dev/indigo-smart .
```

Полный путь (например, `/home/deploy/indigo-smart`) понадобится для секрета `DEPLOY_PATH`.

## 3. Создать `.env` с реальными секретами

```bash
cp .env.prod.example .env
nano .env  # подставить реальные значения
```

Сгенерировать JWT-секрет:
```bash
openssl rand -hex 32
```

## 4. Первый запуск (вручную)

Логинимся в GHCR (один раз для проверки доступа; workflow позже делает это сам):

```bash
# Создать PAT на github.com/settings/tokens с правом read:packages
echo "<PAT_TOKEN>" | docker login ghcr.io -u n1ghtmare-dev --password-stdin
```

Запустить:
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

Проверить:
- `curl http://localhost:8000/health` (или любой существующий эндпоинт backend)
- `curl http://localhost:3000` (frontend)

## 5. Сгенерировать SSH-ключ для GitHub Actions

На сервере:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/indigo_deploy -N ""
cat ~/.ssh/indigo_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Содержимое приватного ключа:
```bash
cat ~/.ssh/indigo_deploy
```
— скопировать **целиком** (включая `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`) в GitHub Secret `SSH_KEY`.

## 6. Завести GitHub Secrets

Перейти: `https://github.com/n1ghtmare-dev/indigo-smart/settings/secrets/actions`

| Secret | Значение |
|---|---|
| `SSH_HOST` | IP или домен VPS |
| `SSH_USER` | `deploy` (или другой пользователь) |
| `SSH_KEY` | Приватный ключ из шага 5 (целиком) |
| `DEPLOY_PATH` | Полный путь, например `/home/deploy/indigo-smart` |

`GITHUB_TOKEN` создаётся автоматически — отдельно заводить не нужно.

## 7. Запустить первый деплой

Вариант А — push любого изменения в `main`.

Вариант Б — вручную: `Actions` → `Build and Deploy` → `Run workflow`.

Следить за логом во вкладке Actions. После успеха проверить `docker ps` на сервере: должны быть новые `CREATED` времена у `indigo_backend` и `indigo_frontend`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/deploy-server-setup.md
git commit -m "docs: добавить инструкцию по настройке VPS под автодеплой"
```

---

## Task 6: End-to-end верификация

**Контекст:** Эту задачу выполняет человек после того, как сервер настроен по `docs/deploy-server-setup.md` и заведены секреты в GitHub.

- [ ] **Step 1: Запушить ветку**

```bash
git push origin main
```

- [ ] **Step 2: Открыть Actions**

Перейти: `https://github.com/n1ghtmare-dev/indigo-smart/actions`

Expected: появился прогон `Build and Deploy`, статус `In progress`.

- [ ] **Step 3: Дождаться завершения и проверить job `build-and-push`**

Expected: оба шага «Build and push backend/frontend» зелёные.

Открыть: `https://github.com/n1ghtmare-dev?tab=packages`

Expected: появились пакеты `indigo-smart-backend` и `indigo-smart-frontend` с тегами `latest` и хешем коммита.

- [ ] **Step 4: Проверить job `deploy`**

Expected: лог `appleboy/ssh-action` показывает успешные команды `docker login`, `docker compose pull`, `docker compose up -d`, `docker image prune`.

- [ ] **Step 5: Проверить, что код реально обновился на сервере**

Перед деплоем внести **видимое** изменение, например, поправить заголовок страницы в `smart-board/src/views/admin/default/index.jsx`. Запушить, дождаться завершения, открыть фронт в браузере по IP сервера → новое значение видно.

- [ ] **Step 6 (опционально): Откатить релиз**

На сервере временно подменить тег в `docker-compose.prod.yml`:
```yaml
image: ghcr.io/n1ghtmare-dev/indigo-smart-frontend:<previous-sha>
```
И сделать `docker compose -f docker-compose.prod.yml up -d frontend`. Так проверяется механизм отката (теги `:<sha>` остаются в GHCR).

После проверки вернуть на `:latest`.

---

## Самопроверка плана

**Spec coverage:**
- ✅ Workflow с двумя jobs (Task 4)
- ✅ Build + push в GHCR с `:latest` + `:<sha>` (Task 4)
- ✅ Триггер `push: main` + `workflow_dispatch` (Task 4)
- ✅ `docker-compose.prod.yml` с image вместо build (Task 3)
- ✅ `.env.prod.example` со всеми переменными из spec (Task 2)
- ✅ `.gitignore` защищает `.env`, разрешает `.env.prod.example` (Task 1)
- ✅ Документация по серверу: SSH-ключи, секреты, первый запуск (Task 5)
- ✅ Использование встроенного `GITHUB_TOKEN` без отдельного PAT (Task 4)
- ✅ Кеш сборки `cache-from/to: type=gha` (Task 4)
- ✅ `docker image prune -f` после деплоя (Task 4)
- ✅ Критерий приёмки про видимое изменение через 2–4 минуты (Task 6)

**Placeholder scan:** Нет TBD/TODO. Все код-блоки заполнены целиком.

**Type consistency:**
- Имена образов: `indigo-smart-backend` и `indigo-smart-frontend` — единообразно во всех тасках.
- Имя secret-а: `GITHUB_TOKEN` (встроенный), `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `DEPLOY_PATH` — совпадают между Task 4 и Task 5.
- Путь к compose: `docker-compose.prod.yml` (без `./`) — единообразно.
- `${{ github.repository_owner }}` развернётся в `n1ghtmare-dev` — соответствует хардкоду в `docker-compose.prod.yml` (Task 3). Если владелец репо когда-то поменяется — потребуется правка `docker-compose.prod.yml`.
