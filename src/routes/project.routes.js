import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMember,
  updateMemberRole,
  deleteMember,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createProjectValidator,
  addMemberToProjectValidator,
} from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validateProjectPermission } from "../middlewares/auth.middlewares.js";
import { availableRole, userRole } from "../utils/constants.js";

const router = Router();

// Protect all routes below this middleware
router.use(verifyJWT);

// Project routes
router
  .route("/")
  .get(getProjects) // Get all projects of logged-in user
  .post(createProjectValidator(), validate, createProject); // Validate project data and Create new project

// Single project routes
router
  .route("/:projectId")
  .get(validateProjectPermission(availableRole), getProjectById) // Check project access
  .put(
    validateProjectPermission([userRole.ADMIN]), // Only admin can update
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validateProjectPermission([userRole.ADMIN]), deleteProject); // Only admin can delete

// Project member routes
router
  .route("/:projectId/members")
  .get(getProjectMember) // Get all project members
  .post(
    validateProjectPermission([userRole.ADMIN]), // Only admin can add members
    addMemberToProjectValidator(),
    validate,
    addProjectMember,
  );

// Specific member routes
router
  .route("/:projectId/members/:userId")
  .put(
    validateProjectPermission([userRole.ADMIN]), // Only admin can update member role
    validate,
    updateMemberRole,
  )
  .delete(validateProjectPermission([userRole.ADMIN]), deleteMember); // Only admin can remove member

export default router;
