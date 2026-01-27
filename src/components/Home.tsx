import "../styles.css";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SignUpSection from "./SignUpSection";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Header from "./Header";
import PaymentSection from "./PaymentSection";
import PrintNPlaySection from "./PrintNPlaySection";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [entitled, setEntitled] = useState(false);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();

    const session_email = data.session?.user.email;

    if (session_email) {
      const { data: session_data } = await supabase
        .from("emails")
        .select("stripe_session_id")
        .eq("email", session_email)
        .single();

      setEntitled(!!session_data?.stripe_session_id);
    }

    setEmail(session_email || null);
  };

  useEffect(() => {
    getSession();
  });

  return (
    <div>
      <Header email={email} setEmail={setEmail} />
      <HeroSection />
      <AboutSection email={email} />
      {email ? (
        entitled ? (
          <PrintNPlaySection />
        ) : (
          <PaymentSection email={email} />
        )
      ) : (
        <SignUpSection />
      )}
    </div>
  );
}
