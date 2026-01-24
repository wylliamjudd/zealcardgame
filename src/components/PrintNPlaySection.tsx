import { useEffect } from "react";

export default function PrintNPlaySection() {
  useEffect(() => {
    if (window.location.hash === "#print-n-play") {
      document.querySelector("#print-n-play")?.scrollIntoView();
    }
  });

  return (
    <div className="section-background">
      <img src="Priestess-of-the-Moon.jpg" className="background-image" />
      <div className="payment-section" id="print-n-play">
        <h1>Zeal: Print & Play Edition</h1>
        <p>This is the complete Print & Play version of Zeal.</p>
        <p>
          You’ll receive all game components needed to play, formatted for home
          printing. Card graphics are simplified to save ink, and some cards use
          placeholder art or non-final artwork.
        </p>
        <p>
          Instead of physical devotion dials, this edition includes printable
          devotion trackers. You’ll need simple markers (coins, paperclips,
          etc.) to use them.
        </p>
        <p>Gameplay is fully intact. This edition is about function first.</p>
        <p />
        <a className="email-button" href="/Zeal Print & Play.zip" download>
          Download
        </a>
      </div>
    </div>
  );
}
