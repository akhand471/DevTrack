#!/bin/bash
# DevTrack — start backend + frontend in one command
# Usage: ./start.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${YELLOW}🚀 Starting DevTrack...${NC}"

# Kill any stale instances
pkill -f "node server.js" 2>/dev/null || true
pkill -f "nodemon server.js" 2>/dev/null || true
lsof -ti:5001 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend
echo -e "${YELLOW}📦 Starting backend on :5001...${NC}"
cd "$ROOT/server"
npm run dev > /tmp/devtrack-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
for i in {1..20}; do
  if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend running (PID $BACKEND_PID)${NC}"
    break
  fi
  sleep 1
done

# Start frontend
echo -e "${YELLOW}⚡ Starting frontend on :5173...${NC}"
cd "$ROOT"
npm run dev -- --open false > /tmp/devtrack-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

echo ""
echo -e "${GREEN}✅ DevTrack is running!${NC}"
echo -e "   Frontend  → ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend   → ${GREEN}http://localhost:5001/api/health${NC}"
echo ""
echo -e "${YELLOW}Register/Login:${NC}"
echo -e "   Any email + password ≥ 8 chars (dev auto-verifies)"
echo ""
echo -e "Logs: tail -f /tmp/devtrack-backend.log"
echo -e "Stop: pkill -f 'nodemon server.js'; pkill -f 'vite'"
echo ""
wait
