# AI Battle Arena - Project Overview

## Project Description
"AI Battle Arena" is a web application where different Large Language Models (LLMs) compete against each other to solve a user-provided "problem" or prompt. A separate, impartial LLM acts as the judge to evaluate the solutions, score them, and provide detailed reasoning for the scores based on effectiveness, creativity, and feasibility.

## Current Backend Architecture
The backend is built with Node.js and Express, utilizing LangChain and LangGraph for orchestrating the AI workflow. 

### The Workflow (State Graph):
1. **User Input**: The user sends a string `problem` to the backend.
2. **Solution Generation (`solutionNode`)**: The problem is concurrently sent to two competing AI models:
   - **Model 1**: Cohere (`command-a-vision-07-2025`)
   - **Model 2**: Google Gemini (`gemini-2.5-flash-lite`)
3. **Judging (`judgeNode`)**: A third AI model, Mistral (`mistral-large-latest`), acts as the judge. It receives the prompt and both generated solutions.
4. **Scoring**: The judge utilizes Zod for structured output, evaluating each solution on a scale of 0-10 and providing detailed text feedback (`reason`) explaining the strengths and weaknesses.
5. **Response**: The backend returns the original problem, both solutions, and the judge's complete evaluation (scores and reasons).

### Backend Tech Stack:
- Express.js (Node.js framework)
- @langchain/langgraph (Agentic state orchestration)
- @langchain/cohere, @langchain/google-genai, @langchain/mistralai (LLM integrations)
- Zod (Schema validation and structured responses)

## Design Requirements for Stitch (Prompt Material)
If you are generating frontend screens using Stitch, you should design UI components that capture the "Battle Arena" theme. Key screens to generate:

1. **The Arena Setup (Home / Input Screen)**
   - A bold, modern input area (e.g., text area or chat-like input) where users can type in their `problem` or coding challenge.
   - A "Start Battle" or "Generate Solutions" call-to-action button.
   - Futuristic/dark-mode theme with vibrant accent colors (e.g., neon blue vs neon red) to represent the competing models.

2. **The Battle Results (Evaluation Dashboard)**
   - A side-by-side or split-screen layout displaying **Model 1 (Cohere)** vs **Model 2 (Gemini)**.
   - For each model, show the generated text (`solution_1` and `solution_2`).
   - A prominent **Score Display** out of 10 for each model (e.g., dynamic circular progress bars or modern gauges).
   - A dedicated "Judge's Verdict" section for each model containing the Mistral judge's textual feedback (`reason`).
   - A visual indicator declaring the "Winner" based on the higher score.

### Example Prompt For Stitch
> "Generate a modern, futuristic web app screen for an 'AI Battle Arena'. The screen should have a dark theme with glassmorphism elements. It needs a split-pane layout comparing two AI models side-by-side. Each side should display a generated text response, a bold score out of 10 with a circular progress bar, and a 'Judge's Verdict' text block explaining the score. Highlight the higher-scoring side as the winner with subtle glowing borders."
