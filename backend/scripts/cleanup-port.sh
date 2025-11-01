#!/bin/bash
# Cleanup script to kill any process on port 5001

PORT=5001

# Find and kill any process using the port
PID=$(lsof -ti:$PORT)

if [ ! -z "$PID" ]; then
  echo "🔧 Killing process $PID on port $PORT..."
  kill -9 $PID
  echo "✅ Port $PORT cleared"
else
  echo "✅ Port $PORT is already free"
fi
