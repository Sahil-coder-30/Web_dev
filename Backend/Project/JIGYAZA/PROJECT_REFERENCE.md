# JIGYAZA — Project Reference

> This file is a living reference for the JIGYAZA full-stack AI assistant application.  
> Last updated: 2026-05-26

---

## 1. Project Overview

**JIGYAZA** is a full-stack AI-powered research/chat assistant, similar to Perplexity AI. Users can sign up, log in, create chat sessions, and ask questions which are answered by a **LangChain agent** (backed by **Gemini 2.5 Flash**) that has live-internet-search capability via **Tavily**.

- **Frontend**: React 19 + Vite, SCSS, Redux Toolkit, React Router v7  
- **Backend**: Node.js + Express 5, MongoDB (Mongoose), Redis (ioredis), Socket.io, LangChain  
- **Auth**: JWT in HTTP-only cookies + Redis token blacklisting for logout  
- **AI**: LangChain agent → Gemini 2.5 Flash (primary) + Mistral Large (title generation)  
- **Email**: Nodemailer via Gmail App Password  
- **Realtime**: Socket.io (fully implemented — hybrid HTTP POST + Socket.io streaming of tokens and thinking/searching states)

---

## 2. Directory Structure

```
JIGYAZA/
├── PROJECT_REFERENCE.md           # This project reference document
├── STREAMING_GUIDE.md             # Architecture & implementation guide for real-time socket streaming
├── Backend/
│   ├── server.js                  # Entry point: HTTP server + Socket.io + Redis wait
│   ├── .env                       # Environment variables (see §5)
│   ├── package.json               # Backend deps
│   └── src/
│       ├── app.js                 # Express app (CORS, cookie-parser, morgan, routes)
│       ├── config/
│       │   ├── db.js              # Mongoose connect
│       │   └── dgCache.js         # ioredis client with event listeners
│       ├── controller/
│       │   ├── authController.js  # All auth logic (register, login, verify, OTP, reset, logout)
│       │   └── chatController.js  # Chat CRUD + message flow + AI call
│       ├── middleware/
│       │   ├── auth.middleware.js # JWT verify + Redis blacklist check (identifyUser)
│       │   └── errorHandler.js    # Global error middleware
│       ├── models/
│       │   ├── user.model.js      # User schema (bcrypt pre-save hook, comparePassword)
│       │   ├── chat.model.js      # Chat schema (user ref, title)
│       │   └── message.model.js   # Message schema (chat ref, content, thinking, role: user|ai)
│       ├── routes/
│       │   ├── auth.routes.js     # /api/auth/* routes
│       │   └── chat.routes.js     # /api/chats/* routes
│       ├── services/
│       │   ├── ai.service.js      # LangChain agent + generateResponse + createChatTitle
│       │   ├── internet.service.js # Tavily web search wrapper
│       │   └── mail.service.js    # Nodemailer sendEmail utility
│       ├── sockets/
│       │   └── server.socket.js   # Socket.io server init + getIo() accessor
│       └── validators/
│           ├── registerValidator.js  # express-validator register rules
│           └── loginValidator.js     # express-validator login rules
│
└── Frontend/
    ├── index.html
    ├── vite.config.js             # Vite config
    └── src/
        ├── main.jsx               # React DOM root, Redux Provider
        ├── style.scss             # Global styles
        ├── app/
        │   ├── App.jsx            # BrowserRouter + all Routes + EntryLoader
        │   └── app.store.js       # Redux store (auth + chat reducers)
        ├── assets/                # Static assets
        ├── components/
        │   ├── HeroLogoBg/
        │   │   └── HeroLogoBg.jsx # Animated logo background component
        │   ├── Loaders/
        │   │   ├── EntryLoader/   # Full-screen entry animation (shown once at /)
        │   │   └── loder/         # Inline spinner Loder component
        │   ├── Protected/
        │   │   └── Protected.jsx  # Route guard — redirects to /login if unauthenticated
        │   └── Testimonials/      # (Testimonials component)
        └── features/
            ├── Auth/
            │   ├── auth.slice.js  # Redux: { user, loading, error }
            │   ├── hook/          # useAuth.js hook (fetchCurrentUser, login, logout, etc.)
            │   ├── pages/
            │   │   ├── Login.jsx
            │   │   ├── Register.jsx
            │   │   ├── VerifyEmail.jsx
            │   │   └── ForgotPassword.jsx  # Also used for /reset-password
            │   ├── services/
            │   │   └── auth.api.js  # Axios calls to /api/auth/*
            │   └── styles/
            ├── LandingPage/
            │   ├── LandingPage.jsx  # Full landing page (large: 27 KB)
            │   └── LandingPage.scss # Landing page styles (large: 46 KB)
            ├── Legal/
            │   ├── pages/
            │   │   ├── PrivacyPolicy.jsx
            │   │   └── TermsAndConditions.jsx
            │   └── styles/
            └── chat/
                ├── chat.slice.js    # Redux: { chats{}, currentChatId, isLoading, error }
                ├── Hooks/
                │   └── useChat.js   # handelSendMessage, fetchChats, fetchChatMessages, deleteChatProcess
                ├── components/
                │   ├── Chat.jsx        # Main chat UI (markdown rendering, code blocks, input)
                │   ├── Sidebar.jsx     # Chat history sidebar (collapsible)
                │   ├── ChatSkeleton.jsx
                │   └── ChatSkeleton.scss
                ├── pages/
                │   └── Dashboard.jsx   # Wraps Sidebar + Chat, manages layout state
                ├── service/
                │   ├── chat.api.js     # Axios calls to /api/chats/*
                │   └── chat.socket.js  # Socket.io client init (connect only)
                └── styles/
                    └── Dashboard.scss  # All chat UI styles
```

