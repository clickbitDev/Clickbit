#!/bin/bash

# Kill any previous serve or node processes
pkill -f 'serve -s client/build' || true
pkill -f 'node -r dotenv/config server/index.js' || true

# Start backend watcher (nodemon)
nodemon -r dotenv/config server/index.js &
BACKEND_PID=$!

# Start frontend watcher (chokidar)
chokidar "client/src/**/*" -c "npm run build --prefix client && pkill -f 'serve -s client/build' || true && serve -s client/build" --initial &
FRONTEND_PID=$!

# Wait for both to exit
wait $BACKEND_PID $FRONTEND_PID 