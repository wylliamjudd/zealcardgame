type Props = {
  email: string | null;
};

export default function PaymentSection({ email }: Props) {
  async function startCheckout() {
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      },
    );

    const { url } = await response.json();

    window.location.assign(url);
  }

  return (
    <div className="section-background">
      <img src="Formic-Commander.jpg" className="background-image" />
      <div className="payment-section">
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
        <button className="email-button" onClick={startCheckout}>
          Get Print & Play for $1
        </button>
      </div>
    </div>
  );
}
