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

    const url = await response.json();

    window.location.assign(url);
  }

  return (
    <div className="section-background">
      <img src="Formic-Commander.jpg" className="background-image" />
      <div className="payment-section">
        <h1>Payment Section</h1>
        <button className="email-button" onClick={startCheckout}>
          Get Print & Play
        </button>
      </div>
    </div>
  );
}
