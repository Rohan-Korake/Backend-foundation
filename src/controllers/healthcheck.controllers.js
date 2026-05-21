import { apiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new apiResponse(200, { message: "Server is running.." }));
});

export { healthCheck };
