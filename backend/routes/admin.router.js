import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import {createCity} from "../controller/admin.controler.js";
import { complaintCategories,getAllUsers, createEmployeeRecord } from "../controller/admin.controler.js";

let router = express.Router();

router.post("/create-city", authenticateUser, authorizeRoles("admin"), createCity);
router.post("/complaint-categories", authenticateUser, authorizeRoles("admin"), complaintCategories);
router.get("/get-all-users", authenticateUser,authorizeRoles("admin"),  getAllUsers);
router.post("/create-employee",authenticateUser,authorizeRoles("admin"), createEmployeeRecord);


export default router;