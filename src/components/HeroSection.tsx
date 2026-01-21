export default function HeroSection() {
  const scrollDown = () => {
    document
      .querySelector(".about-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero-section">
      <img src="/zeal-background.jpg" className="background-image" />
      <img src="/zeal-logo.png" className="background-image fade-up" />
      <button className="scroll-button" onClick={scrollDown}>
        Learn more
      </button>
    </div>
  );
}
