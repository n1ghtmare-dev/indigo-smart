"""Регрессионный тест доставки событий из фонового потока.

Воспроизводит реальную топологию: event loop uvicorn живёт в главном потоке,
а движки (scenario/simulator/automation) вызывают broadcast_sync из ФОНОВЫХ
потоков. На Python 3.12+ asyncio.get_event_loop() в не-главном потоке кидает
RuntimeError, из-за чего события молча терялись и на клиентах ничего не происходило.
"""
import sys
import os
import asyncio
import json
import threading
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "smart_app"))


class FakeWS:
    """Минимальный фейковый websocket: пишет полученные сообщения в список."""
    def __init__(self):
        self.sent = []

    async def accept(self):
        pass

    async def send_text(self, text):
        self.sent.append(text)


def test_broadcast_sync_delivers_from_background_thread():
    from ws_manager import ConnectionManager

    mgr = ConnectionManager()
    fake = FakeWS()

    # «Серверный» event loop в отдельном потоке (как uvicorn — в своём).
    loop = asyncio.new_event_loop()
    ready = threading.Event()

    def run_loop():
        asyncio.set_event_loop(loop)
        loop.call_soon(ready.set)
        loop.run_forever()

    server = threading.Thread(target=run_loop, daemon=True)
    server.start()
    assert ready.wait(2), "серверный loop не стартовал"

    # Клиент подключается НА серверном loop (как реальный ws-роут).
    asyncio.run_coroutine_threadsafe(mgr.connect(fake), loop).result(2)

    # Рассылка из ОТДЕЛЬНОГО фонового потока (как демон сценария).
    def worker():
        mgr.broadcast_sync({"type": "scenario_step", "phase": "rising", "value": 27})

    w = threading.Thread(target=worker)
    w.start()
    w.join(2)

    # Ждём доставки по условию, без произвольных пауз.
    deadline = time.time() + 2
    while not fake.sent and time.time() < deadline:
        time.sleep(0.02)

    loop.call_soon_threadsafe(loop.stop)

    assert fake.sent, "событие не доставлено клиенту из фонового потока"
    msg = json.loads(fake.sent[0])
    assert msg["phase"] == "rising"
    assert msg["value"] == 27


def test_websocket_receives_broadcast_end_to_end(client):
    """Сквозная проверка через реальное приложение: клиент подключается по
    WebSocket, фоновый поток шлёт broadcast_sync — клиент должен получить событие.
    Именно это ломалось в проде («ничего не происходит»)."""
    import ws_manager

    with client.websocket_connect("/api/ws/updates") as ws:
        hello = ws.receive_json()
        assert hello["type"] == "hello"

        # Рассылка из фонового потока — как делает движок сценария.
        def worker():
            ws_manager.manager.broadcast_sync(
                {"type": "scenario_step", "phase": "rising", "value": 30}
            )

        threading.Thread(target=worker).start()

        msg = ws.receive_json()
        assert msg["type"] == "scenario_step"
        assert msg["phase"] == "rising"
        assert msg["value"] == 30
