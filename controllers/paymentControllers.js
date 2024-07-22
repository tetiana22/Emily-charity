import dotenv from "dotenv";
dotenv.config();

import { gc } from "../app.js";

const createCustomer = async (req, res) => {
  try {
    const customer = await gc.customers.create({
      given_name: req.body.given_name,
      family_name: req.body.family_name,
      email: req.body.email,
      address_line1: req.body.address_line1,
      city: req.body.city,
      postal_code: req.body.postal_code,
      country_code: "GB",
    });
    console.log("Customer created:", customer);
    res.status(201).send(customer);
  } catch (error) {
    console.error(
      "Error creating customer:",
      error.response ? error.response.body : error.message
    );
    res.status(400).send({ error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const mandate = await gc.mandates.create({
      links: { customer_bank_account: req.body.customer_bank_account_id },
      scheme: "bacs",
    });

    const payment = await gc.payments.create({
      amount: req.body.amount,
      currency: "GBP",
      links: { mandate: mandate.id },
    });

    res.status(201).send(payment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const createCheckout = async (req, res) => {
  const { amount } = req.body;

  try {
    const checkout = await gc.checkoutFlows.create({
      description: "Charity Donation",
      amount: amount * 100, // GoCardless expects amount in pence
      currency: "GBP",
      redirect_uri: process.env.REDIRECT_URI,
      prefill_customer: {
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
      },
    });

    res.json({ checkout_url: checkout.redirect_url });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).send("Error creating checkout");
  }
};

export default { createCustomer, createPayment, createCheckout };
