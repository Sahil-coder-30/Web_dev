import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

export const GeminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: geminiApiKey,
});

export const OpenAIModel = new ChatOpenAI({
  model: "gpt-5.2",
  apiKey: process.env.OPENAI_API_KEY,
});

export const MistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
});

