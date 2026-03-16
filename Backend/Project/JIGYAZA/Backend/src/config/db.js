import mongoose from "mongoose";

async function connectToDb(){
    const conn= await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to DataBase on port ${conn.connection.port}`);
}

export default connectToDb;