"""WebSocket connection manager — singleton broadcasting helper."""
import asyncio
import json
from typing import Set
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._clients: Set[WebSocket] = set()
        self._lock = asyncio.Lock()
        # Ссылка на event loop uvicorn (главный поток). Захватывается при
        # подключении клиента — этот код выполняется ВНУТРИ loop. Нужна, чтобы
        # фоновые потоки (движки сценария/симулятора/автоматизации) доставляли
        # события через run_coroutine_threadsafe, а не теряли их.
        self._loop: asyncio.AbstractEventLoop | None = None

    async def connect(self, ws: WebSocket):
        self._loop = asyncio.get_running_loop()
        await ws.accept()
        async with self._lock:
            self._clients.add(ws)

    async def disconnect(self, ws: WebSocket):
        async with self._lock:
            self._clients.discard(ws)

    async def broadcast(self, event: dict):
        payload = json.dumps(event, default=str)
        dead = []
        for ws in list(self._clients):
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            await self.disconnect(ws)

    def broadcast_sync(self, event: dict):
        """Рассылка из синхронного контекста (фоновый поток движков).

        Использует event loop, захваченный в connect(). asyncio.get_event_loop()
        здесь нельзя: в не-главном потоке он кидает RuntimeError (Python 3.12+),
        и события молча терялись.
        """
        loop = self._loop
        if loop is None:
            # Ещё ни один клиент не подключался — некому доставлять.
            return
        try:
            asyncio.run_coroutine_threadsafe(self.broadcast(event), loop)
        except RuntimeError:
            # Loop остановлен (выключение сервера) — пропускаем.
            pass

    @property
    def count(self) -> int:
        return len(self._clients)


manager = ConnectionManager()
