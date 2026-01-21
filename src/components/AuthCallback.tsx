import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const authorize = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user.email;

      if (email) {
        await supabase.from("emails").upsert({
          email,
          verified: true,
        });
      }

      navigate("/", { replace: true });
    };

    authorize();
  });

  return <div>Signing you in...</div>;
}
