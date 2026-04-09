#!/bin/bash
# 5분마다 실행: GitHub에 새 커밋이 있으면 자동 빌드 & PM2 재시작
# crontab -e:
#   */5 * * * * /home/ubuntu/reallang/scripts/auto_deploy.sh >> /home/ubuntu/reallang/scripts/deploy.log 2>&1

PROJECT_DIR="/home/ubuntu/reallang"
cd "$PROJECT_DIR" || exit 1

# 원격 변경 확인
git fetch origin main --quiet 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] New commits detected, deploying..."

git pull origin main

npm install

# 루트 포탈 빌드
npx next build

# 각 프로젝트 빌드
for project in jejupass-promo mini-xd creative-sandbox jeju-weather jeju-map jeju-travel-planner jeju-course-maker dashboard cs-chatbot; do
  if [ -d "projects/$project" ]; then
    echo "  Building $project..."
    npm run build -w "$project" 2>&1 | tail -1
  fi
done

# Nginx 설정 업데이트
if [ -f /etc/nginx/sites-available/reallang ]; then
    sudo cp scripts/nginx.conf /etc/nginx/sites-available/reallang
    sudo nginx -t && sudo systemctl reload nginx
fi

# PM2 재시작
pm2 restart all 2>/dev/null || pm2 start ecosystem.config.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy complete! $(git log --oneline -1)"
