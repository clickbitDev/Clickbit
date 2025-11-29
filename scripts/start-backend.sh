#!/bin/bash
echo "🔧 Starting ClickBit Backend Server..."
cd "$(dirname "$0")/../server" || exit 1
PORT=5000 node index.js
