import Stripe from "stripe";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { data, type } = stripe.webhooks.constructEvent(
    event.body,
    event.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  if (type === "checkout.session.completed") {
    const { id, customer_email } = data.object;
    await supabase.from("emails").upsert(
      {
        email: customer_email,
        stripe_session_id: id,
      },
      {
        onConflict: "email",
      },
    );
  }

  return {
    statusCode: 200,
    body: "ok",
  };
}
