import asyncio
import websockets

async def handle_client(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            print(message)
            await websocket.send("ACK")
    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # The user didn't specify a disconnect print for this version, 
        # but it's good practice. I'll stick to the requirements.
        pass

async def main():
    host = "127.0.0.1"
    port = 8765
    async with websockets.serve(handle_client, host, port):
        print("ANDIS server running on ws://localhost:8765")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
