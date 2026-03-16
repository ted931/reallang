#!/bin/bash
# RealLang 배포 스크립트 - Lightsail Ubuntu
# 사용법: Lightsail SSH 터미널에서 실행

set -e

echo "=== 1. 시스템 업데이트 및 필수 패키지 설치 ==="
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx git

echo "=== 2. Node.js 20 설치 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== 3. 프로젝트 클론 ==="
cd /home/ubuntu
if [ -d "reallang" ]; then
  cd reallang && git pull
else
  git clone https://github.com/ted931/reallang.git
  cd reallang
fi

echo "=== 4. 프론트엔드 빌드 ==="
cd frontend
npm install
npm run build

echo "=== 5. 빌드 결과물을 Nginx 디렉토리로 복사 ==="
sudo rm -rf /var/www/reallang
sudo mkdir -p /var/www/reallang
sudo cp -r dist/* /var/www/reallang/

echo "=== 6. Nginx 설정 ==="
sudo tee /etc/nginx/sites-available/reallang > /dev/null <<'NGINX'
server {
    listen 80;
    server_name realang.store www.realang.store;
    root /var/www/reallang;
    index index.html;

    # Vue SPA - 모든 경로를 index.html로
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
NGINX

sudo ln -sf /etc/nginx/sites-available/reallang /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "=== 7. 방화벽 설정 ==="
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "=== 8. SSL 인증서 설치 (Let's Encrypt) ==="
sudo certbot --nginx -d realang.store -d www.realang.store --non-interactive --agree-tos --email ted931@gmail.com --redirect

echo ""
echo "========================================="
echo "  배포 완료!"
echo "  https://realang.store 에서 확인하세요"
echo "========================================="
