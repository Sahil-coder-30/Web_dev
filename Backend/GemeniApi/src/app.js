

const express = require('express');
const app = express();
app.use(express.json())
const { GoogleGenerativeAI } = require("@google/generative-ai");

// System Design: Singleton Pattern for GenAI instance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

const generateAiResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // DSA: Stream-based processing vs. Unary calls
    // Using generateContent for a simple request-response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, data: text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

app.post("/chat", generateAiResponse);

module.exports = app;