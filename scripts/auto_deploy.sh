#!/bin/bash
# 5분마다 실행: GitHub에 새 커밋이 있으면 자동 빌드 & 배포
# crontab: */5 * * * * /home/ubuntu/reallang/scripts/auto_deploy.sh

PROJECT_DIR="/home/ubuntu/reallang"
LOG_FILE="$PROJECT_DIR/scripts/deploy.log"

cd "$PROJECT_DIR" || exit 1

# 원격 변경 확인
git fetch origin main --quiet 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi

# 새 커밋 있음 → 배포
echo "[$(date '+%Y-%m-%d %H:%M:%S')] New commits detected, deploying..." >> "$LOG_FILE"

git pull origin main >> "$LOG_FILE" 2>&1

cd frontend
npm install --production >> "$LOG_FILE" 2>&1
npm run build >> "$LOG_FILE" 2>&1

sudo rm -rf /var/www/reallang/*
sudo cp -r dist/* /var/www/reallang/

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy complete! $(git log --oneline -1)" >> "$LOG_FILE"
