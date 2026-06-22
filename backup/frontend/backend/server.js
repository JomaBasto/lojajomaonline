import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${item.name} (Tamanho ${item.size})`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
    success_url: "http://localhost:5173/success",
cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro Stripe" });
  }
});

app.listen(4242, () => {
  console.log("Backend running on http://localhost:4242");
});