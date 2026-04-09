import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { createComplaint,ComplaintsOfUserArea, ComplaintsVotedByUser, postFeedbacksOfUser, getComplaintCategories,ComplaintMadeByUser } from "../controller/complainant.controler.js";
import upload from "../utils/multer.js";
import rateLimit from "../middleware/rateLimit.js";
let router = express.Router();

router.post("/create-complaint",upload.array("files", 5),rateLimit, authenticateUser, createComplaint);
router.get("/complaint-made", authenticateUser, ComplaintMadeByUser);
router.get("/complaints-of-user-area", authenticateUser, ComplaintsOfUserArea);
router.get("/complaints-voted", authenticateUser, ComplaintsVotedByUser);
router.post("/feedback-posted", authenticateUser, postFeedbacksOfUser);
router.get("/complaint-categories", getComplaintCategories);

export default router;