import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";

let router = express.Router();




export default router;