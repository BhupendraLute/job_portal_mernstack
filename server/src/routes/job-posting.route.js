import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { applyJob, createJobPost, getAllJobPosts, getApplicationsByJobId, getJobPost, getJobPostsByEmployer, removeJobPost, searchJobPosts, updateJobApplicationStatus, updateJobPost } from "../controllers/job-posting.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/create').post(verifyJWT, createJobPost)
router.route('/update/:id').patch(verifyJWT, updateJobPost)
router.route('/get/:id').get(verifyJWT, getJobPost)
router.route('/get-all').get(getAllJobPosts)
router.route('/get-my-posts').get(verifyJWT, getJobPostsByEmployer)
router.route('/search').get(searchJobPosts)
router.route("/applications/:id").get(verifyJWT, getApplicationsByJobId)
router.route('/delete/:id').delete(verifyJWT, removeJobPost)
router.route('/apply/:id').post(verifyJWT, applyJob)
router.route('/update-job-status/:id').patch(verifyJWT, updateJobApplicationStatus)

export default router