---

## 3. Backend — Key Details

### 3.1 Entry Point (`server.js`)
- Creates an `http.Server` from the Express `app`
- Calls `initSocket(httpServer)` to attach Socket.io
- Waits for Redis to be ready (10 s timeout) before starting the HTTP listener
- `PORT` is read from `.env`

### 3.2 Express App (`src/app.js`)
- **CORS**: `origin: 'http://localhost:5173'`, `credentials: true`
- **Middleware**: `cookieParser`, `express.json`, `morgan('dev')`
- **Special route**: `GET /verify` → `authVerifyController` (for email-link verification)
- **API prefixes**: `/api/auth` and `/api/chats`
- **Last middleware**: global `errorHandler`

### 3.3 API Routes

#### Auth (`/api/auth/*`)
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/register` | `registerValidator` | `authRegisterController` |
| POST | `/login` | `loginValidator` | `authLoginController` |
| GET | `/verify` | — | `authVerifyController` |
| GET | `/getMe` | `identifyUser` | `authGetMeController` |
| POST | `/verify-otp` | — | `authVerifyOtpController` |
| POST | `/resend-otp` | — | `authResendOtpController` |
| POST | `/forget-password` | — | `authForgetPasswordController` |
| POST | `/reset-password` | — | `authResetPasswordController` |
| POST | `/auto-verify` | — | `authCheckAutoVerifyController` |
| POST | `/logout` | `identifyUser` | `authLogoutController` |

Also available as `GET /verify` directly on the root app (for email links).

#### Chat (`/api/chats/*`)
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/messages` | `identifyUser` | `chatMessageController` |
| GET | `/` | `identifyUser` | `getChats` |
| GET | `/:chatId/messages` | `identifyUser` | `allMessagesofChat` |
| DELETE | `/:chatId/deleteChat` | `identifyUser` | `deleteChat` |

### 3.4 Auth Middleware (`identifyUser`)
1. Reads `token` from `req.cookies.token`
2. Checks Redis for `blacklist:<token>` — rejects if found
3. Verifies JWT with `process.env.JWT_SECRET`
4. Sets `req.user = decoded` (contains `id`)

### 3.5 Chat Flow (`chatController.js → ai.service.js`)
1. **Request:** Client sends `POST /api/chats/messages` with `{ messages: string, chatId?: string, socketId?: string }`.
2. **Setup:** If no `chatId`, a title is generated (Mistral) and a new `Chat` doc is created. User message is saved to DB (`role: "user"`).
3. **Execution Choice:**
   - **Streaming (Socket-based, if `socketId` is provided):**
     - Generates a temporary message ID `_id` and responds instantly with HTTP 201 containing `{ chat, Aimessage: tempAimessage }`.
     - Starts streaming in the background without blocking the HTTP thread.
     - Listens to LangChain `streamEvents()` (v2) and emits `chat_thinking` (tool start/end) and `chat_chunk` (text tokens) to the client's socket ID in real time.
     - Saves the final AI response and accumulated thinking thoughts into MongoDB, then emits `chat_done`.
   - **Fallback (Synchronous, if `socketId` is absent):**
     - Calls `generateResponse()` (which blocks until complete), saves the complete AI response to DB, and returns HTTP 200 with all messages.

### 3.6 AI Service (`src/services/ai.service.js`)
- **Primary model**: `gemini-2.5-flash` via `@langchain/google-genai`
- **Title model**: `mistral-large-latest` via `@langchain/mistralai`
- **Tool**: `internet_search` — calls Tavily with `maxResults: 5`, `searchDepth: "fast"`
- **Agent**: LangChain `createAgent` with Gemini + Tavily tool
- `generateResponse(messages)` — synchronous execution using agent `.invoke()`
- `generateStreamResponse(messages)` — asynchronous execution yielding event chunks using agent `.streamEvents(..., { version: "v2" })`
- `createChatTitle(message)` — uses Mistral to generate a ≤6-word title

### 3.7 MongoDB Models

**User**
```
{ username (unique, lowercase), email (unique), password (bcrypt), verified: bool }
```
- Pre-save hook hashes password with bcrypt (salt 10)
- `comparePassword(candidatePassword)` instance method

**Chat**
```
{ user: ObjectId→User, title: string (default "New Chat") }
```

**Message**
```
{ chat: ObjectId→Chat, content: string, thinking: string, role: enum["user", "ai"] }
```

### 3.8 Redis Usage
- Client: `ioredis` connecting via `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **Token blacklisting**: on logout, token stored as `blacklist:<token>` key
- Server waits for Redis `ready` event before accepting requests

### 3.9 Socket.io
- Initialized on the HTTP server (CORS: `localhost:5173`, credentials enabled)
- Integrated into backend chat controllers for real-time background streaming
- Emits events `chat_thinking` (thinking logs), `chat_chunk` (token streams), `chat_done` (final completion), and `chat_error`
- `getIo()` / `getId()` accessors available to retrieve the server instance for broadcasting

---

## 4. Frontend — Key Details

### 4.1 Routing (`App.jsx`)
| Path | Component | Protected? |
|------|-----------|-----------|
| `/` | `LandingPage` | No |
| `/dashboard` | `Dashboard` | ✅ Yes |
| `/login` | `Login` | No |
| `/register` | `Register` | No |
| `/verify` | `VerifyEmail` | No |
| `/forgot-password` | `ForgotPassword` | No |
| `/reset-password` | `ForgotPassword` | No |
| `/privacy` | `PrivacyPolicy` | No |
| `/terms` | `TermsAndConditions` | No |

- On mount, `App` calls `auth.fetchCurrentUser()` to check session
- Shows `EntryLoader` full-screen overlay only on the first visit to `/`

### 4.2 Redux Store
Two slices:

**auth slice** (`features/Auth/auth.slice.js`)
```
{ user: null, loading: false, error: null }
Actions: setUser, setLoading, setError
```

**chat slice** (`features/chat/chat.slice.js`)
```
{
  chats: { [chatId]: { id, title, message[], lastUpdated } },
  currentChatId: null,
  isLoading: false,
  error: null
}
Actions: createNewChat, createNewMessage, appendTokenToLastMessage, updateLastMessageThinking,
         updateLastMessageContent, setMessagesForChat, removeChat, setchats, setcurrentChatId,
         setisLoading, seterror
```

### 4.3 Chat Feature Flow
1. `Dashboard.jsx` — top-level layout; holds sidebar open/close state; renders `<Sidebar>` + `<Chat>`, invokes socket connection and registers socket listeners on mount
2. `useChat.js` — custom hook providing: `inializeSocketConnection`, `setupSocketListeners` (registers socket events to Redux dispatch), `handelSendMessage`, `fetchChats`, `fetchChatMessages`, `deleteChatProcess`
3. `Chat.jsx` — renders message thread (ReactMarkdown + GFM + custom `CodeBlock` with copy button), typing indicator, interactive collapsible search thinking process block (`AIMessageRow`), smoothly animated typing/token stream, input textarea (Enter to send, Shift+Enter for newline), quick-chip suggestions on new chat
4. `Sidebar.jsx` — shows chat history list; handles chat selection + delete (with inline deletion confirmation)
5. `chat.api.js` — Axios wrapper for `/api/chats/*` endpoints
6. `chat.socket.js` — initializes and caches a single persistent Socket.io client connected to `localhost:3000` with credential support

### 4.4 Key UI Details (Chat.jsx)
- **Optimistic UI**: message appears immediately before API response
- **Auto-scroll**: `useRef` + `scrollIntoView` on new messages / loading state changes
- **Markdown**: `react-markdown` + `remark-gfm` + custom `CodeBlock` component
- **Code block**: displays language label, copy-to-clipboard button (2 s "Copied!" feedback)
- **Typing indicator**: spinner (`Loder` component) + "Extracting insights..." text
- **Icons**: Google Material Symbols Outlined

### 4.5 Auth Flow
- JWT returned by backend is stored in an **HTTP-only cookie** (`token`)
- Frontend never directly reads the token
- `Protected.jsx` — reads auth state from Redux; redirects to `/login` if no user
- `useAuth` hook — wraps API calls and dispatches to Redux auth slice

---

## 5. Environment Variables

### Backend (`.env`)
```
PORT=
MONGO_URI=
JWT_SECRET=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
GOOGLE_GEMINI_API_KEY=
MISTRAL_API_KEY=
TAVILY_API_KEY=
GOOGLE_USER=          # Gmail address
GOOGLE_APP_PASSWORD=  # Gmail App Password (not account password)
```

### Frontend (`.env`)
```
(Minimal — currently just base URL or Vite-specific vars)
```

---

## 6. Key Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `express@^5` | HTTP framework |
| `mongoose@^9` | MongoDB ODM |
| `ioredis@^5` | Redis client |
| `socket.io@^4.8` | WebSocket server |
| `@langchain/google-genai` | Gemini model |
| `@langchain/mistralai` | Mistral model |
| `langchain` | `createAgent` |
| `@tavily/core` | Web search API |
| `zod@^4` | Tool schema validation |
| `jsonwebtoken` | JWT sign/verify |
| `bcryptjs` | Password hashing |
| `nodemailer` | Email sending |
| `cookie-parser` | Cookie reading |
| `express-validator` | Input validation |
| `morgan` | HTTP request logging |

### Frontend
| Package | Purpose |
|---------|---------|
| `react@^19` + `react-dom` | UI library |
| `react-router-dom@^7` | Client routing |
| `@reduxjs/toolkit` + `react-redux` | State management |
| `axios` | HTTP client |
| `socket.io-client@^4.8` | WebSocket client |
| `react-markdown` + `remark-gfm` | Markdown rendering |
| `gsap` + `@gsap/react` | Animations |
| `framer-motion` | Motion animations |
| `sass` | SCSS compilation |
| `vite@^7` | Build tool / dev server |

---

## 7. Development Commands

```bash
# Backend (runs with nodemon)
cd Backend && npm run dev      # → nodemon server.js on PORT env var

# Frontend
cd Frontend && npm run dev     # → Vite dev server on localhost:5173
```

---

## 8. Known Issues / WIP / Design Decisions

1. **[RESOLVED] Socket.io streaming** — Now fully wired. Real-time token streaming and intermediate tool-calling thinking logs are supported via hybrid HTTP + Socket.io integration.
2. **`chatMessageController`** passes the raw DB message array to `generateResponse()`; messages have `{ content, role }` not the initial string body — `ai.service.js` correctly handles this.
3. **Auth controller is very large** (`63 KB`) — covers register, login, email verification (OTP + link), forgot/reset password, auto-verify, getMe, logout.
4. **`chat.slice.js` message structure inconsistency**: new messages optimistically pushed as `{ message, role }` but DB-loaded messages have `{ content, role }` — the `Chat.jsx` renders using `msg.content` so optimistic messages may display incorrectly after refresh (fixed by full fetch on re-load).
5. **CORS is hardcoded** to `localhost:5173` (backend) and `localhost:3000` (socket client) — needs env-based config for production.
6. **Token blacklist TTL**: Redis `blacklist:<token>` keys have no explicit TTL — ideally should match JWT expiry.
7. **`package.json` name** on backend is `"perplexity"` (leftover from project start).

---

## 9. Conversation History Summary (Major Milestones)

| Date | Topic |
|------|-------|
| Apr 7 | Initial UI setup, landing page, animations, sidebar |
| Apr 7 | Migrated auth to HTTP-only cookies |
| Apr 7 | Responsive sidebar (icon-only collapsed state) |
| Apr 8 | Routing restructure: `/` = landing, `/dashboard` = chat |
| Apr 8 | Fixed AI chat memory (message history formatting) |
| Apr 8 | LangChain agent + Tavily tool integration |
| Apr 8 | Chat context optimization (sliding window / windowing) |
| Apr 8 | Planned Socket.io streaming for LangChain tokens |
| May 24 | Tested local model configuration (Ollama/Qwen) for agent execution |
| May 24 | Implemented complete real-time token/thinking streaming via Socket.io and cleaned up root-level redundant npm package files |
