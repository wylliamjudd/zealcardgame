export default function Loading() {
  return (
    <span className="sending" aria-live="polite">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span className="srOnly">Sending…</span>
    </span>
  );
}
