import express from "express";
import cors from "cors";

// This is Express middleware configuration used to handle incoming request data formats.
const app = express();

// parses incoming JSON requests and limits payload size to 16KB
app.use(express.json({ limit: "16kb" }));

// Parses URL-encoded form data, supports nested objects, and limits request body size to 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from public folder
app.use(express.static("./public"));

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https;//localhost:5500", //defines which frontend url are allowed to access the backend API.
    credentials: true, // include cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // define HTTP methods allowed when accessing the API routes.
    allowedHeaders: ["Content-Type", "Authorization"], //define the type of header are allowed
  }),
);

export default app;
