import { useEffect } from "react";

export default function PrintNPlaySection() {
  useEffect(() => document.querySelector("#print-n-play")?.scrollIntoView());

  return (
    <div className="section-background">
      <img src="Priestess-of-the-Moon.jpg" className="background-image" />
      <div className="payment-section" id="print-n-play">
        <h1>Print & Play</h1>
        <a className="email-button" href="/Zeal Print & Play.zip" download>
          Download
        </a>
      </div>
    </div>
  );
}
