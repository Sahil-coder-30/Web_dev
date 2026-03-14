import mongoose from "mongoose";

export async function connectToDb() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db...");
  } catch (error) {
    throw error;
  }
}
