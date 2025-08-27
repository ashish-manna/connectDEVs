const express = require("express");
const userAuth = require("../middleware/userAuth");
const paymentRouter = express.Router();

paymentRouter.post(
  "/payment/stripe/create-checkout-session",
  userAuth,
  async (req, res) => {
    try {
      const price = 500;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Buy me a Chai ☕",
                description: "Just for testing — no real money deducted.",
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/chai/success`,
        cancel_url: `${process.env.CLIENT_URL}/chai/cancel`,

        metadata: {
          origin: "chai_support",
          developer: "Bidyut",
        },
      });
      res.json({ id: session.id, url: session.url });
    } catch (err) {
      res.status(401).json({ message: err });
    }
  }
);

module.exports = paymentRouter;
