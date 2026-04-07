import {
  END,
  START,
  StateGraph,
  StateSchema,
  type GraphNode,
} from "@langchain/langgraph";
import * as z from "zod";
import {
  CohereModel,
  GeminiModel,
  MistralModel,
} from "../service/ai.service.js";
import { createAgent, HumanMessage, toolStrategy } from "langchain";
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
  const [cohereResponse, geminiResponse] = await Promise.all([
    CohereModel.invoke(state.problem),
    GeminiModel.invoke(state.problem),
  ]);

  return {
    solution_1: cohereResponse.text,
    solution_2: geminiResponse.text,
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  const judge = createAgent({
    model: MistralModel,
    responseFormat: toolStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reason: z.string(),
        solution_2_reason: z.string(),
      }),
    ),
    systemPrompt: `You are a judge tasked with evaluating two solutions provided for a given problem. Your goal is to assess the quality of each solution based on its effectiveness, creativity, and feasibility. You will assign a score between 0 and 10 for each solution, where 0 indicates a poor solution and 10 indicates an excellent solution. Additionally, you will provide a reason for the score assigned to each solution, explaining the strengths and weaknesses of each one.`,
  });

  const judgeRes = await judge.invoke({
    messages: [
      new HumanMessage(`
                Problem: ${state.problem}
                Solution 1: ${state.solution_1}
                Solution 2: ${state.solution_2}
                Please evaluate the two solutions and provide scores and reasons for each.`),
    ],
  });

  const {
    solution_1_score,
    solution_2_score,
    solution_1_reason,
    solution_2_reason,
  } = judgeRes.structuredResponse;

  return {
    judge: {
      solution_1_score,
      solution_2_score,
      solution_1_reason,
      solution_2_reason,
    },
  };
};

const graph = new StateGraph(state)
  .addNode("solutionNode", solutionNode)
  .addNode("judgeNode", judgeNode)
  .addEdge(START, "solutionNode")
  .addEdge("solutionNode", "judgeNode")
  .addEdge("judgeNode", END)
  .compile();

export default async function runGraph(problem: string): Promise<unknown> {
  const result = await graph.invoke({
    problem: problem,
  });

  return result;
}
