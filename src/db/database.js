import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected Successfully...");
  } catch (error) {
    console.log("MongoDB Connection failed", error.message);
    process.exit(1); //tells the system something went wrong
  }
};

export default connectMongoDB;
