import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.modles.js";
import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/api-response.js";
import { apiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { availableRole, userRole } from "../utils/constants.js";

// get the projects
const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id), // current user
      },
    },
    {
      $lookup: {
        from: "projects", // join projects collection
        localField: "projects", // project ids
        foreignField: "_id", // project primary key
        as: "projects", // store matched projects
        pipeline: [
          {
            $lookup: {
              from: "projectmembers", // join members collection
              localField: "_id", // project id
              foreignField: "projects", // project reference
              as: "projectmembers", // matched members
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers", // count members
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$projects",
    },
    {
      // show selected data only
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  //   success response
  return res
    .status(200)
    .json(new apiResponse(200, projects, "Projects data fetched"));
});

// get project by Id
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  //   find the project using project id
  const project = await Project.findById(projectId);

  //   handle project not found error
  if (!project) {
    return res.status(404).json(new apiResponse(404, {}, "Project not found "));
  }

  //   success response
  return res
    .status(200)
    .json(new apiResponse(200, project, "Projects data fetched"));
});

// create project
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  let project = null;
  try {
    //   Create the project
    project = await Project.create({
      name,
      description,
      createdBy: new mongoose.Types.ObjectId(req.user._id),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json(new apiResponse(409, {}, "Project is already exists"));
    }
    return res.status(500).json(new apiResponse(500, {}, "Unexpected error"));
  }

  //   Update the project member data
  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: userRole.ADMIN,
  });

  //   response back to frontend
  return res
    .status(201)
    .json(new apiResponse(201, project, "Project Created Successfully"));
});

// update project
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  //   update the project data
  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    {
      new: true,
    },
  );

  //   handle project not found error
  if (!project) {
    return res.status(404).json(new apiResponse(404, {}, "Project Not Found"));
  }

  //   success response
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Project updated successfully"));
});

// delete project
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  //   find the project and delete
  const project = await Project.findByIdAndDelete(projectId);

  //   handle error if project not found
  if (!project) {
    return res.status(404).json(new apiResponse(404, {}, "Project not found"));
  }

  //   success response
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Project deleted successfully"));
});

// add project memeber
const addProjectMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  //   find user using email
  const user = await User.findOne({ email });

  //   handle user not found error
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "User does not exists"));
  }

  //   find the user with project if exists update it and if not then create new
  const project = await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true, //return the updated data
      upsert: true, // create new document if none of these exist
    },
  );

  //   success response
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Project member added successfully"));
});

// get project members
const getProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(req.params.projectId);
  //   handle user not found error
  if (!project) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "User does not exists"));
  }

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  //   success response
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        projectMembers,
        "Project member fetched successfully",
      ),
    );
});

// Update the project member role
const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  // Check if role is valid
  if (!availableRole.includes(newRole)) {
    return res.status(400).json(new apiResponse(400, {}, "Invalid Role"));
  }

  // Find project member by project id and user id
  const projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  // Handle member not found
  if (!projectMember) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "Project member not found"));
  }

  // Update member role
  const updatedProjectMember = await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    {
      role: newRole,
    },
    {
      new: true,
    },
  );

  // Handle update failure
  if (!updatedProjectMember) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "Project member not found"));
  }

  // Success response
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        updatedProjectMember,
        "Project member role updated successfully",
      ),
    );
});

// delete the project memeber
const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  //   find the project memeber using project id and user id
  const projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  //   handle error if project member is not found
  if (!projectMember) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "Project member not found"));
  }

  const deleteProjectMember = await ProjectMember.findByIdAndDelete(
    projectMember._id,
  );

  if (!deleteProjectMember) {
    return res
      .status(404)
      .json(new apiResponse(404, {}, "Project member not found"));
  }

  // success response
  return res
    .status(200)
    .json(new apiResponse(200, "Project member deleted successfully"));
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMember,
  updateMemberRole,
  deleteMember,
};
