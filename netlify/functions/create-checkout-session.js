import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { email } = JSON.parse(event.body || "{}");
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing email" }),
    };
  }

  const siteUrl = process.env.SITE_URL;
  const priceId = process.env.STRIPE_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/#print-n-play`,
    cancel_url: `${siteUrl}/`,
    customer_email: email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
}
