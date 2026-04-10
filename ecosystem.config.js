// PM2 Ecosystem Configuration
// 사용법: pm2 start ecosystem.config.js
// 전체 재시작: pm2 restart all
// 상태 확인: pm2 status
//
// 포트 맵:
//   3000  portal (메인)
//   3001  jejupass-promo      → /jejupass
//   3002  mini-xd             → /mini-xd
//   3003  creative-sandbox    → /sandbox
//   3004  jeju-weather        → /weather
//   3005  jeju-map            → /map
//   3006  jeju-travel-planner → /travel-planner (아카이브)
//   3007  jeju-course-maker   → /course
//   3008  dashboard           → /dashboard
//   3009  cs-chatbot          → /chatbot
//   3010  jeju-party          → /party
//   3011  car-pick            → /car-pick
//   3012  weather-drive       → /weather-drive
//   3013  smart-fuel          → /smart-fuel
//   3020  jeju-travel (통합)  → /travel
//   3021  jeju-car (통합)     → /car
//   3022  jeju-biz (통합)     → /biz

module.exports = {
  apps: [
    // ── 메인 포탈 ──
    { name: "portal", cwd: "./", script: "node_modules/.bin/next", args: "start -p 3000", env: { NODE_ENV: "production" } },

    // ── 통합 서비스 (TOP) ──
    { name: "jeju-travel", cwd: "./projects/jeju-travel", script: "node_modules/.bin/next", args: "start -p 3020", env: { NODE_ENV: "production" } },
    { name: "jeju-car", cwd: "./projects/jeju-car", script: "node_modules/.bin/next", args: "start -p 3021", env: { NODE_ENV: "production" } },
    { name: "jeju-biz", cwd: "./projects/jeju-biz", script: "node_modules/.bin/next", args: "start -p 3022", env: { NODE_ENV: "production" } },

    // ── 제주 서비스 (프로토타입) ──
    { name: "jejupass", cwd: "./projects/jejupass-promo", script: "node_modules/.bin/next", args: "start -p 3001", env: { NODE_ENV: "production" } },
    { name: "weather", cwd: "./projects/jeju-weather", script: "node_modules/.bin/next", args: "start -p 3004", env: { NODE_ENV: "production" } },
    { name: "map", cwd: "./projects/jeju-map", script: "node_modules/.bin/next", args: "start -p 3005", env: { NODE_ENV: "production" } },
    { name: "travel-planner", cwd: "./projects/jeju-travel-planner", script: "node_modules/.bin/next", args: "start -p 3006", env: { NODE_ENV: "production" } },
    { name: "course-maker", cwd: "./projects/jeju-course-maker", script: "node_modules/.bin/next", args: "start -p 3007", env: { NODE_ENV: "production" } },
    { name: "party", cwd: "./projects/jeju-party", script: "node_modules/.bin/next", args: "start -p 3010", env: { NODE_ENV: "production" } },

    // ── 렌터카 서비스 (프로토타입) ──
    { name: "car-pick", cwd: "./projects/car-pick", script: "node_modules/.bin/next", args: "start -p 3011", env: { NODE_ENV: "production" } },
    { name: "weather-drive", cwd: "./projects/weather-drive", script: "node_modules/.bin/next", args: "start -p 3012", env: { NODE_ENV: "production" } },
    { name: "smart-fuel", cwd: "./projects/smart-fuel", script: "node_modules/.bin/next", args: "start -p 3013", env: { NODE_ENV: "production" } },

    // ── 도구 & 내부 ──
    { name: "mini-xd", cwd: "./projects/mini-xd", script: "node_modules/.bin/next", args: "start -p 3002", env: { NODE_ENV: "production" } },
    { name: "sandbox", cwd: "./projects/creative-sandbox", script: "node_modules/.bin/next", args: "start -p 3003", env: { NODE_ENV: "production" } },
    { name: "dashboard", cwd: "./projects/dashboard", script: "node_modules/.bin/next", args: "start -p 3008", env: { NODE_ENV: "production" } },
    { name: "chatbot", cwd: "./projects/cs-chatbot", script: "node_modules/.bin/next", args: "start -p 3009", env: { NODE_ENV: "production" } },
  ],
};
