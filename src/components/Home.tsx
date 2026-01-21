import "../styles.css";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SignUpSection from "./SignUpSection";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSignedIn(!!data.session);
  };

  useEffect(() => {
    getSession();
  });

  return (
    <div>
      <Header signedIn={signedIn} setSignedIn={setSignedIn} />
      <HeroSection />
      <AboutSection signedIn={signedIn} />
      {signedIn ? null : <SignUpSection />}
    </div>
  );
}
