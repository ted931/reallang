# Kaflix 아이디어 놀이터 — 배포 전략

> 도메인: realang.store
> 목적: 소규모 프로젝트들을 포탈로 묶어서 관리/배포

---

## 추천 구조

| 결정 | 추천 |
|------|------|
| URL | **서브도메인** (jejupass.realang.store) |
| 서버 | **VPS + Nginx** (Hetzner CX22, 월 $4.5) |
| 프로세스 | **PM2** |
| SSL | **Let's Encrypt 와일드카드** |
| CI/CD | **GitHub Actions → SSH** |
| 포탈 | **루트 Next.js 앱** |

```
realang.store              → 메인 포탈 (Kaflix 아이디어 놀이터) :3000
jejupass.realang.store     → 제주패스 홍보 플랫폼              :3001
mini-xd.realang.store      → AI 디자인→코드                   :3002
sandbox.realang.store      → AI 놀이터                        :3003
```

## 새 프로젝트 추가 (10분)

1. `npx create-next-app@latest projects/my-project`
2. package.json 포트 설정
3. .env.local 심볼릭 링크
4. 루트 스크립트 추가
5. registry.ts에 프로젝트 정보 추가
6. PM2 + Nginx 항목 추가

## 월 비용: ~$4.5 (약 6,200원)

셋업 총 소요: 약 2시간
