from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import os
from datetime import datetime
from typing import List, Dict, Any

# Initialize FastAPI app
app = FastAPI(title="ANDIS Security Backend")

# Enable CORS so the agent or a frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LOG_FILE = "server_logs.json"

def save_to_json(event: Dict[str, Any]):
    """
    Helper function to handle JSON file persistence.
    Appends the new event to the existing list in server_logs.json.
    """
    logs = []
    
    # 1. Read existing logs if the file exists
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r") as f:
                logs = json.load(f)
        except (json.JSONDecodeError, IOError):
            # If file is corrupted or empty, start fresh
            logs = []
            
    # 2. Append the new event
    logs.append(event)
    
    # 3. Write the updated list back to the file
    try:
        with open(LOG_FILE, "w") as f:
            json.dump(logs, f, indent=4)
    except IOError as e:
        print(f"Error writing to log file: {e}")
        raise HTTPException(status_code=500, detail="Internal server error saving log")

@app.post("/api/logs")
async def receive_logs(request: Request):
    """
    Endpoint to receive security events from the ANDIS agent.
    """
    try:
        # Parse the incoming JSON data
        event_data = await request.json()
        
        # Basic validation: check if required fields exist
        required_fields = ["timestamp", "process_name", "remote_ip", "remote_port", "alert_type"]
        if not all(field in event_data for field in required_fields):
            raise HTTPException(status_code=400, detail="Missing required fields in event data")
            
        # Save the log persistently
        save_to_json(event_data)
        
        print(f"[*] Log Received: {event_data['process_name']} -> {event_data['remote_ip']} ({event_data['alert_type']})")
        
        return {"status": "success", "message": "Security event logged successfully"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@app.get("/api/logs")
async def get_all_logs():
    """
    Endpoint to retrieve all stored security events.
    """
    if not os.path.exists(LOG_FILE):
        return []
        
    try:
        with open(LOG_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

@app.get("/")
async def root():
    return {"message": "ANDIS Security Backend is running", "version": "1.0.0"}

if __name__ == "__main__":
    # Run the server using uvicorn
    # host="0.0.0.0" makes it accessible on the network
    # port=3000 is the standard port for this environment
    uvicorn.run(app, host="0.0.0.0", port=3000)
