import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HowToPlay() {
  const navigateTo = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="how-to-play">
      <div className="nav">
        <img onClick={() => navigateTo("/")} src="/small-logo.png" />
      </div>
      <h1>How To Play Zeal</h1>
      <h1>Your Deck</h1>
      <p className="card-description">
        All of the cards in your deck have a devotion cost in the top left, and
        a cult symbol in the top right. You spend devotion to play your cards;
        there aren't different kinds of devotion. Your cards get more powerful
        when you play multiple cards with matching cult symbols. This is called
        Zeal.
      </p>
      <div className="your-deck">
        <div>
          <h2>Characters</h2>
          <div className="card-section">
            <div className="card-description">
              Play characters from your hand and put them into play. Characters
              can attack and block and deal and receive combat damage. When a
              character takes lethal damage, it dies and goes into your discard.
            </div>
            <img className="card" src="Zeal53.jpg" />
            <div className="card-description">
              <b>Combat and Zeal Combat</b>
              <p>
                Characters have a combat score indicated in the shield in the
                center of the card. This indicates both how much damage a
                character deals, and how much damage is required to kill it.
                Some characters have a Zeal combat score indicated in the shield
                to the right of that. This character has 4 combat without Zeal
                and 5 combat with Zeal.
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2>Devices</h2>
          <div></div>
          <div className="card-section">
            <div className="card-description">
              Play devices from your hand and put them into play. Devices have
              various effects on the game. Once a device is in play, it stays in
              play until explicitly destroyed.
            </div>
            <img className="card" src="/Zeal9.jpg" />
          </div>
        </div>
        <div>
          <h2>Spells</h2>
          <div className="card-section">
            <div className="card-description">
              Play spells from your hand for an immediate effect. Once a spell
              resolves, put it in your discard.
            </div>
            <img className="card" src="/Zeal62.jpg" />
            <div className="card-description">
              <b>Cost and Zeal Cost</b>
              <p>
                Cards have a devotion cost indicated in the upper left hand
                corner of the card. Some spells have a lower Zeal cost. This
                spell costs 2 devotion without Zeal and 1 devotion with Zeal.
              </p>
            </div>
          </div>
        </div>
      </div>
      <h1>Game Setup</h1>
      <h2>Bases</h2>
      <div className="card-description">
        Each player start the game with six bases in play, with defense scores
        from 1 through 6. When you defeat all of your foe's bases, you win the
        game.
      </div>
      <img className="bases" src="/bases.png" />
      <h2>Devotion</h2>
      <div className="card-description">
        Each player starts the game with a Devotion dial, set to 0 maximum
        devotion and 0 current devotion.
      </div>
      <img className="card" src="/devotion-dial.png" />
      <h2>Shuffle and Draw</h2>
      <div className="card-description">
        Shuffle your deck. Determine the first player randomly. The first player
        draws six cards and the second player draws seven.
      </div>
      <h1>Taking a Turn</h1>
      <h2>Develop</h2>
      <div className="card-description">
        Choose to draw a card or increase your maximum devotion by one. Then set
        your current devotion to your maximum devotion.
      </div>
      <h2>Combat</h2>
      <div className="card-description">
        <p>
          There are four steps in combat. Before each step, each player gets a
          chance to play actions.
        </p>
        <p>
          <b>Choose attackers</b>
        </p>
        <p>
          Choose any characters you have in play that you want to attack with
          and move them forward.
        </p>
        <p>
          <b>Choose blockers</b>
        </p>
        <p>
          Defending players chooses any characters they have in play to block
          with and assigns them to block attacking characters.
        </p>
        <p>
          <b>Flanking</b>
        </p>
        <p>
          For each unblocked attacking character, choose to either deal that
          character's damage to the defending player's bases, or flank one of
          the defending player's blockers.
        </p>
        <p>
          <b>Combat damage</b>
        </p>
        <p>
          Combat damage is simultaneous. Any damage that doesn't kill a
          character or defeat a base is not tracked between turns.
        </p>
      </div>
      <h2>Commit</h2>
      <div className="card-description">
        During your commit step you can play your characters and devices.
        Characters and devices can be played during your commit step when no
        other actions are being played.
      </div>
      <h2>End of Turn</h2>
      <div className="card-description">
        Some devices have “At the end of your turn” actions which you play
        during this step.
      </div>
      <h2>Sound fun?</h2>
      <button className="email-button" onClick={() => navigateTo("/#signup")}>
        Sign Up
      </button>
    </div>
  );
}
