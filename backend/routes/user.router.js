import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { registerUser,getUserProfile, verifyOtp, loginUser, getAllUsers,createEmployeeRecord,assignLoginToEmployee ,logOutUser,changeUserPassword,forgotPassword,resetUserPassword,checkLoginStatus,updateUserProfile,ComplaintMadeByUser,ComplaintsOfUserArea,ComplaintsVotedByUser,postFeedbacksOfUser} from "../controller/user.controler.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login-user", loginUser);
router.get("/get-all-users", authenticateUser,authorizeRoles("admin"),  getAllUsers);
router.post("/create-employee",authenticateUser,authorizeRoles("admin"), createEmployeeRecord);
router.post("/assign-login/:employeeId", assignLoginToEmployee);
router.post("/logout", authenticateUser, logOutUser);
router.post("/change-password", authenticateUser, changeUserPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetUserPassword);
router.get("/check-login",  checkLoginStatus);
router.get("/profile", authenticateUser, getUserProfile);
router.put("/update-profile", authenticateUser, updateUserProfile);
router.get("/complaint-made", authenticateUser, ComplaintMadeByUser);
router.get("/complaints-of-user-area", authenticateUser, ComplaintsOfUserArea);
router.get("/complaints-voted", authenticateUser, ComplaintsVotedByUser);
router.post("/feedback-posted", authenticateUser, postFeedbacksOfUser);
export default router;
