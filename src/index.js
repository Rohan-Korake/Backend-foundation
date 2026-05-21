// Load environment variables from .env file
import dotenv from "dotenv";
import app from "./app.js";

// Look for .env file in current project root folder
dotenv.config({
  path: "./.env",
});

// Set server port from environment or use default
const port = process.env.PORT || 6000;

// Start the Express server
app.listen(port, () => {
  console.log(`Listening port http://localhost:${port}`);
});
