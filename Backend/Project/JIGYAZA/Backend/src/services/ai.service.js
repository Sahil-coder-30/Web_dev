import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOllama } from "@langchain/ollama"; // ✅ ADD THIS
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchInternet } from "./internet.service.js";
import { createAgent } from "langchain";

// ✅ SWAPPED - was ChatGoogleGenerativeAI, now local Ollama
const geminiModel = new ChatOllama({
  model: "qwen2.5-coder:7b",
  baseUrl: "http://localhost:11434",
});

const mistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const tavilySearchTool = tool(
  async ({ query }) => {
    try {
      const results = await searchInternet({ query });
      return results;
    } catch (e) {
      return "Error searching the internet";
    }
  },
  {
    name: "internet_search",
    description: "Search the internet for up-to-date and real-time information. Use this whenever the user asks for current events or information you are unsure about.",
    schema: z.object({
      query: z.string().describe("The specific search query to look up"),
    }),
  }
);

const agent = createAgent({
  model: geminiModel,
  tools: [tavilySearchTool],
  systemMessage: "You are a helpful assistant. and you have the access to the internet using the tavilySearchTool. Use it when you need to search the internet for up-to-date and real-time information.",
})

export const generateResponse = async (messages) => {
  const formatted = messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "ai") return new AIMessage(msg.content);
  }).filter(Boolean);
  console.log(messages);
  const res = await agent.invoke({ messages: formatted });
  const lastMessage = res.messages[res.messages.length - 1];
  return lastMessage.content;
};

export const createChatTitle = async (message) => {
  try {
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

    return res.content.trim();
  } catch (error) {
    console.error("Failed to generate chat title, falling back:", error);
    return "New Research";
  }
};