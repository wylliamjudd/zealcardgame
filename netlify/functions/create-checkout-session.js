const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Expect the client to send user_id (and maybe email) so the webhook can grant access.
  // You can also validate Supabase auth JWT here later if you want.
  const { email } = JSON.parse(event.body || "{}");
  if (!email) {
    return { statusCode: 400, body: "Missing user_id" };
  }

  const siteUrl = process.env.SITE_URL; // e.g. http://localhost:3000 or https://zealcardgame.com
  const priceId = process.env.STRIPE_PRICE_ID;

  // Stripe Checkout Session creation (server-side). :contentReference[oaicite:3]{index=3}
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/paid?session_id={CHECKOUT_SESSION_ID}`,
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
