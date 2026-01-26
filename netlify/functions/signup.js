import MailerLite from "@mailerlite/mailerlite-nodejs";
import { createClient } from "@supabase/supabase-js";

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

export async function handler(event) {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  const { email } = JSON.parse(event.body || "{}");
  if (!email) return { statusCode: 400, body: "Missing email" };

  await mailerlite.subscribers.createOrUpdate({ email });

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.SITE_URL,
    },
  });

  if (error) return { statusCode: 400, body: error.message };

  return {
    statusCode: 200,
    body: "ok",
  };
}
