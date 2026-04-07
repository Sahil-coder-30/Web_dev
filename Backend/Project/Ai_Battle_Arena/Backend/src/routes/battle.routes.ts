import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  runBattle,
  getBattleHistory,
  getLeaderboard,
  getBattleById,
} from "../controller/battleController.js";

const battleRouter = Router();

// All battle routes require auth
battleRouter.use(authenticate);

battleRouter.post("/", runBattle);               // POST   /battle        — run new battle
battleRouter.get("/history", getBattleHistory);  // GET    /battle/history — user's past battles (paginated)
battleRouter.get("/leaderboard", getLeaderboard);// GET    /battle/leaderboard — global leaderboard
battleRouter.get("/:id", getBattleById);         // GET    /battle/:id     — single battle detail

export default battleRouter;
