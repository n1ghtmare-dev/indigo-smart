# Настройка VPS под автодеплой

Одноразовые шаги, которые нужно выполнить на сервере **до** первого запуска GitHub Actions workflow `Build and Deploy`.

Сервер: VPS с панелью **FastPanel** и установленным MySQL внутри панели. Бэкенд будет цепляться к этому MySQL, а не поднимать свой в Docker.

## 1. Создать БД и пользователя в FastPanel

1. Войти в FastPanel
2. `Базы данных` → `Создать БД`
3. Имя БД: `indigosmart_db` (или другое, не забыть — пойдёт в `.env` как `DB_NAME`)
4. Создать пользователя: `indigosmart_user`, **сильный** пароль (например, из `openssl rand -base64 24` без спецсимволов вроде `!`, чтобы не экранировать)
5. Привилегии: ALL на эту БД

Запиши себе **локально** (в менеджер паролей, не в чат):
- DB name
- DB user
- DB password

## 2. Импортировать схему БД

В FastPanel: `Базы данных` → выбрать БД → `phpMyAdmin` (или встроенный SQL-менеджер) → `Импорт`.

Залить **по очереди**:
1. `smart_home_db.sql` — основная схема (из репозитория)
2. `smart-app/migration_v2.sql` — миграция v2

Если phpMyAdmin не открывает большие файлы, через CLI:
```bash
mysql -u indigosmart_user -p indigosmart_db < smart_home_db.sql
mysql -u indigosmart_user -p indigosmart_db < smart-app/migration_v2.sql
```

## 3. Проверить, что Docker установлен

Открыть веб-терминал FastPanel (иконка `>_` в шапке) и выполнить:
```bash
docker --version
docker compose version
```

Если `command not found`:
```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
```

## 4. Создать системного пользователя `deploy` для GitHub Actions

```bash
sudo adduser deploy --disabled-password --gecos ""
sudo usermod -aG docker deploy
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
```

## 5. Сгенерировать SSH-ключ для GitHub Actions

```bash
sudo -u deploy ssh-keygen -t ed25519 -f /home/deploy/.ssh/indigo_deploy -N ""
sudo -u deploy bash -c 'cat /home/deploy/.ssh/indigo_deploy.pub >> /home/deploy/.ssh/authorized_keys'
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Вывести приватный ключ — он пойдёт в GitHub Secret `SSH_KEY`:
```bash
sudo cat /home/deploy/.ssh/indigo_deploy
```

Скопировать **всё** содержимое (включая строки `BEGIN`/`END`).

## 6. Склонировать репозиторий

```bash
sudo -u deploy git clone https://github.com/n1ghtmare-dev/indigo-smart /home/deploy/indigo-smart
cd /home/deploy/indigo-smart
sudo -u deploy cp .env.prod.example .env
sudo -u deploy nano .env
```

В `.env` заполнить:
- `DB_USER`, `DB_PASSWORD`, `DB_NAME` — из шага 1
- `JWT_SECRET` — сгенерировать командой `openssl rand -hex 32`
- `REACT_APP_API_URL` — публичный URL backend (см. шаг 8 про nginx)

## 7. Открыть MySQL для подключения с локалхоста (если ещё не открыт)

`network_mode: host` у backend-контейнера означает, что он подключается к `127.0.0.1:3306`. FastPanel по умолчанию обычно так и настраивает MySQL — bind на `127.0.0.1`. Проверить:
```bash
sudo ss -tlnp | grep 3306
```
Ожидается строка с `127.0.0.1:3306` или `*:3306`. Если ничего нет — MySQL не запущен, поднять через FastPanel.

## 8. Прокинуть backend через nginx FastPanel (опционально, но желательно)

Бэкенд слушает порт `8000` на хосте. Чтобы не светить порт `8000` наружу и работать с фронтом по одному домену:

В FastPanel: `Сайты` → `indigosmart.ru` → `Дополнительно` → `Reverse Proxy` (или `Nginx → Дополнительная конфигурация`):

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Тогда в `.env` ставится `REACT_APP_API_URL=https://indigosmart.ru/api`. Иначе — `http://indigosmart.ru:8000` (и открыть порт 8000 в firewall FastPanel).

## 9. Завести GitHub Secrets

Перейти: `https://github.com/n1ghtmare-dev/indigo-smart/settings/secrets/actions` → `New repository secret`.

| Имя секрета | Значение |
|---|---|
| `SSH_HOST` | `indigosmart.ru` (или IP сервера) |
| `SSH_USER` | `deploy` |
| `SSH_KEY` | Приватный ключ из шага 5, весь файл целиком |
| `DEPLOY_PATH` | `/home/deploy/indigo-smart` |

`GITHUB_TOKEN` создаётся автоматически — отдельно заводить не нужно.

## 10. Запустить первый автодеплой

**Вариант А (первый раз):** вручную.
- `https://github.com/n1ghtmare-dev/indigo-smart/actions`
- Слева выбрать `Build and Deploy`
- `Run workflow` → `Run workflow` на ветке `main`

**Вариант Б (далее):** просто пушить в `main`.

Тайминги при холодном кеше:
- `build-and-push`: 3–5 минут
- `deploy`: 30–60 секунд

## 11. Проверка

На сервере:
```bash
sudo -u deploy docker ps --format 'table {{.Names}}\t{{.Status}}'
```
Должны быть `indigo_backend` и `indigo_frontend` со статусом `Up`.

```bash
curl http://127.0.0.1:8000/docs   # FastAPI Swagger
curl http://127.0.0.1:3000        # Frontend
```

В браузере: открыть `https://indigosmart.ru` (если настроен nginx → frontend на 3000) и убедиться, что страница грузится и API работает.

## Откат на предыдущую версию

Каждый прогон workflow тегирует образы `:latest` и `:<git-sha>`. Чтобы откатиться:

1. На сервере отредактировать `docker-compose.prod.yml`, заменить `:latest` на нужный sha:
   ```yaml
   image: ghcr.io/n1ghtmare-dev/indigo-smart-frontend:eeb7ac2abc...
   ```
2. `sudo -u deploy docker compose -f docker-compose.prod.yml up -d`

После проверки вернуть `:latest`.

## Типичные проблемы

| Симптом | Причина | Решение |
|---|---|---|
| `permission denied` при `docker compose` в workflow | Пользователь `deploy` не в группе `docker` | `sudo usermod -aG docker deploy`, перелогиниться |
| `denied: requested access to the resource is denied` при pull | Образы в GHCR приватные, нет логина | Workflow логинится сам каждый раз — это значит env-переменные `GHCR_TOKEN`/`GHCR_USER` не пробросились; проверить блок `envs:` в workflow |
| `Permission denied (publickey)` при SSH | `SSH_KEY` не совпадает с публичным в `authorized_keys` | Сгенерировать ключ заново, проверить копию приватной части в GitHub Secret |
| Backend стартует, но `OperationalError: Can't connect to MySQL` | MySQL слушает не на 127.0.0.1, или DB_USER/DB_PASSWORD неправильные | `sudo ss -tlnp | grep 3306`, `mysql -u USER -p` руками с сервера |
| Workflow зелёный, но изменения не видны | Браузер закешировал bundle | Hard reload (Ctrl+F5) |
