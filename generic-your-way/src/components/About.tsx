import  { useState, type FunctionComponent } from "react";
import { Link } from "react-router-dom";
import "./css/About.css";

interface AboutProps {}

const About: FunctionComponent<AboutProps> = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="container py-4">
        <div className="about">
          <h1 className="about-h1">About This Project</h1>
          <div className="about-p">
            <p>
              This platform was created with one clear goal: to make communication between Warhammer 40,000 <br />
              players around the world easier and more accessible. <br /> <br />
              Often, players face challenges when trying to find opponents outside of their local community. <br />
              Whether you’re traveling abroad on vacation, moving to a new city, or simply wishing to meet <br />
              new players, this app helps you connect without barriers. <br /> <br />
              Our mission is: <br />
            </p>
            <ul>
              <li>Connect players internationally – remove the limits of local groups and build a truly global community.</li>
              <li>Find games anytime – even outside tournaments or official events, you can quickly find opponents nearby.</li>
              <li>Campaign mode – play narrative campaigns using adjusted rules to make them easier to run at home.</li>
              <li>Casual games – if you simply want to play a one-off match, use the player finder to connect instantly.</li>
              <li>Community growth – by sharing experiences, rosters, and stories, we expand the universe beyond borders.</li>
            </ul>
            <p>
              We believe Warhammer should be not just about battles, but also about friendship and international connections. <br />
              This project is our step toward making the Warhammer community more open, inclusive, and truly global.
            </p>
          </div>
        </div>

        <h1 className="about-h1">How to Use the Site</h1>

        <div className={`how-to-use ${expanded ? "expanded" : "clamp"}`}>
          <section className="mt-4">
            <h2 className="h4">1) Get Started: Profile</h2>
            <ul>
              <li>Open <strong>Profile</strong> and verify your name, region, country, and city.</li>
              <li>Add a <strong>photo</strong> so players recognize you.</li>
              <li>Write a short <strong>Bio</strong>: systems you play, experience, preferred formats, etc.</li>
              <li>Click <strong>Save</strong>.</li>
            </ul>
            <div className="small">
              Go to <Link to="/profile-edit">Profile</Link>
            </div>
          </section>

          <section className="mt-4">
            <h2 className="h4">2) Weekly Availability</h2>
            <ul>
              <li>Open your <strong>Player Card</strong> and toggle the days you’re available (e.g., Mon, Thu).</li>
              <li>For each chosen day, add one or more time ranges.</li>
              <li>If you can’t play this week, turn on <strong>Busy All Week</strong>.</li>
              <li>Click <strong>Save</strong>.</li>
            </ul>
            <p className="small">Tip: Keep your availability fresh so invites match your real schedule.</p>
            <div className="small">
              Go to <Link to="/player-card">Player Card</Link>
            </div>
          </section>

          <section className="mt-4">
            <h2 className="h4">3) Find Players</h2>
            <ul>
              <li>
                Open <strong>Find Players</strong> and use filters:
                <ul>
                  <li><strong>Setting</strong> (Warhammer 40k, Kill Team, Age of Sigmar, etc.)</li>
                  <li><strong>Region / Country / City</strong></li>
                </ul>
              </li>
              <li>Browse the list with photos, bios, and settings.</li>
            </ul>
            <div className="small">
              Go to <Link to="/players">Find Players</Link>
            </div>
          </section>

          <section className="mt-4">
            <h2 className="h4">4) Send an Invite</h2>
            <ol>
              <li>Click <strong>Invite</strong> on a player card.</li>
              <li>Review their available days (and times, if provided).</li>
              <li>Pick a day/time that works for both of you.</li>
              <li>Click <strong>Confirm invite</strong>.</li>
            </ol>
            <p>You’ll see a success message when the invite is sent.</p>
          </section>

          <section className="mt-4">
            <h2 className="h4">5) Track Invites (Home)</h2>
            <ul>
              <li><strong>Incoming Invites</strong> — requests you received.</li>
              <li><strong>Outgoing Invites</strong> — requests you sent.</li>
            </ul>
            <p>Each invite shows the opponent, setting, and the selected <strong>day of week</strong> and <strong>time</strong>.</p>
            <ul>
              <li><strong>Accept</strong> / <strong>Decline</strong> incoming invites.</li>
              <li><strong>Cancel</strong> your outgoing invites.</li>
              <li>If enabled, open <strong>WhatsApp</strong> or <strong>Telegram</strong> to coordinate.</li>
            </ul>
            <div className="small">
              Go to <Link to="/">Home</Link>
            </div>
          </section>

          <section className="mt-4">
            <h2 className="h4">6) Community Tips</h2>
            <ul>
              <li>Confirm time, place/platform, points, and mission/format in chat.</li>
              <li>Be respectful and punctual—good habits build a strong community.</li>
              <li>New players are welcome—consider offering a learning game!</li>
            </ul>
          </section>

          <section className="mt-4">
            <h2 className="h4">7) Project Goal</h2>
            <p>
              This isn’t just a finder—it’s a community tool to connect local players, <br />
              organize games and campaigns, and encourage friendly play and knowledge sharing.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="h5">FAQ</h3>
            <p className="mb-1"><strong>Q:</strong> I don’t want invites this week.</p>
            <p className="text-warning">Turn on <strong>Busy All Week</strong> in your Player Card and click <strong>Save</strong>.</p>
            <p className="mb-1"><strong>Q:</strong> My city/country is wrong.</p>
            <p className="text-warning">Update it in <strong>Profile</strong> and click <strong>Save</strong>.</p>
            <p className="mb-1"><strong>Q:</strong> No players appear.</p>
            <p className="text-warning">Try broadening filters (region, nearby city) or another setting.</p>
          </section>

          {!expanded && <div className="howto-fade" />}
        </div>
        <div className="text-center mt-2">
          <button
            className="btn-how-to"
            onClick={() => setExpanded((s) => !s)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </>
  );
};

export default About;
