import { StateGraph, StateSchema, type GraphNode } from "@langchain/langgraph";
import * as z from "zod";
import { OpenAIModel, GeminiModel, MistralModel } from "../service/ai.service.js";

/**
 * Schema for the graph, defining the structure of nodes and edges.
 * This is a simple example where each node has a 'name' and 'description'.
 */

/**
 * StateSchema : Defines the structure of the state for each node in the graph.
 * defines the format in which the data is being shared bw nodes in the graph.
 *
 */

/**
 * why we use ZOD?
 * Zod is a TypeScript-first schema declaration and validation library. It allows you to define the shape of your data and provides runtime validation to ensure that the data conforms to the defined schema. In the context of a graph, Zod can be used to validate the structure of nodes and edges, ensuring that they adhere to the expected format and contain the necessary information.
 */

const state = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_reason: z.string().default(""),
    solution_2_reason: z.string().default(""),
  }),
});

/**
 * State{
 * problem : "",
 * solution_1 : "",
 * solution_2 : "",
 * judge : {
 *  solution_1_score : 0,
 *  solution_2_score : 0,
 *  solution_1_reason : "",
 *  solution_2_reason : ""
 * }
 * }
 *
 */

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [openaiResponse, geminiResponse] = await Promise.all([
    OpenAIModel.invoke(state.problem),
    GeminiModel.invoke(state.problem),
  ]);

  return {
    solution_1: openaiResponse.text,
    solution_2: geminiResponse.text,
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  const judgePrompt = `Problem: ${state.problem}
Solution 1: ${state.solution_1}
Solution 2: ${state.solution_2}

Please evaluate the two solutions and provide a score out of 10 for each, along with a reason for your evaluation.`;

    const judgeResponse = await MistralModel.invoke(judgePrompt);
    
};
