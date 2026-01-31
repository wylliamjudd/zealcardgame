import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Loading from "./Loading";

type Props = {
  email: string | null;
};

export default function PrintNPlaySection({ email }: Props) {
  const [loading, setLoading] = useState(false);
  const [entitled, setEntitled] = useState(false);

  const getSession = async () => {
    const { data: session_data } = await supabase
      .from("emails")
      .select("stripe_session_id")
      .eq("email", email)
      .single();

    setEntitled(!!session_data?.stripe_session_id);
  };

  useEffect(() => {
    if (email) getSession();
  }, [email]);

  async function startCheckout() {
    setLoading(true);

    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      },
    );
    if (response.ok) {
      const { url } = await response.json();
      window.location.assign(url);
    }

    setLoading(false);
  }

  const scroll = () => {
    document.querySelector("#signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="section-background">
      <img src="Priestess-of-the-Moon.jpg" className="background-image" />
      <section id="print-n-play">
        <h1>Zeal: Print & Play Edition</h1>
        <p>This is the complete Print & Play version of Zeal.</p>
        <p>
          You’ll receive all game components needed to play, formatted for home
          printing. Card graphics are simplified to save ink, and some cards use
          placeholder art or non-final artwork.
        </p>
        <p>
          Instead of physical devotion dials, this edition includes printable
          devotion trackers. You’ll need simple markers (coins, paperclips,
          etc.) to use them.
        </p>
        <p>Gameplay is fully intact. This edition is about function first.</p>
        <p />
        {email ? (
          entitled ? (
            <a className="email-button" href="/Zeal Print & Play.zip" download>
              Download
            </a>
          ) : (
            <button
              className="email-button"
              onClick={startCheckout}
              disabled={loading}
            >
              {loading ? <Loading /> : "Get Print & Play for $1"}
            </button>
          )
        ) : (
          <button className="email-button" onClick={scroll}>
            Sign up to unlock Print & Play
          </button>
        )}
      </section>
    </div>
  );
}
