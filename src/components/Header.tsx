import { supabase } from "../lib/supabaseClient";

type Props = {
  email: string | null;
  setEmail: (email: string | null) => void;
};

export default function Header({ email, setEmail }: Props) {
  const scrollDown = () => {
    document.querySelector("#signup")?.scrollIntoView({ behavior: "smooth" });
  };

  const signOut = async () => {
    setEmail(null);
    await supabase.auth.signOut();
  };

  if (email) {
    return (
      <a className="header" onClick={signOut}>
        Sign out
      </a>
    );
  }

  return (
    <a className="header" onClick={scrollDown}>
      Sign in
    </a>
  );
}
