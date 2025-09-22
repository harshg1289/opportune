import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAllJobs, getJobById, getJobByLoggedAdminUser, postJob } from "../controllers/job.controller.js";
 
const router = express.Router();

// Protected routes (require authentication)
router.route("/postjob").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getJobByLoggedAdminUser);

// Public routes (no authentication required)
router.route("/all").get(getAllJobs);  // Remove isAuthenticated
router.route("/:id").get(getJobById);  // Remove isAuthenticated

export default router;