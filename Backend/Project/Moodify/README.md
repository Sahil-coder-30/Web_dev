# Moodify

Moodify is a full-stack project combining a Node.js/Express backend with a React + Vite frontend. The application includes user authentication, email verification, Redis-backed logout token management, and face-expression mood detection using MediaPipe.

## Project structure

- `Backend/` — Node.js backend
  - `server.js` — entrypoint starts Express and connects to MongoDB + Redis
  - `src/app.js` — Express app setup and routing
  - `src/config/` — database and Redis cache configuration
  - `src/controllers/` — authentication controllers and email verification logic
  - `src/routes/` — auth API routes
  - `src/models/` — Mongoose user model with hashed passwords
  - `src/validators/` — validation rules for register/login requests
  - `src/middleware/` — authentication middleware
  - `src/services/` — email sending service

- `Frontend/` — React frontend
  - `src/App.jsx` — loads the face recognition feature
  - `src/Features/FaceExpression/components/FaceExpresstion.jsx` — mood detection UI using MediaPipe

## Features

### Backend

- User registration with strong validation
- Email verification via JWT token
- Login with secure cookies
- Logout with token blacklisting in Redis
- Protected profile endpoint
- MongoDB persistence via Mongoose
- Redis connection handling and caching support

### Frontend

- React + Vite app
- Face expression detection using `@mediapipe/tasks-vision`
- Supports moods such as Happy, Sad, Angry, Surprised, Sleepy, and Neutral
- Webcam-based detection UI

## Environment variables

Create a `.env` file inside `Backend/` with values similar to:

```env
MONGO_URI=mongodb://localhost:27017/moodify
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
PORT=3000
NODE_ENV=development
```

> Adjust `FRONTEND_URL` if the frontend runs on a different host or port.

## Setup

### Backend

1. Open a terminal in `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
4. The backend listens on `PORT` or `3000` by default.

### Frontend

1. Open a terminal in `Frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL shown in the terminal to use the app.

## API endpoints

The backend exposes authentication routes under `/api/auth`:

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive auth cookie
- `GET /api/auth/verify?token=<token>` — verify email address
- `POST /api/auth/logout` — clear login cookie and blacklist token
- `GET /api/auth/getMe` — retrieve authenticated user profile

## Notes

- The frontend currently renders the `FaceRecognition` component as the main app.
- The backend uses Redis for logout token invalidation and session-related caching.
- Email verification uses a styled HTML message and a one-hour JWT verification token.

## Development tips

- Ensure MongoDB and Redis are running before starting the backend.
- Use browser console/network tools to debug frontend requests to `/api/auth`.
- For local development, verify `FRONTEND_URL` points to the running React app.

## License

This repository does not include a license file. Add one if you plan to share or publish the code.
