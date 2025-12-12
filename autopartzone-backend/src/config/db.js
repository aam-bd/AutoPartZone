import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is undefined. Check .env file");

    // mongoose v6+ no longer requires/accepts `useNewUrlParser` / `useUnifiedTopology`
    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
