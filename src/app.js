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

app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(cookieParser());

// Mount routes
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
app.use("/auth", authRouter);
app.use("/projects", projectRouter);

// Mount health check route
import healthCheckRoute from "./routes/healthcheck.routes.js";
import { apiResponse } from "./utils/api-response.js";
app.use("/healthcheck", healthCheckRoute);

// handle 4O4
app.use((req, res) => {
  res.status(404).json(new apiResponse(404, {}, "4O4 not found"));
});

export default app;
