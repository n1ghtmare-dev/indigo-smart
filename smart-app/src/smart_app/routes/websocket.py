"""WebSocket endpoint for real-time updates."""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ws_manager import manager

router = APIRouter()


@router.websocket("/ws/updates")
async def ws_updates(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_json({"type": "hello", "clients": manager.count})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
