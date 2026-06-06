import asyncio
import websockets
import json
import psutil
from datetime import datetime

# Configuration
SERVER_URI = "ws://localhost:8765"
INTERVAL = 3  # Seconds

async def stream_telemetry():
    """Collects system metrics and sends them via WebSocket every 3 seconds."""
    print(f"[*] Connecting to ANDIS Server at {SERVER_URI}...")
    
    while True:
        try:
            async with websockets.connect(SERVER_URI) as websocket:
                print("[*] Connection established. Streaming telemetry...")
                
                while True:
                    # Collect metrics
                    cpu = psutil.cpu_percent(interval=1)
                    mem = psutil.virtual_memory().percent
                    proc = len(psutil.pids())
                    conn = len(psutil.net_connections())
                    
                    telemetry = {
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "cpu": cpu,
                        "memory": mem,
                        "processes": proc,
                        "connections": conn
                    }
                    
                    # Send to server
                    await websocket.send(json.dumps(telemetry))
                    print(f"[SENT] CPU: {cpu}% | MEM: {mem}%")
                    
                    # Wait for the remaining interval
                    await asyncio.sleep(INTERVAL - 1) # interval=1 in cpu_percent takes 1s
                    
        except Exception as e:
            print(f"[!] Connection error: {e}")
            print(f"[*] Retrying in {INTERVAL} seconds...")
            await asyncio.sleep(INTERVAL)

if __name__ == "__main__":
    try:
        asyncio.run(stream_telemetry())
    except KeyboardInterrupt:
        print("\n[*] Agent stopped.")
