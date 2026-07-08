# AI Battle Arena

A full-stack battle arena application that pits AI model solutions against each other. The frontend is built with React + Vite, while the backend uses Express, TypeScript, MongoDB, and LangChain to orchestrate AI battles, scoring, and user data.

## Project overview

- **Frontend**: React + Vite app with authentication, battle creation, battle history, and leaderboard views.
- **Backend**: Express server with JWT-based authentication, MongoDB persistence, and AI battle execution through LangChain graph logic.
- **Data**: Users, battles, scores, and leaderboard states are stored in MongoDB.

## Architecture

- `Backend/`
  - `server.ts` — backend entry point and MongoDB connection logic
  - `src/app/app.ts` — Express app configuration, CORS, routes, middleware
  - `src/routes/` — auth and battle route definitions
  - `src/controller/` — request handlers for auth and battle operations
  - `src/models/` — MongoDB schemas for users and battles
  - `src/graph/graph.ts` — LangChain graph logic for evaluating AI battles
  - `src/config/db.ts` — MongoDB connection helper

- `Frontend/`
  - `src/App.jsx` — React app routes and providers
  - `src/features/Auth/` — authentication pages, context, and API service
  - `src/features/Arena/` — battle workflow, pages, and API service
  - `src/features/History/` — battle history, detail, and leaderboard pages
  - `src/features/Leaderboard/` — leaderboard page
  - `src/components/` — reusable UI components

## Features

- User registration and login
- HttpOnly cookie-based authentication
- Create an AI battle from a user-provided problem prompt
- Persist battle results and judge scores
- View battle history and single battle details
- View a leaderboard ranking by battle and win statistics

## Setup

### 1. Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 2. Configure backend environment

Create a `.env` file inside `Backend/` with values like:

```env
MONGO_URI=mongodb://localhost:27017/ai_battle_arena
JWT_SECRET=your_jwt_secret
PORT=3000
```

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — optional backend port (default `3000`)

### 3. Run the backend

```bash
cd Backend
npm run dev
```

### 4. Run the frontend

```bash
cd Frontend
npm run dev
```

## API Endpoints

### Auth

- `POST /auth/register` — register a new user
- `POST /auth/login` — login and set auth cookie
- `POST /auth/logout` — logout and clear auth cookie
- `POST /auth/refresh` — refresh endpoint placeholder
- `GET /auth/me` — get authenticated user profile

### Battle

- `POST /battle` — start a new battle with a `problem` prompt
- `GET /battle/history` — authenticated user battle history
- `GET /battle/leaderboard` — leaderboard data
- `GET /battle/:id` — authenticated battle detail by id

## Frontend routes

- `/login`
- `/register`
- `/`
- `/battle`
- `/results`
- `/history`
- `/history/:id`
- `/leaderboard`

## Development notes

- Backend CORS is currently configured for `https://ai-battle-arena-sigma.vercel.app`.
- Frontend API clients in `Frontend/src/features/Auth/services/auth.api.js` and `Frontend/src/features/Arena/services/arena.api.js` currently use `https://aibattlearena.vercel.app` as the backend base URL.
- For local development, update those URLs or add a proxy so the frontend can connect to your local backend.

## Deployment

The project appears configured for a Vercel-hosted frontend/backend deployment. If deploying locally, ensure the backend CORS origin and frontend API base URLs match your local development host.

## Notes

- The backend uses LangChain to run AI graph battles and judge two model solutions.
- User authentication relies on secure, cross-site compatible cookies (`SameSite=None`, `secure: true`).
- MongoDB is the persistence layer for users and battle records.
