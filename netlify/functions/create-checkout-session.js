import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email } = JSON.parse(event.body || "{}");
  if (!email) {
    return { statusCode: 400, body: "Missing email" };
  }

  console.log(email);

  const siteUrl = process.env.SITE_URL;
  const priceId = process.env.STRIPE_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/`,
    cancel_url: `${siteUrl}/`,
    metadata: {
      email,
    },
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: session.url }),
  };
};
