
import dotenv from "dotenv";
dotenv.config();
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import * as readline from "readline";
import * as z from 'zod'
import { tool } from "@langchain/core/tools";
import { sendEmail } from "./mail.service.js";
import { HumanMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const EmailTool = tool(
    sendEmail,
    {
    name : "emailTool",
    description : "user to send email..",
    schema : z.object({
        to : z.string().describe("The recipent of this email .."),
        html : z.string().describe("The HTML content goes here for the mail "),
        subject : z.string().describe("The subject for the email goes here...")
    })
})

const model = new ChatMistralAI({
  model: "mistral-small-latest",
});

const agent = createAgent({
    model,
    tools: [EmailTool]
})
const messages = [];
function askQuestion() {
  rl.question("You: ", async (ans) => {
    if (ans.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }
    messages.push(new HumanMessage(ans));
    const res = await agent.invoke({messages});
    messages.push(res.messages[res.messages.length -1]);
    console.log(res.messages[res.messages.length -1].text);
    askQuestion();
  });
}

console.log("Welcome to Mistral AI. Type 'exit' to quit.");
askQuestion();

