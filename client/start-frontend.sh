#!/bin/bash
export PORT=3000
export BROWSER=none
export GENERATE_SOURCEMAP=false
export REACT_APP_API_URL=http://localhost:5001/api

echo "Starting React frontend on port 3000..."
npm start 