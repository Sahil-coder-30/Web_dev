# Backend Folder Structure - JIGYAZA

## Project Overview

**Project Name:** Perplexity  
**Framework:** Express.js (Node.js)  
**Database:** MongoDB (Mongoose)  
**Real-time Communication:** Socket.io  
**AI Integration:** LangChain (Google GenAI, Mistral AI)  
**Authentication:** JWT + Bcryptjs  
**Caching:** Redis (ioredis)  

---

## Directory Structure

```
Backend/
├── 📄 server.js                  # Main server entry point
├── 📄 app.js                     # Express app configuration
├── 📦 package.json               # Project dependencies
├── 📦 package-lock.json          # Locked dependency versions
├── 📝 Data_Modeling.md           # Database schema documentation
├── 📝 BACKEND_STRUCTURE.md       # This file
├── 🔐 .env                       # Environment variables (git ignored)
├── 📋 .gitignore                 # Git ignore rules
│
├── 📁 src/                       # Source code directory
│   ├── 📝 app.js                 # Express app setup & middleware
│   │
│   ├── 📁 config/                # Configuration files
│   │   ├── db.js                 # MongoDB connection setup
│   │   └── dgCache.js            # Redis cache configuration
│   │
│   ├── 📁 models/                # Database schemas (Data Models)
│   │   ├── user.model.js         # User schema definition
│   │   ├── chat.model.js         # Chat/Conversation schema
│   │   └── message.model.js      # Message schema
│   │
│   ├── 📁 controller/            # Business logic & request handlers
│   │   ├── authController.js     # Authentication handlers
│   │   └── chatController.js     # Chat/Conversation handlers
│   │
│   ├── 📁 routes/                # API endpoint definitions
│   │   ├── auth.routes.js        # Authentication endpoints
│   │   └── chat.routes.js        # Chat endpoints
│   │
│   ├── 📁 middleware/            # Express middleware
│   │   ├── auth.middleware.js    # JWT verification & auth check
│   │   └── errorHandler.js       # Global error handling
│   │
│   ├── 📁 validators/            # Input validation schemas
│   │   ├── loginValidator.js     # Login form validation
│   │   └── registerValidator.js  # Registration form validation
│   │
│   ├── 📁 services/              # Business logic & external services
│   │   ├── ai.service.js         # AI/LangChain service
│   │   ├── internet.service.js   # Web search/internet service (Tavily)
│   │   └── mail.service.js       # Email service (Nodemailer)
│   │
│   └── 📁 sockets/               # WebSocket handlers
│       └── server.socket.js      # Socket.io event handlers
│
└── 📁 node_modules/              # Installed dependencies
```

---

## Feature Projects Breakdown

### 1. **Authentication Feature** 🔐

**Purpose:** User registration, login, email verification, and session management

**Components:**

| File | Purpose |
|------|---------|
| `models/user.model.js` | User schema with email, password, verification status |
| `controller/authController.js` | Register, login, logout, verify email logic |
| `routes/auth.routes.js` | POST `/auth/register`, `/auth/login`, `/auth/verify` |
| `middleware/auth.middleware.js` | JWT token verification middleware |
| `validators/registerValidator.js` | Validate registration input (email, password) |
| `validators/loginValidator.js` | Validate login input |
| `services/mail.service.js` | Send verification emails |
| `config/db.js` | Database connection for user persistence |

**Flow:**
```
User Registration → Validator → Controller → Mail Service → User Model → DB
User Login → Validator → Controller → JWT Generation → Response
```

---

### 2. **Chat/Conversation Feature** 💬

**Purpose:** Real-time chat, conversation management, and message persistence

**Components:**

| File | Purpose |
|------|---------|
| `models/chat.model.js` | Chat/Conversation schema (title, participants, timestamps) |
| `models/message.model.js` | Message schema (content, sender, timestamp, chat_id) |
| `controller/chatController.js` | Create chat, fetch messages, delete chat logic |
| `routes/chat.routes.js` | GET/POST `/chat`, `/chat/:id`, `/messages` |
| `sockets/server.socket.js` | Real-time message send/receive via Socket.io |
| `services/ai.service.js` | AI response generation |
| `services/internet.service.js` | Web search for context |
| `config/dgCache.js` | Cache recent conversations & responses |
| `middleware/auth.middleware.js` | Verify user before accessing chats |

