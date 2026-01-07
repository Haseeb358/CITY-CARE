import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { registerUser, verifyOtp, loginUser, getAllUsers,createEmployeeRecord,assignLoginToEmployee ,logOutUser} from "../controller/user.controler.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login-user", loginUser);
router.get("/get-all-users", authenticateUser,authorizeRoles("admin"),  getAllUsers);
router.post("/create-employee",authenticateUser,authorizeRoles("admin"), createEmployeeRecord);
router.post("/assign-login/:employeeId", assignLoginToEmployee);
router.post("/logout", authenticateUser, logOutUser);


export default router;
