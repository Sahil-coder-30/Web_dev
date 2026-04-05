import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
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

const geminiModelWithTools = geminiModel.bindTools([tavilySearchTool]);

export const generateResponse = async (messages) => {
  const formatted = messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "ai" || msg.role === "assistant" || msg.role === "model") return new AIMessage(msg.content);
  }).filter(Boolean); // guard against unexpected roles

  let res = await geminiModelWithTools.invoke(formatted);

  if (res.tool_calls && res.tool_calls.length > 0) {
    formatted.push(res);
    for (const toolCall of res.tool_calls) {
      if (toolCall.name === "internet_search") {
        const toolResult = await tavilySearchTool.invoke(toolCall);
        formatted.push(new ToolMessage({
          tool_call_id: toolCall.id,
          content: toolResult
        }));
      }
    }
    // Re-invoke to let the AI formulate the final answer with the search context
    res = await geminiModelWithTools.invoke(formatted);
  }

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
