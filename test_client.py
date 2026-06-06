import asyncio
import websockets

async def test():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        print("Connected to ANDIS server")
        await websocket.send("test")
        print("Message sent")

asyncio.run(test())
