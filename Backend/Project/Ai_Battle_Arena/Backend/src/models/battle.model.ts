import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema(
  {
    solution_1_score: { type: Number, required: true, min: 0, max: 10 },
    solution_2_score: { type: Number, required: true, min: 0, max: 10 },
    solution_1_reason: { type: String, required: true },
    solution_2_reason: { type: String, required: true },
  },
  { _id: false }
);

const battleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    solution_1: {
      type: String,
      required: true,
    },
    solution_2: {
      type: String,
      required: true,
    },
    judge: {
      type: judgeSchema,
      required: true,
    },
    // Derived winner field: "model_1" | "model_2" | "tie"
    winner: {
      type: String,
      enum: ["model_1", "model_2", "tie"],
      required: true,
    },
  },
  { timestamps: true } // createdAt & updatedAt auto-managed by Mongoose
);

// Index for fast leaderboard queries per user
battleSchema.index({ userId: 1, createdAt: -1 });

const Battle = mongoose.model("Battle", battleSchema);

export default Battle;
