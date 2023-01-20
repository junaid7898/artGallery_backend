require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {
  try {
    console.log("here...");
    const { name, email, amount } = req.body;
    if (!name || !email || !amount)
      return res
        .status(400)
        .json({ message: "name, email and amount is required" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "USD",
      payment_method_types: ["card"],
      metadata: {
        name,
        email,
        amount,
      },
    });

    const clientSecret = paymentIntent.client_secret;
    res.status(200).json({ message: "Payment Initiated", clientSecret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
