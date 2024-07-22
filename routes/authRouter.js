import express from "express";
import axios from "axios";
import { URLSearchParams } from "url";

const router = express.Router();

router.get("/auth", (req, res) => {
  const authUrl =
    `https://verify-sandbox.gocardless.com/oauth/authorize?` +
    `client_id=${process.env.GC_CLIENT_ID}&` +
    `redirect_uri=${process.env.GC_REDIRECT_URI}&` +
    `scope=read_write&` +
    `response_type=code`;
  res.redirect(authUrl); // Додано перенаправлення на authUrl
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      `${process.env.GC_API_URL}/oauth/token`,
      new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GC_REDIRECT_URI,
        client_id: process.env.GC_CLIENT_ID,
        client_secret: process.env.GC_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;

    console.log("Access Token:", access_token);

    // Оновіть вашу конфігурацію GoCardless (можливо, збережіть у базі даних)
    process.env.GC_ACCESS_TOKEN = access_token;

    res.redirect("/onboarding-complete"); // Направлення після завершення авторизації
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
