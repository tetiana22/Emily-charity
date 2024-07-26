import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const GO_CARDLESS_API_URL = "https://api-sandbox.gocardless.com"; // Sandbox API URL
const ACCESS_TOKEN = "sandbox_QbpEJylc3XRJ4iE8qe1axWfIGQ4k_H_bxfs3lkQt";
const GC_VERSION = "2015-07-06"; // Ensure the API version is up to date

app.post("/create-billing-request", async (req, res) => {
  try {
    const {
      email,
      given_name,
      family_name,
      amount,
      currency = "GBP",
    } = req.body;

    // Переконайтеся, що amount є числом і помножте на 100 для переведення в субодиниці валюти
    const amountInSubunits = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountInSubunits) || amountInSubunits <= 0) {
      throw new Error("Invalid amount value");
    }

    // Create Customer
    const customerResponse = await axios.post(
      `${GO_CARDLESS_API_URL}/customers`,
      {
        customers: {
          email: email,
          given_name: given_name, // Directly using given_name
          family_name: family_name || "", // Directly using family_name
          country_code: "GB",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "GoCardless-Version": GC_VERSION,
        },
      }
    );

    const customerId = customerResponse.data.customers.id;

    // Create Billing Request
    const billingRequestResponse = await axios.post(
      `${GO_CARDLESS_API_URL}/billing_requests`,
      {
        billing_requests: {
          payment_request: {
            amount: amountInSubunits, // використовуємо amountInSubunits
            currency: currency,
          },
          mandate_request: {
            scheme: "bacs",
            currency: currency,
          },
          links: {
            customer: customerId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "GoCardless-Version": GC_VERSION,
        },
      }
    );

    res.status(201).json(billingRequestResponse.data);
  } catch (error) {
    console.error(
      "Error creating billing request:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

// Additional endpoint for creating Billing Request Flow
app.post("/create-billing-request-flow", async (req, res) => {
  try {
    const { billingRequestId } = req.body;

    // Create Billing Request Flow
    const billingRequestFlowResponse = await axios.post(
      `${GO_CARDLESS_API_URL}/billing_request_flows`,
      {
        billing_request_flows: {
          redirect_uri: "https://my-company.com/landing",
          exit_uri: "https://my-company.com/exit",
          show_bank_selector: true, // Ensure the bank selector is shown
          links: {
            billing_request: billingRequestId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "GoCardless-Version": GC_VERSION,
        },
      }
    );

    res.status(201).json(billingRequestFlowResponse.data);
  } catch (error) {
    console.error(
      "Error creating billing request flow:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

export default app;
