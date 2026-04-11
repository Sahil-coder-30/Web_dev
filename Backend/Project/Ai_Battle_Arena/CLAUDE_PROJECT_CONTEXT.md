# Project Context: AI Battle Arena

## 🚀 Overview
**AI Battle Arena** is a cutting-edge web application designed to evaluate and compare the capabilities of different Large Language Models (LLMs) in real-time. It provides a platform where two competing AI models are pitted against each other to solve a user-defined problem, while a third, impartial "Judge" AI evaluates their performance.

## 🎯 The Problem it Solves
In a world with dozens of LLMs, it's hard to know which one performs best for specific tasks. AI Battle Arena provides:
- **Direct Comparison**: Side-by-side evaluation of outputs.
- **Objective Judging**: Automated, structured feedback from a sophisticated model.
- **Real-time Insights**: Immediate scores and reasoning.

## 🛠️ Technical Stack

### **Backend (The Brains)**
- **Framework**: Node.js & Express.js with TypeScript.
- **AI Orchestration**: **LangGraph** (by LangChain) – used to manage the complex state-driven workflow of the battle.
- **Multi-Model Integration**:
  - **Competitor 1**: `Cohere` (command-a-vision-07-2025)
  - **Competitor 2**: `Google Gemini` (gemini-2.5-flash-lite)
  - **The Judge**: `Mistral AI` (mistral-large-latest)
- **Data Persistence**: **MongoDB** (Mongoose) for storing battle history, user data, and leaderboard statistics.
- **Validation**: **Zod** for schema validation and ensuring structured JSON outputs from the AI models.

### **Frontend (The Arena)**
- **Framework**: **React** (Vite)
- **Architecture**: **Feature-Driven Design** – a modular structure that scales easily and co-locates logic by domain.
- **Styling**: **SCSS** with a focus on modern design aesthetics (Dark Mode, Glassmorphism, and Futuristic UI).
- **Interactivity**: 
  - Real-time battle execution.
  - Side-by-side comparison view.
  - Dynamic score gauges and "Winner" indicators.
  - Full markdown support for AI responses using `react-markdown` and `react-syntax-highlighter`.

## 🔄 Core Workflow (LangGraph Implementation)
The battle is orchestrated using a state-driven graph:
1. **Input Node**: Captures the user's problem.
2. **Solution Node**: Triggers parallel requests to Cohere and Gemini.
3. **Judge Node**: Receives the original problem and both solutions. It evaluates them based on efficiency, creativity, and feasibility.
4. **Structured Format**: The judge uses a Zod schema to provide:
   - Numerical scores (0-10) for both competitors.
   - Detailed textual reasoning for each score.
5. **Output**: The results are persisted to MongoDB and sent to the frontend for visualization.

## ✨ Key Features
- **Live Battles**: Submit a prompt and watch models compete.
- **Impartial Judging**: Detailed reasoning for every score, removing human bias.
- **Battle History**: Persistent records of previous encounters.
- **Leaderboard**: Track which models are consistently winning the arena.
- **Responsive & Premium UI**: A dark-themed, futuristic interface designed for a high-end AI experience.

## 💎 Value Proposition for LinkedIn
- **Showcasing Orchestration**: Demonstrates advanced use of **LangGraph** for multi-agent workflows.
- **Multi-Vendor LLM Proficiency**: Experience working with Cohere, Google GenAI, and Mistral simultaneously.
- **Full-Stack Competency**: Bringing complex AI logic to life through a polished React frontend and a robust Express/MongoDB backend.
- **Structured AI Outputs**: Using Zod to transform "unpredictable" LLM text into reliable, structured data.

---

### **Instructions for Claude:**
"I am sharing the context of my project 'AI Battle Arena'. Please use this information to draft a highly engaging, professional, and slightly technical LinkedIn post. The post should highlight the use of **LangGraph** for model orchestration and the side-by-side comparison nature of the app. Use a tone that is proud but professional, targeting tech enthusiasts, developers, and AI researchers. Include relevant hashtags like #AI #GenerativeAI #LangChain #LangGraph #ReactJS #WebDevelopment."
