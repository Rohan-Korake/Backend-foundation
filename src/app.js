import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// This is Express middleware configuration used to handle incoming request data formats.
const app = express();

// parses incoming JSON requests and limits payload size to 16KB
app.use(express.json({ limit: "16kb" }));

// Parses URL-encoded form data, supports nested objects, and limits request body size to 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from public folder
app.use(express.static("./public"));
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https;//localhost:5000", //defines which frontend url are allowed to access the backend API.
    credentials: true, // include cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // define HTTP methods allowed when accessing the API routes.
    allowedHeaders: ["Content-Type", "Authorization"], //define the type of header are allowed
  }),
);

// Mount auth routes
import authRouter from "./routes/auth.routes.js";
app.use("/auth", authRouter);

// Mount health check route
import healthCheckRoute from "./routes/healthcheck.routes.js";
app.use("/healthcheck", healthCheckRoute);

// Default route for root URL
app.use("/", (req, res) => {
  res.send("This is '/' route response");
});

export default app;
