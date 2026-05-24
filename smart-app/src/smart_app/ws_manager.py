"""WebSocket connection manager — singleton broadcasting helper."""
import asyncio
import json
from typing import Set
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._clients: Set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket):
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
        """Broadcast from a sync context (background worker)."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                asyncio.run_coroutine_threadsafe(self.broadcast(event), loop)
            else:
                loop.run_until_complete(self.broadcast(event))
        except RuntimeError:
            # No event loop in this thread — store events for later or skip
            pass

    @property
    def count(self) -> int:
        return len(self._clients)


manager = ConnectionManager()
