import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { getTeamsForTeamLead,getComplaintsForTeamLead,getComplaintWithHistory,updateComplaintStatus,getTeamPerformance, getComplaintTrend, getDashboardSummary  } from "../controller/TeamLead.controler.js";
import upload from "../utils/multer.js";

let router = express.Router();
router.get("/get-teams", authenticateUser, authorizeRoles("teamLead","admin"), getTeamsForTeamLead);
router.get("/complaints", authenticateUser, authorizeRoles("teamLead","admin"), getComplaintsForTeamLead);
router.get("/complaints/:id", authenticateUser, authorizeRoles("teamLead","admin"), getComplaintWithHistory);
router.put("/complaints/:id", upload.array("files"), authenticateUser, authorizeRoles("teamLead","admin"), updateComplaintStatus);
router.get("/dashboard",
  authenticateUser,
  authorizeRoles("teamLead"),
  getDashboardSummary
);

router.get("/team-performance",
  authenticateUser,
  authorizeRoles("teamLead"),
  getTeamPerformance
);

router.get("/trend",
  authenticateUser,
  authorizeRoles("teamLead"),
  getComplaintTrend
);

export default router;
