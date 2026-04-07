import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import runGraph from "../graph/graph.js";
import Battle from "../models/battle.model.js";

// Utility to determine winner from judge scores
const determineWinner = (s1: number, s2: number): "model_1" | "model_2" | "tie" => {
  if (s1 > s2) return "model_1";
  if (s2 > s1) return "model_2";
  return "tie";
};

// POST /battle  — run graph, persist result
export const runBattle = async (req: AuthRequest, res: Response) => {
  try {
    const { problem } = req.body;

    if (!problem || typeof problem !== "string") {
      return res.status(400).json({
        success: false,
        message: "Request body must include a string field 'problem'.",
        statusCode: 400,
      });
    }

    const result = await runGraph(problem) as any;

    const { solution_1, solution_2, judge } = result;
    const { solution_1_score, solution_2_score, solution_1_reason, solution_2_reason } = judge;

    const winner = determineWinner(solution_1_score, solution_2_score);

    const battle = new Battle({
      userId: req.user.userId,
      problem,
      solution_1,
      solution_2,
      judge: { solution_1_score, solution_2_score, solution_1_reason, solution_2_reason },
      winner,
    });

    await battle.save();

    res.status(200).json({ success: true, battle });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};

// GET /battle/history  — paginated history for the logged-in user
export const getBattleHistory = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [battles, total] = await Promise.all([
      Battle.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      Battle.countDocuments({ userId: req.user.userId }),
    ]);

    res.status(200).json({
      success: true,
      data: battles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};

// GET /battle/leaderboard  — top users ranked by win count
export const getLeaderboard = async (_req: AuthRequest, res: Response) => {
  try {
    const leaderboard = await Battle.aggregate([
      // Count wins per user
      {
        $group: {
          _id: "$userId",
          totalBattles: { $sum: 1 },
          model1Wins: { $sum: { $cond: [{ $eq: ["$winner", "model_1"] }, 1, 0] } },
          model2Wins: { $sum: { $cond: [{ $eq: ["$winner", "model_2"] }, 1, 0] } },
          ties: { $sum: { $cond: [{ $eq: ["$winner", "tie"] }, 1, 0] } },
          avgScore1: { $avg: "$judge.solution_1_score" },
          avgScore2: { $avg: "$judge.solution_2_score" },
        },
      },
      // Join with User collection for username
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Shape the output
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$user.username",
          totalBattles: 1,
          model1Wins: 1,
          model2Wins: 1,
          ties: 1,
          avgScore1: { $round: ["$avgScore1", 2] },
          avgScore2: { $round: ["$avgScore2", 2] },
        },
      },
      { $sort: { totalBattles: -1 } },
      { $limit: 20 },
    ]);

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};

// GET /battle/:id  — single battle detail
export const getBattleById = async (req: AuthRequest, res: Response) => {
  try {
    const battle = await Battle.findOne({ _id: req.params.id, userId: req.user.userId }).select("-__v");

    if (!battle) {
      return res.status(404).json({ success: false, message: "Battle not found", statusCode: 404 });
    }

    res.status(200).json({ success: true, data: battle });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};
