import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatCohere } from "@langchain/cohere";
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

const cohereApiKey = process.env.COHERE_API_KEY;
if (!cohereApiKey) {
  throw new Error("COHERE_API_KEY environment variable is not set");
}

export const CohereModel = new ChatCohere({
  model: "command-a-vision-07-2025",
  apiKey: cohereApiKey,
});

const mistralApiKey = process.env.MISTRAL_API_KEY;
if (!mistralApiKey) {
  throw new Error("MISTRAL_API_KEY environment variable is not set");
}

export const MistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: mistralApiKey,
});
