// Load environment variables from .env file
import dotenv from "dotenv";
import app from "./app.js";
import connectMongoDB from "./db/database.js";

// Look for .env file in current project root folder
dotenv.config({
  path: "./.env",
});

// Set server port from environment or use default
const port = process.env.PORT || 5500;

// connect mongoDB then listen port
connectMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error");
  });
