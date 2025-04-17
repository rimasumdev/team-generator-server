import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "Connection string format verification:",
      process.env.MONGODB_URI.startsWith("mongodb+srv://")
    );

    // MongoDB connection options
    const options = {
      dbName: "teamplay",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("Using connection options:", JSON.stringify(options, null, 2));

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected Successfully!`);
    console.log(`Connected to database: ${conn.connection.name}`);
    console.log(`Host: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error Details:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

export default connectDB;
