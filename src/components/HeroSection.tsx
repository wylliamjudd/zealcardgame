export default function HeroSection() {
  const scrollDown = () => {
    document
      .querySelector(".email-background")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero-section">
      <img src="/zeal-background.png" className="background-image" />
      <img src="/zeal-logo.png" className="background-image fade-up" />
      <button className="scroll-button" onClick={scrollDown}>
        Learn More
      </button>
    </div>
  );
}
