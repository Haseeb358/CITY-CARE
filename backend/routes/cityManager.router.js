import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { createTeam ,getTeams,getCMComplaints, getComplaintHistory,getALLTeams,getNearbyZones, getTeamsByZone, assignTeam,getTeamsForCityManager,getEligibleEmployees , createNewTeam,getZonesForCity, updateTeam} from "../controller/cityManager.controler.js";

let router = express.Router();

router.post("/create-team", authenticateUser, authorizeRoles("cityManager", "admin"), createTeam);

router.get("/get-teams", authenticateUser, authorizeRoles("cityManager", "admin"), getTeams);
router.get("/complaints", authenticateUser, authorizeRoles("cityManager", "admin"), getCMComplaints);
router.get("/complaints/:id/history", authenticateUser, authorizeRoles("cityManager", "admin"), getComplaintHistory);
router.get("/teams", authenticateUser, authorizeRoles("cityManager", "admin"), getTeams);
// GET /api/cityManager/complaints/:id/nearby-zones
router.get("/complaints/:id/nearby-zones", authenticateUser, authorizeRoles("cityManager", "admin"), getNearbyZones);
// GET /api/cityManager/zones/:zoneId/teams
router.get("/zones/:zoneId/teams", authenticateUser, authorizeRoles("cityManager", "admin"), getTeamsByZone);
router.post("/complaints/:id/assign", authenticateUser, authorizeRoles("cityManager", "admin"), assignTeam);
router.get("/city/teams", authenticateUser, authorizeRoles("cityManager"), getTeamsForCityManager);
router.get("/employees/eligible", authenticateUser, authorizeRoles("cityManager"), getEligibleEmployees);
router.post("/createTeam", authenticateUser, authorizeRoles("cityManager"), createNewTeam);
router.get("/teamzones", authenticateUser, authorizeRoles("cityManager"), getZonesForCity);
router.put("/teams/:id", authenticateUser, authorizeRoles("cityManager"), updateTeam);
export default router;