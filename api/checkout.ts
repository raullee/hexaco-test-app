import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim());

const priceMap: Record<string, string> = {
  basic: process.env.HEXACO_BASIC_PRICE_ID || "",
  premium: process.env.HEXACO_PREMIUM_PRICE_ID || "",
  dual: process.env.HEXACO_DUAL_PRICE_ID || "",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { tier = "premium" } = req.body || {};
    const priceId = priceMap[tier];

    if (!priceId) {
      return res.status(400).json({ error: `Invalid tier: ${tier}` });
    }

    const origin = req.headers.origin || "https://hexaco-test-app.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/?paid=true&tier=${tier}`,
      cancel_url: `${origin}/?cancelled=true`,
      metadata: { tier },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: error.message });
  }
}
