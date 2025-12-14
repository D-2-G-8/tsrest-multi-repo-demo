# bff

Run dev server:
```bash
npm install
cp .env.example .env
npm run dev
```

Open Swagger UI:
- http://localhost:3000/docs

This service exposes the public API for the frontend (`/v1/...`) and proxies calls to Manager and Repo services.
