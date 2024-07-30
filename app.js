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

const PAYPAL_CLIENT_ID =
  "Ad1v6KDtCeyrLmHGIPU1kdlPabxyyM80DFHI54V6xT4Tgt7QpT6HEivRDiurQgyASH0qB6STVLdKPVKw";
const PAYPAL_CLIENT_SECRET =
  "Ad1v6KDtCeyrLmHGIPU1kdlPabxyyM80DFHI54V6xT4Tgt7QpT6HEivRDiurQgyASH0qB6STVLdKPVKw";
const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

const generatePayPalToken = async (req, res, next) => {
  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios({
      url: `${PAYPAL_API_URL}/v1/oauth2/token`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      data: "grant_type=client_credentials",
    });

    req.paypalToken = response.data.access_token;
    next();
  } catch (error) {
    console.error(
      "Error generating PayPal token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error generating PayPal token" });
  }
};

app.post("/create-payment", generatePayPalToken, async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
        brand_name: "Your Brand",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      },
    };

    const response = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${req.paypalToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error(
      "Error creating PayPal payment:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

app.post("/execute-payment", generatePayPalToken, async (req, res) => {
  const { paymentID, payerID } = req.body;

  try {
    const response = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paymentID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${req.paypalToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error executing PayPal payment:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

// GoCardless Integration (left unchanged)
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
      description = "Donation", // Додано поле description з дефолтним значенням
    } = req.body;

    const amountInSubunits = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInSubunits) || amountInSubunits <= 0) {
      throw new Error("Invalid amount value");
    }

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

    const billingRequestResponse = await axios.post(
      `${GO_CARDLESS_API_URL}/billing_requests`,
      {
        billing_requests: {
          payment_request: {
            amount: amountInSubunits, // використовуємо amountInSubunits
            currency: currency,
            description: description, // Додано поле description
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

app.post("/create-billing-request-flow", async (req, res) => {
  try {
    const { billingRequestId } = req.body;

    const billingRequestFlowResponse = await axios.post(
      `${GO_CARDLESS_API_URL}/billing_request_flows`,
      {
        billing_request_flows: {
          redirect_uri: "https://www.emily_charity.com/callback",
          exit_uri: "https://www.emily_charity.com/exit",
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
