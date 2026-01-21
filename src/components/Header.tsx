import { supabase } from "../lib/supabaseClient";

type Props = {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
};

export default function Header({ signedIn, setSignedIn }: Props) {
  const scrollDown = () => {
    document
      .querySelector(".signup-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const signOut = async () => await supabase.auth.signOut();

  if (signedIn) {
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
