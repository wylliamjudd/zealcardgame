export default function Navigation() {
  const scrollTo = (destination: string) => {
    document.querySelector(destination)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navigation">
      <button className="scroll-button" onClick={() => scrollTo("#about")}>
        Learn more
      </button>
      <button className="scroll-button" onClick={() => scrollTo("#signup")}>
        Sign up
      </button>
      <button
        className="scroll-button"
        onClick={() => scrollTo("#print-n-play")}
      >
        Print & Play
      </button>
    </nav>
  );
}