**Flow:**
```
User sends message → Socket.io → Save to Message Model → AI Service (generate response) → 
Cache response → Broadcast to client via Socket → Update Chat Model
```

---

### 3. **AI Service Feature** 🤖

**Purpose:** AI-powered responses using LangChain with multiple AI providers

**Components:**

| File | Purpose |
|------|---------|
| `services/ai.service.js` | LangChain integration, prompt processing |
| `services/internet.service.js` | Tavily search for real-time information |
| `config/dgCache.js` | Cache AI responses for faster retrieval |
| `controller/chatController.js` | Trigger AI response generation |

**Supported AI Providers:**
- Google GenAI
- Mistral AI
- LangChain Core

**Flow:**
```
User Query → Chat Controller → AI Service → Internet Service (if needed) → 
LangChain Processing → AI Model Response → Cache → Send to User
```

---

### 4. **Caching System** ⚡

**Purpose:** Optimize performance by caching frequently accessed data

**Components:**

| File | Purpose |
|------|---------|
| `config/dgCache.js` | Redis connection and cache configuration |
| `services/ai.service.js` | Cache AI response results |
| `services/internet.service.js` | Cache search results |

**Cached Items:**
- User sessions
- AI responses
- Search results
- Chat metadata

---

## Technology Stack

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | ^9.2.4 | MongoDB ODM |
| `socket.io` | ^4.8.3 | Real-time communication |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `ioredis` | ^5.10.0 | Redis client |
| `@langchain/core` | ^1.1.34 | LangChain core |
| `@langchain/google-genai` | ^2.1.26 | Google GenAI provider |
| `@langchain/mistralai` | ^1.0.7 | Mistral AI provider |
| `@tavily/core` | ^0.7.2 | Web search API |
| `nodemailer` | ^8.0.2 | Email service |
| `express-validator` | ^7.3.1 | Input validation |
| `cors` | ^2.8.6 | Cross-origin requests |
| `dotenv` | ^17.3.1 | Environment variables |
| `morgan` | ^1.10.1 | HTTP logging |
| `zod` | ^4.3.6 | Schema validation |

---

## Environment Variables

Required in `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://...
REDIS_URL=redis://...

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# AI Services
GOOGLE_API_KEY=your_google_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login
POST   /api/auth/logout        - User logout
POST   /api/auth/verify-email  - Verify email address
POST   /api/auth/refresh       - Refresh JWT token
```

### Chat Endpoints

```
GET    /api/chat               - Get all user chats
POST   /api/chat               - Create new chat
GET    /api/chat/:id           - Get chat details
DELETE /api/chat/:id           - Delete chat

GET    /api/messages/:chatId   - Get messages in chat
POST   /api/messages           - Send message (via Socket.io)
DELETE /api/messages/:id       - Delete message
```

---

## Socket.io Events

### Client → Server

```
connection          - User connects to socket
disconnect         - User disconnects
send_message       - Send new message to chat
typing            - User is typing
stop_typing       - User stopped typing
```

### Server → Client

```
new_message       - New message received
ai_response       - AI generated response
user_typing       - Other user is typing
user_stopped_typing - Other user stopped typing
error             - Error occurred
```

---

## Error Handling

**Global Error Handler:** `middleware/errorHandler.js`

**Error Types:**
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Not found errors (404)
- Server errors (500)

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": []
}
```

---

## Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Install dependencies
npm install

# Run tests (not configured yet)
npm test
```

---

## Best Practices

1. **Models**: Keep only schema definitions and validations
2. **Controllers**: Handle request/response logic only
3. **Services**: Contain business logic (AI processing, email, search)
4. **Middleware**: Pure request/response manipulation
5. **Validators**: Zod/express-validator for input validation
6. **Config**: Environment-specific and external service setup
7. **Routes**: Define endpoints and link to controllers

---

## Next Steps for Feature Expansion

- [ ] Add forgot password functionality
- [ ] Implement rate limiting
- [ ] Add user profile management
- [ ] Implement conversation sharing
- [ ] Add export chat history
- [ ] Create admin dashboard
- [ ] Implement analytics/logging
- [ ] Add file upload support

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/)
- [LangChain Documentation](https://js.langchain.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
