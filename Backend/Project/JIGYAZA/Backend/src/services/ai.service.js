import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage , AIMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateResponse = async (messages) => {
  const formatted = messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "ai") return new AIMessage(msg.content);
  }).filter(Boolean); // guard against unexpected roles

  const res = await geminiModel.invoke(formatted);
  return res.content;
};

export const createChatTitle = async (message) => {
  const res = await mistralModel.invoke([
    new SystemMessage(`You are a chat title generator. Given a conversation or the first user message, generate a concise, descriptive title for it.

// Rules:
// - Maximum 6 words
// - No quotes, punctuation, or trailing periods
// - Use title case
// - Capture the core topic or intent
// - Never use generic titles like "Chat" or "Conversation"
// - If the message is a question, summarize the topic — don't repeat the question

// Respond with ONLY the title. Nothing else.`),
    new HumanMessage(message),
  ]);

  return res.content.trim(); // ✅ .content not .text
};
