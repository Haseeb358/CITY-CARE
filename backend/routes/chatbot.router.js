import express from "express";
import { chatWithBot } from "../controller/chatbot.controller.js";

let router = express.Router();

router.post("/", chatWithBot);

export default router;
