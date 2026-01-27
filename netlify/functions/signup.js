import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: "Method Not Allowed",
    };
  }

  const { email } = JSON.parse(event.body || "{}");
  if (!email) {
    return {
      statusCode: 400,
      body: "Missing email",
    };
  }

  // 1) MailerLite: create / update subscriber
  await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });

  // 2) Supabase: send magic link
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.SITE_URL,
    },
  });

  if (error) {
    return {
      statusCode: 400,
      body: error.message,
    };
  }

  return {
    statusCode: 200,
    body: "ok",
  };
}
