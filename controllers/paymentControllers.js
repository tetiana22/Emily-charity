import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.PAYPAL_API_URL;

const GO_CARDLESS_API_URL = process.env.GO_CARDLESS_API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const GC_VERSION = process.env.GC_VERSION;

// Кешування токенів
let cachedPayPalToken = null;
let tokenExpirationTime = null;

async function getPayPalAccessToken() {
  const now = Date.now();
  if (cachedPayPalToken && tokenExpirationTime && now < tokenExpirationTime) {
    return cachedPayPalToken;
  }

  const response = await axios.post(
    `${PAYPAL_API_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedPayPalToken = response.data.access_token;
  tokenExpirationTime = now + response.data.expires_in * 1000;

  return cachedPayPalToken;
}

export async function createPayPalOrder(req, res) {
  try {
    const { amount, currency = "USD" } = req.body;
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ error: "Invalid amount value" });
    }
    const formattedAmount = amountValue.toFixed(2);
    const accessToken = await getPayPalAccessToken();
    const orderResponse = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: formattedAmount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(201).json(orderResponse.data);
  } catch (error) {
    console.error(
      "Error creating PayPal order:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.response ? error.response.data : error.message });
  }
}

export async function createGoCardlessBillingRequest(req, res) {
  try {
    const {
      email,
      given_name,
      family_name,
      amount,
      currency = "GBP",
      description = "Donation",
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
          given_name: given_name,
          family_name: family_name || "",
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
            amount: amountInSubunits,
            currency: currency,
            description: description,
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
}

export async function createGoCardlessBillingRequestFlow(req, res) {
  try {
    const { billingRequestId } = req.body;
    const billingRequestFlowResponse = await axios.post(
      `${GO_CARDLESS_API_URL}/billing_request_flows`,
      {
        billing_request_flows: {
          redirect_uri: "https://your-redirect-uri.com",
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
}
