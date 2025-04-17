import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

async function startServer() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Load environment variables
    const envPath = join(__dirname, ".env");
    dotenv.config({ path: envPath });

    // Validate required environment variables
    const requiredEnvVars = ["MONGODB_URI", "PORT", "CORS_ORIGIN", "NODE_ENV"];
    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
      );
    }

    const app = express();

    // Connect to MongoDB
    await connectDB();

    // CORS configuration with allowed origins
    const allowedOrigins = [
      "http://localhost:5173", // Local development
      "http://127.0.0.1:5173", // Local development alternative
      "https://createteam.vercel.app",
      "https://team-generator-git-main-rimasumdevs-projects.vercel.app",
      "https://weareateam.vercel.app",
    ];

    app.use(
      cors({
        origin: function (origin, callback) {
          // allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);

          if (allowedOrigins.indexOf(origin) === -1) {
            console.log("Origin not allowed:", origin);
            return callback(
              new Error(
                "The CORS policy for this site does not allow access from the specified Origin."
              ),
              false
            );
          }
          return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    // Security headers
    app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      next();
    });

    // Configure express
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // API version prefix
    const API_PREFIX = `/api/${process.env.API_VERSION || "v1"}`;

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    });

    // Routes with versioning
    app.use(`${API_PREFIX}/players`, playerRoutes);
    app.use(`${API_PREFIX}/teams`, teamRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Error:", err);
      res.status(err.status || 500).json({
        message:
          process.env.NODE_ENV === "production"
            ? "Something went wrong!"
            : err.message,
        error: process.env.NODE_ENV === "production" ? {} : err,
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
}

startServer();
