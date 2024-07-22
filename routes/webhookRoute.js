import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post("/webhook", (req, res) => {
  const signature = req.headers["x-gocardless-signature"];
  const webhookSecret = process.env.GC_WEBHOOK_SECRET;

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(req.rawBody);
  const digest = hmac.digest("base64");

  if (digest !== signature) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  console.log("Received webhook event:", event);

  res.sendStatus(200);
});

export default router;
