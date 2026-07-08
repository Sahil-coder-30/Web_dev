# JIGYAZA

JIGYAZA is a full-stack AI research/chat assistant inspired by Perplexity AI. It combines a React + Vite frontend with a Node.js + Express backend, AI-powered chat via LangChain, live internet search, real-time Socket.io streaming, JWT auth, MongoDB, and Redis.

---

## Project structure

- `Backend/`
  - `server.js` — backend entry point
  - `src/` — Express app, controllers, services, routes, models, middleware, sockets
  - `package.json` — backend dependencies and scripts
- `Frontend/`
  - `src/` — React app, components, routes, Redux state, styles
  - `package.json` — frontend dependencies and scripts
- `PROJECT_REFERENCE.md` — living reference for architecture and implementation
- `STREAMING_GUIDE.md` — real-time socket streaming architecture guide

---

## Tech stack

- Frontend: React 19, Vite, Redux Toolkit, React Router v7, SCSS
- Backend: Node.js, Express 5, Mongoose/MongoDB, Redis via ioredis, Socket.io
- AI: LangChain, Gemini 2.5 Flash, Mistral Large, Tavily internet search
- Auth: JWT cookies, Redis blacklist logout
- Email: Nodemailer with Gmail App Password

---

## Key backend features

- AI chat with streaming token updates via Socket.io
- Live internet search integration through Tavily
- User registration, login, email verification, OTP, password reset
- Chat history persistence in MongoDB
- Redis-based caching and token blacklist

---

## Setup and run

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env   # create your own .env file if needed
npm run dev
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

> The frontend is configured to run with Vite, and the backend expects the frontend origin at `http://localhost:5173`.

---

## Backend environment variables

Create a `.env` file in `Backend/` and provide the values below.

- `PORT` — backend HTTP port
- `MONGO_URI` — MongoDB connection string
- `REDIS_HOST` — Redis host
- `REDIS_PORT` — Redis port
- `REDIS_PASSWORD` — Redis password
- `JWT_SECRET` — JWT signing secret
- `FRONTEND_URL` — frontend URL used in verification email links (default `http://localhost:5173`)
- `GOOGLE_GEMINI_API_KEY` — Gemini API key
- `MISTRAL_API_KEY` — Mistral API key
- `TAVILY_API_KEY` — Tavily API key
- `GOOGLE_USER` — Gmail sender email
- `GOOGLE_APP_PASSWORD` — Gmail App Password for Nodemailer

---

## How to use

1. Start the backend.
2. Start the frontend.
3. Open the frontend in the browser.
4. Register or log in.
5. Create a new chat and ask questions.
6. The AI uses internet search when needed and streams results in real time.

---

## Useful commands

### Backend

- `npm run dev` — run the backend with `nodemon`
- `npm test` — placeholder test command

### Frontend

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run lint` — run ESLint
- `npm run preview` — preview built frontend

---

## More documentation

- `PROJECT_REFERENCE.md` — detailed architecture and feature reference
- `STREAMING_GUIDE.md` — socket streaming implementation notes

---

## Notes

- The backend can start without Redis if Redis is unavailable, but caching, OTP, and logout blacklist features may be degraded.
- The AI agent uses `gemini-2.5-flash` for chat and `mistral-large-latest` for chat title generation.
