type Props = {
  email: string | null;
};

export default function AboutSection({ email }: Props) {
  const scrollDown = () => {
    document
      .querySelector(email ? ".payment-section" : ".signup-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollText = email ? "Play now" : "Sign up";

  return (
    <div className="section-background">
      <img src="Nullmage-Warrior.jpg" className="background-image" />
      <div className="about-section">
        <h1>What is Zeal?</h1>
        <p>
          Zeal is a strategy card game for 2-8 players, coming soon to
          Kickstarter. In Zeal you recruit characters, deploy devices and cast
          spells. There are many ways to play from building your own deck to
          playing in a draft tournament for up to 8 players.
        </p>
        <p>
          The game plays like a TCG, but without the booster packs. Every card
          comes in one box.
        </p>
        <p>
          Sign up to follow the project, and for $1 you can get a print & play
          version and play now.
        </p>
        <h1>Kickstarter coming soon...</h1>
        <h1>Print & Play available now!</h1>
      </div>
      <button className="scroll-button" onClick={scrollDown}>
        {scrollText}
      </button>
    </div>
  );
}
