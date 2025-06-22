#!/bin/bash

# Fire Risk Lookup Web App - Development Server Startup Script
# This script is designed to be idempotent and robust, ensuring a clean start every time.

echo "🚀 Starting Fire Risk Lookup Development Server..."
echo ""

# --- Configuration ---
PORT=8000
SERVER_FILE="server.py"
HOST="localhost"

# --- Helper Functions ---

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Function to check for Python 3
check_python3() {
    if ! command_exists python3; then
        echo "❌ Error: Python 3 is not installed or not in your PATH." >&2
        echo "💡 Please install Python 3 to run the development server." >&2
        exit 1
    fi
}

# Function to check for the server file
check_server_file() {
    if [ ! -f "$SERVER_FILE" ]; then
        echo "❌ Error: Server file '$SERVER_FILE' not found in the current directory." >&2
        exit 1
    fi
}

# Function to stop any existing server on the specified port
stop_existing_server() {
    echo "🔎 Checking for any process using port $PORT..."
    # We use lsof to find the PID. The -t flag gives just the PID.
    PID=$(lsof -t -i:$PORT)

    if [ -n "$PID" ]; then
        echo "⚠️ Found an existing process (PID: $PID) on port $PORT."
        echo "🛑 Attempting to terminate it..."
        # Use kill -9 for a forceful stop to ensure the port is freed.
        if kill -9 "$PID"; then
            echo "✅ Process $PID terminated successfully."
            # Wait a moment for the OS to release the port completely.
            sleep 1
        else
            echo "❌ Error: Failed to terminate process $PID." >&2
            echo "💡 You may need to stop it manually using 'kill -9 $PID'." >&2
            exit 1
        fi
    else
        echo "👍 Port $PORT is free. No existing server process found."
    fi
    echo ""
}

# --- Main Execution ---

# 1. Run prerequisite checks
check_python3
check_server_file

# 2. Ensure server script is executable
chmod +x "$SERVER_FILE"

# 3. Stop any previously running server instance
stop_existing_server

# 4. Start the new server instance
echo "▶️  Starting the Python development server..."
# The server.py script itself prints the full URL.
python3 "$SERVER_FILE" 