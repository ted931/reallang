#!/bin/bash
# 모노레포 전체 배포 스크립트
# 서버에서 실행: bash scripts/deploy.sh
set -e

echo "=== [1/5] Git Pull ==="
git pull origin main

echo "=== [2/5] Dependencies 설치 ==="
npm install

echo "=== [3/5] 전체 프로젝트 빌드 ==="
# 루트 포탈
echo "  Building portal..."
npx next build

# 각 프로젝트
for project in jejupass-promo mini-xd creative-sandbox jeju-weather jeju-map jeju-travel-planner jeju-course-maker dashboard cs-chatbot; do
  if [ -d "projects/$project" ]; then
    echo "  Building $project..."
    npm run build -w "$project" 2>&1 | tail -3
  fi
done

echo "=== [4/5] Nginx 설정 업데이트 ==="
if [ -f /etc/nginx/sites-available/reallang ]; then
  sudo cp scripts/nginx.conf /etc/nginx/sites-available/reallang
  sudo nginx -t && sudo systemctl reload nginx
  echo "  Nginx reloaded"
else
  echo "  [SKIP] Nginx config not found, copy manually:"
  echo "  sudo cp scripts/nginx.conf /etc/nginx/sites-available/reallang"
  echo "  sudo ln -sf /etc/nginx/sites-available/reallang /etc/nginx/sites-enabled/"
  echo "  sudo nginx -t && sudo systemctl reload nginx"
fi

echo "=== [5/5] PM2 재시작 ==="
if command -v pm2 &> /dev/null; then
  pm2 stop all 2>/dev/null || true
  pm2 start ecosystem.config.js
  pm2 save
  echo "  PM2 started all apps"
else
  echo "  [SKIP] PM2 not found. Install: npm install -g pm2"
  echo "  Then run: pm2 start ecosystem.config.js && pm2 save"
fi

echo ""
echo "=== 배포 완료! ==="
echo "포탈:       http://localhost:3000"
echo "제주패스:    http://localhost:3001  → /jejupass/"
echo "Mini XD:    http://localhost:3002  → /mini-xd/"
echo "Sandbox:    http://localhost:3003  → /sandbox/"
echo "날씨 지도:   http://localhost:3004  → /weather/"
echo "지도 플랫폼: http://localhost:3005  → /map/"
echo "여행 플래너: http://localhost:3006  → /travel/"
echo "코스 메이커: http://localhost:3007  → /course/"
echo "대시보드:    http://localhost:3008  → /dashboard/"
echo "CS 챗봇:    http://localhost:3009  → /chatbot/"
