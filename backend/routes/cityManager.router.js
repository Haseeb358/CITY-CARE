import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import { createTeam ,getTeams} from "../controller/cityManager.controler.js";

let router = express.Router();

router.post("/create-team", authenticateUser, authorizeRoles("cityManager","admin"), createTeam);

router.get("/get-teams", authenticateUser, authorizeRoles("cityManager","admin"), getTeams);


export default router;