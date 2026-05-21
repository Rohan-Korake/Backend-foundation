import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controllers.js";

// Define health check GET route
const router = Router();
router.route("/").get(healthCheck);

export default router;
