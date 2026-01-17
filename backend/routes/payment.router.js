import express from "express";
import { createCheckoutSession, saveDonation, verifyPayment } from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);

// ✅ VERIFY PAYMENT (After user returns from Stripe)
router.get("/verify-payment/:sessionId", verifyPayment);

router.post("/save", saveDonation);

export default router;
