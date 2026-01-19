import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import Donation from "../model/donation.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, userId, successUrl, cancelUrl } = req.body;
    console.log("User received: ", userId);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `CityCare`,
              description: `Thank you for supporting CityCare! Your contribution helps us make a difference in the community.`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment
      success_url:
        successUrl ||
        `${process.env.ALLOWED_ORIGIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl || `${process.env.ALLOWED_ORIGIN}/payment-cancelled`,
      metadata: {
        userId: userId,
        purpose: "Donation",
      },
    });
    res.json({
      sessionId: session.id,
      url: session.url, // The URL to redirect user to
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
    );

    res.json({
      status: session.payment_status,
      amount: session.amount_total / 100, // Convert cents to dollars
      purpose: session.metadata.purpose,
      userId: session.metadata.userId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveDonation = async (req, res) => {
  try {
    const { userId, amount, sessionId } = req.body;

    let donationExists = await Donation.findOne({ sessionId });
    if (donationExists) {
      return res
        .status(400)
        .json({ message: "Donation with this sessionId already exists" });
    }

    const donation = await Donation.create({
      donorId: userId && userId.length > 0 ? userId : null,
      amount,
      sessionId,
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
