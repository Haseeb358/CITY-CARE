import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import {createCity} from "../controller/admin.controler.js";
import { complaintCategories,getAllUsers, createEmployeeRecord , updateEmployeeRecord, deleteEmployeeRecord, getAdminAnalytics, generateReport, getFilterOptions } from "../controller/admin.controler.js";

let router = express.Router();

router.post("/create-city", authenticateUser, authorizeRoles("admin"), createCity);
router.post("/complaint-categories", authenticateUser, authorizeRoles("admin"), complaintCategories);
router.get("/get-all-users", authenticateUser,authorizeRoles("admin"),  getAllUsers);
router.post("/create-employee",authenticateUser,authorizeRoles("admin"), createEmployeeRecord);
router.put("/update-employee/:id",authenticateUser,authorizeRoles("admin"), updateEmployeeRecord);
router.delete("/delete-employee/:id", authenticateUser, authorizeRoles("admin"), deleteEmployeeRecord);
router.get("/analytics", authenticateUser, authorizeRoles("admin"), getAdminAnalytics);
router.get("/generate-report", authenticateUser, authorizeRoles("admin"), generateReport);
router.get("/filter-options", authenticateUser, authorizeRoles("admin"), getFilterOptions);

export default router;