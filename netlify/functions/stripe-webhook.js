const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use Node 18+ built-in fetch
exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  if (!sig) return { statusCode: 400, body: "Missing Stripe-Signature" };

  let stripeEvent;
  try {
    // Stripe signature verification requires the raw body. :contentReference[oaicite:7]{index=7}
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    const userId = session?.metadata?.supabase_user_id;
    if (userId) {
      // Mark user as paid in Supabase:
      // update emails set print_and_play=true where user_id = userId
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      const res = await fetch(
        `${supabaseUrl}/rest/v1/emails?user_id=eq.${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            print_and_play: true,
            print_and_play_at: new Date().toISOString(),
          }),
        },
      );

      if (!res.ok) {
        const txt = await res.text();
        return { statusCode: 500, body: `Supabase update failed: ${txt}` };
      }
    }
  }

  return { statusCode: 200, body: "ok" };
};
