import express from "express";
import graph from "../graph/graph.js";

const app = express();
app.use(express.json());

app.post("/health", async (req, res) => {
  const { problem } = req.body;

  if (!problem || typeof problem !== "string") {
    return res.status(400).json({
      error: "Request body must include a string field named 'problem'.",
    });
  }

  const result = await graph(problem);

  res.status(200).json({
    result,
  });
});

export default app;
