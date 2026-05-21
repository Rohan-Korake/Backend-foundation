// User Role in object form
export const userRole = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

// Available Role in the array form
export const availableRole = Object.values(userRole);

// Task status in object form
export const taskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

// Task status in the array form
export const availableTaskStatus = Object.values(taskStatus);
