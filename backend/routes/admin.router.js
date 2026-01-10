import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import {createCity} from "../controller/admin.controler.js";

let router = express.Router();

router.post("/create-city", authenticateUser, authorizeRoles("admin"), createCity);


export default router;