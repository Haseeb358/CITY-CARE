import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { createComplaint } from "../controller/complainant.controler.js";
import upload from "../utils/multer.js";
let router = express.Router();

router.post("/create-complaint",upload.single("file"), authenticateUser, createComplaint);


export default router;