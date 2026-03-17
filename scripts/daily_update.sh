#!/bin/bash
# 매일 자동 실행: 크롤링 → 빌드 → 배포
# crontab: 0 6 * * * /home/ubuntu/reallang/scripts/daily_update.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$SCRIPT_DIR/update.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "=== Daily update started ==="

# 1. 최신 코드 pull
cd "$PROJECT_DIR"
git pull origin main >> "$LOG_FILE" 2>&1 || true

# 2. 크롤링 실행
log "Running crawler..."
python3 "$SCRIPT_DIR/daily_crawl.py" >> "$LOG_FILE" 2>&1
CRAWL_RESULT=$?

if [ $CRAWL_RESULT -eq 0 ]; then
    log "New patterns added, rebuilding..."

    # 3. 프론트엔드 빌드
    cd "$PROJECT_DIR/frontend"
    npm install --production >> "$LOG_FILE" 2>&1
    npm run build >> "$LOG_FILE" 2>&1

    # 4. 배포
    sudo rm -rf /var/www/reallang/*
    sudo cp -r dist/* /var/www/reallang/

    # 5. Git 커밋 & 푸시 (선택)
    cd "$PROJECT_DIR"
    git add data/seed_patterns.json frontend/src/data/seed_patterns.json
    git commit -m "auto: daily crawl $(date '+%Y-%m-%d') - new patterns added" >> "$LOG_FILE" 2>&1 || true
    git push origin main >> "$LOG_FILE" 2>&1 || true

    log "Deploy complete!"
else
    log "No new patterns, skipping build."
fi

log "=== Daily update finished ==="
