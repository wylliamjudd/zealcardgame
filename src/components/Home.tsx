import "../styles.css";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SignUpSection from "./SignUpSection";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Header from "./Header";
import PrintNPlaySection from "./PrintNPlaySection";
import Navigation from "./Navigation";
import CommunitySection from "./CommunitySection";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();

    setEmail(data.session?.user.email || null);
  };

  useEffect(() => {
    getSession();
    const { hash } = window.location;
    if (hash) document.querySelector(hash)?.scrollIntoView();
  }, []);

  return (
    <div>
      <Header email={email} setEmail={setEmail} />
      <HeroSection />
      <AboutSection />
      {email ? null : <SignUpSection />}
      <PrintNPlaySection email={email} />
      <Navigation email={email} />
      <CommunitySection />
      <div className="bottom-buffer" />
    </div>
  );
}
