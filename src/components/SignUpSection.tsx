import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Loading from "./Loading";

export default function SignUpSection() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const onChangeEmail = (input: string) => setEmail(input.toLowerCase());

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);

    if (!email.includes("@")) {
      return alert("Please enter a valid email address.");
    }

    await supabase.from("emails").insert({ email, verified: false });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setSending(false);
      return alert(error);
    }

    setSending(false);
    alert("A link was sent to your email");
    setEmail("");
  };

  return (
    <div className="section-background">
      <img src="/Cnidarian-Lord.jpg" className="background-image" />
      <div className="signup-section">
        <h1>Sign up / Sign in</h1>
        <p>We'll send a link to your email that signs you up.</p>
        <p>If you're returning, the link will sign you in.</p>
        <p>
          By signing up you agree to receive occasional emails about Zeal’s
          development and launch.
        </p>
        <form className="email-form" onSubmit={submit}>
          <input
            className="email-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={event => onChangeEmail(event.target.value)}
          />
          <button className="email-button" type="submit" disabled={sending}>
            {sending ? <Loading /> : "Send link"}
          </button>
        </form>
      </div>
    </div>
  );
}
