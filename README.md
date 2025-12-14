# Multi-repo contracts demo (Next.js + NestJS + ts-rest)

This bundle contains 6 sibling folders (treat them as separate repos):
- `contracts` — shared API contracts (ts-rest + zod)
- `auth` — Nest service that issues/validates auth tokens
- `manager` — Nest service (internal API for BFF)
- `repo` — Nest service (internal API for BFF)
- `bff` — Nest service (public API for frontend)
- `frontend` — Next.js app

## Prereqs
- Node 18+ (Node 20 recommended)
- npm

## 1) Install dependencies
Run these in separate terminals:

### Auth
```bash
cd auth
npm install
cp .env.example .env
npm run dev
```

### Manager
```bash
cd manager
npm install
cp .env.example .env
npm run dev
```

### Repo
```bash
cd repo
npm install
cp .env.example .env
npm run dev
```

### BFF
```bash
cd bff
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

> NOTE: Each service depends on `@acme/contracts` via `file:../contracts`, so keep these folders adjacent.

## 2) Verify Swagger UIs (generated from contracts)
- BFF Swagger: http://localhost:3000/docs
- Auth Swagger: http://localhost:3004/docs
- Manager Swagger: http://localhost:3001/docs
- Repo Swagger: http://localhost:3002/docs

## 3) Verify the frontend
- http://localhost:3003

Tip: Use the seeded IDs from Manager/Repo Swagger "Try it out" to call endpoints from the frontend.
