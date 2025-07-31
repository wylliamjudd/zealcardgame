import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Verified() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const token = searchParams.get("token");

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://zeal-email-worker.wylliam-judd.workers.dev/verify?token=${token}`
      );

      if (response.ok) {
        return setStatus("verified");
      }

      return setStatus("error");
    })();
  });

  return <div className="email-section">{getMessage(status)}</div>;
}

function getMessage(status: string) {
  switch (status) {
    case "verified":
      return (
        <>
          <h1>Email verified 🎉</h1>
          <p>Thanks for confirming! We'll keep you updated on Zeal's launch.</p>
        </>
      );
    case "error":
      return (
        <>
          <h1>Email verified 🎉</h1>
          <p>Thanks for confirming! We'll keep you updated on Zeal's launch.</p>
        </>
      );
    default:
      return <>Verifying your email...</>;
  }
}
