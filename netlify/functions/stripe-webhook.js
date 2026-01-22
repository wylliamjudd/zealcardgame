import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripeEvent = stripe.webhooks.constructEvent(
    event.body,
    event.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  console.log("✅ Webhook received:", stripeEvent.type);

  return {
    statusCode: 200,
    body: "ok",
  };
}
