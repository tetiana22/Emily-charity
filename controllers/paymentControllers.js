import dotenv from "dotenv";
dotenv.config();

import { gc } from "../app.js";

const createCheckout = async (req, res) => {
  const { amount } = req.body;

  try {
    const checkout = await gc.checkoutFlows.create({
      description: "Charity Donation",
      amount: amount * 100,
      currency: "GBP",
      redirect_uri: process.env.REDIRECT_URI,
    });

    res.json({ checkout_url: checkout.redirect_url });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).send("Error creating checkout");
  }
};

export default { createCheckout };
