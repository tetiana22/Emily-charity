const createCheckout = async (req, res) => {
  const { amount, redirect_uri } = req.body;

  try {
    const billingRequest = await gc.billingRequests.create({
      mandate_request: {
        scheme: "bacs",
      },
      amount: amount * 100, // Сума в пенсах
      currency: "GBP",
      description: "Charity Donation",
      links: {
        customer: "CU00016WDAM7BS", // Вставте правильний ID клієнта
      },
    });

    const billingRequestFlow = await gc.billingRequestFlows.create({
      redirect_uri: redirect_uri || process.env.GC_REDIRECT_URI,
      exit_uri: "https://www.emily_charity.com/exit",
      links: {
        billing_request: billingRequest.id,
      },
    });

    res.json({ checkout_url: billingRequestFlow.authorisation_url });
  } catch (error) {
    console.error(
      "Error creating checkout:",
      error.response ? error.response.body : error
    );
    res.status(500).send("Error creating checkout");
  }
};

export default { createCheckout };
