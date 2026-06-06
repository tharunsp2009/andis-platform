import streamlit as st
import requests
import pandas as pd
import time

# --- Configuration ---
API_URL = "http://127.0.0.1:8000/api/logs"

# Page setup
st.set_page_config(
    page_title="ANDIS Security Dashboard",
    page_icon="🛡️",
    layout="wide"
)

# --- Functions ---
def fetch_logs():
    """Fetches security logs from the backend API."""
    try:
        response = requests.get(API_URL, timeout=5)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Backend error: {response.status_code}")
            return []
    except Exception as e:
        st.error(f"Could not connect to backend: {e}")
        return []

def highlight_suspicious(row):
    """Highlighting logic for the dataframe."""
    return ['background-color: #ffcccc' if row.alert_type != 'normal' else '' for _ in row]

# --- UI Layout ---
st.title("🛡️ ANDIS Security Dashboard")
st.markdown("Real-time endpoint security monitoring and threat detection.")

# Placeholder for the dynamic content
dashboard_container = st.empty()

# Main loop for auto-refresh
while True:
    with dashboard_container.container():
        # 1. Fetch Data
        logs_data = fetch_logs()
        
        if logs_data:
            df = pd.DataFrame(logs_data)
            
            # 2. Metrics Section
            total_events = len(df)
            suspicious_events = len(df[df['alert_type'] != 'normal'])
            
            col1, col2 = st.columns(2)
            col1.metric("Total Security Events", total_events)
            col2.metric("Suspicious Events Detected", suspicious_events, delta=suspicious_events, delta_color="inverse")
            
            st.divider()
            
            # 3. Visualization Section
            st.subheader("📊 Alert Type Distribution")
            alert_counts = df['alert_type'].value_counts()
            st.bar_chart(alert_counts)
            
            st.divider()
            
            # 4. Recent Events Table
            st.subheader("📜 Recent Security Events")
            
            # Select and order columns for display
            display_df = df[['timestamp', 'process_name', 'remote_ip', 'remote_port', 'alert_type']]
            
            # Apply highlighting and display
            st.dataframe(
                display_df.style.apply(highlight_suspicious, axis=1),
                use_container_width=True,
                height=400
            )
            
        else:
            st.info("Waiting for data from the backend... Ensure the ANDIS Backend and Agent are running.")

    # Auto-refresh every 5 seconds
    time.sleep(5)
    st.rerun()
