import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  email: string | null;
};

export default function Navigation({ email }: Props) {
  const [open, setOpen] = useState(false);
  const navigateTo = useNavigate();

  const scrollTo = (destination: string) => {
    setOpen(false);
    document.querySelector(destination)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navigation ${open ? "navigation--open" : ""}`}>
      <button
        className="hamburger"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {open ? "✕" : "☰"}
      </button>
      <button className="scroll-button" onClick={() => scrollTo("#about")}>
        Learn more
      </button>
      {email ? null : (
        <button className="scroll-button" onClick={() => scrollTo("#signup")}>
          Sign up
        </button>
      )}
      <button
        className="scroll-button"
        onClick={() => scrollTo("#print-n-play")}
      >
        Print & Play
      </button>
      <button
        className="scroll-button"
        onClick={() => navigateTo("/how-to-play")}
      >
        How to Play
      </button>
    </nav>
  );
}
