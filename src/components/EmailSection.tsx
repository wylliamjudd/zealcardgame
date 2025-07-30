import { useState } from "react";

export default function EmailSection() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const response = await fetch(
      "https://zeal-email-worker.wylliam-judd.workers.dev",
      {
        method: "POST",
        headers: {
          "content-type": "application/json;",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      alert("Thanks for signing up!");
      setEmail(""); // clear the field
    } else {
      const error = await response.text();
      alert(error);
    }
  };

  return (
    <div className="email-background">
      <img src="/Nullmage Warrior.png" className="background-image" />
      <div className="email-section">
        <h2>Recruit characters, deploy devices, and cast spells!</h2>
        <h2>Build your deck or draft with friends!</h2>
        <h2>Every card in one box.</h2>
        <h1>Coming soon to Kickstarter...</h1>
        <div className="email-form">
          <input
            className="email-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <button className="email-button" onClick={submit}>
            Subscribe
          </button>
        </div>
        <p>
          By subscribing, you agree to receive occasional emails about Zeal’s
          development and launch.
        </p>
      </div>
    </div>
  );
}
