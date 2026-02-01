export default function CommunitySection() {
  return (
    <div className="section-background half">
      <img src="/page-texture-light.jpg" className="background-image" />
      <section id="community">
        <h1>Join the Community!</h1>
        <p>
          Have questions, comments, or just want hang out? You’re welcome here.
        </p>
        <div className="community-links">
          <a
            className="community-link"
            href="https://discord.gg/RskmTA3u"
            target="_blank"
          >
            <img src="/Discord-Symbol-Blurple.svg" height="24" width="24" />
            <span>Join the Discord Community</span>
          </a>
          <a className="community-link" href="mailto:wylliam@zealcardgame.com">
            <span className="icon">✉️</span>
            <span>wylliam@zealcardgame.com</span>
          </a>
        </div>
      </section>
    </div>
  );
}
