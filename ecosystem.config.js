// PM2 Ecosystem Configuration
// 사용법: pm2 start ecosystem.config.js
// 전체 재시작: pm2 restart all
// 상태 확인: pm2 status

module.exports = {
  apps: [
    {
      name: "portal",
      cwd: "./",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production" },
    },
    {
      name: "jejupass",
      cwd: "./projects/jejupass-promo",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      env: { NODE_ENV: "production" },
    },
    {
      name: "mini-xd",
      cwd: "./projects/mini-xd",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      env: { NODE_ENV: "production" },
    },
    {
      name: "sandbox",
      cwd: "./projects/creative-sandbox",
      script: "node_modules/.bin/next",
      args: "start -p 3003",
      env: { NODE_ENV: "production" },
    },
    {
      name: "weather",
      cwd: "./projects/jeju-weather",
      script: "node_modules/.bin/next",
      args: "start -p 3004",
      env: { NODE_ENV: "production" },
    },
    {
      name: "map",
      cwd: "./projects/jeju-map",
      script: "node_modules/.bin/next",
      args: "start -p 3005",
      env: { NODE_ENV: "production" },
    },
    {
      name: "travel",
      cwd: "./projects/jeju-travel-planner",
      script: "node_modules/.bin/next",
      args: "start -p 3006",
      env: { NODE_ENV: "production" },
    },
    {
      name: "course",
      cwd: "./projects/jeju-course-maker",
      script: "node_modules/.bin/next",
      args: "start -p 3007",
      env: { NODE_ENV: "production" },
    },
    {
      name: "dashboard",
      cwd: "./projects/dashboard",
      script: "node_modules/.bin/next",
      args: "start -p 3008",
      env: { NODE_ENV: "production" },
    },
    {
      name: "chatbot",
      cwd: "./projects/cs-chatbot",
      script: "node_modules/.bin/next",
      args: "start -p 3009",
      env: { NODE_ENV: "production" },
    },
    {
      name: "party",
      cwd: "./projects/jeju-party",
      script: "node_modules/.bin/next",
      args: "start -p 3010",
      env: { NODE_ENV: "production" },
    },
  ],
};
