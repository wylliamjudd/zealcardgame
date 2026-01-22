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
          Zeal is a strategy card game set on the brink of apocalypse. In Zeal
          you recruit characters to attack your opponent’s bases and defend your
          own, deploy devices to support them, and cast spells to turn the tide
          of battle.
        </p>
        <p>
          There are many ways to play Zeal, from predefined decklists, to
          building your own decks, to draft tournaments for up to eight players.
          Every card comes in one box.
        </p>
        <p>
          A crowdfunding campaign is coming soon. You can sign up to follow the
          project and get updates — and if you want to play right now, the Print
          & Play edition is available for $1.
        </p>
      </div>
      <button className="scroll-button" onClick={scrollDown}>
        {scrollText}
      </button>
    </div>
  );
}
