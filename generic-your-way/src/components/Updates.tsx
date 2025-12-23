import type { FunctionComponent } from "react";
import "../components/css/Updates.css";
interface UpdatesProps {}

const Updates: FunctionComponent<UpdatesProps> = () => {
  return (
    <>
      <div className="container py-4">
        <h1 className="update">Updates</h1>
        <div className="updates-list">
         
          <div className="version">
            <p className="v-month">Version 1.1.0 - August 2025</p>
            <hr className="v-hr"/>
            <div className="v-body">
              <ul>
                <li>Added create Profile.</li>
                <li>Filter by Regions, Cities, Countries and Settings.</li>
                <li>Player Availability Scheduling.</li>
                <li>Profile Editing &amp; Personalization.</li>
                <li>Player Invitations &amp; Communication.</li>
                <li>
                  Players can now automatically connect <br />
                  through WhatsApp or Telegram links.
                </li>
                <li>About Page &amp; How to Use the Site.</li>
              </ul>
            </div>
            <div className="v-status is-complete">
               <svg xmlns="http://www.w3.org/2000/svg" 
               height="23px" viewBox="0 -960 960 960" 
               width="24px" fill="#25CA61" className="icon-success"> 
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                Completed 
                </div>
          </div>

          <div className="version">
            <p className="v-month">Version 1.1.1 - December 2025</p>
            <hr className="v-hr"/>
            <div className="v-body">
              <ul>
                <li>Delete User.</li>
                <li>Calendar dates.</li>
                <li>Complete player profile for send invites.</li>
                <li>New Register form.</li>
              </ul>
            </div>
             <div className="v-status is-complete">
               <svg xmlns="http://www.w3.org/2000/svg" 
               height="23px" viewBox="0 -960 960 960" 
               width="24px" fill="#25CA61" className="icon-success"> 
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                Completed 
              </div>
          </div>

          <div className="version">
            <p className="v-month">Version 1.1.2 - Februar 2026</p>
            <hr className="v-hr"/>
            <div className="v-body">
              <ul>
                <li>Forget Password.</li>
                <li>Feedback with the Developers.</li>
                <li>New Design.</li>
              </ul>
            </div>
            <div className="v-status is-soon">Soon…</div>
          </div>

          <div className="version">
            <p className="v-month">Version 1.1.3 - March 2026</p>
            <hr className="v-hr"/>
            <div className="v-body">
              <ul>
                <li>Player ratings by Settings, Countries, and Cities.</li>
                <li>Standardized Country/City lists.</li>
                <li>Status selection: <strong> Novice, Fan, Sportsman.</strong></li>
                <li>Favourite Players.</li>
              </ul>
            </div>
            <div className="v-status is-soon">Soon…</div>
          </div>

           <div className="version">
            <p className="v-month">Version 1.1.4 - May 2026</p>
            <hr className="v-hr"/>
            <div className="v-body">
              <ul>
                <li>Internal chat with other players.</li>
                <li>Matching players with similar ratings.</li>
                <li>Player rating option by other players.</li>
              </ul>
            </div>
            <div className="v-status is-soon">Soon…</div>
          </div>

          <div className="version">
            <p className="v-month">Version 1.2.0 - July 2026</p>
            <hr className="v-hr"/>
            <div className="v-body">
              <ul>
              <li>
                  Grand narrative of the Warhammer 40000:
                  <ul>
                    <li>Attack and Defend Planets.</li>
                    <li>Faction List.</li>
                    <li>PTS scoring protocol.</li>
                    <li>Campaign Profile.</li>
                    <li>Narrative Rules.</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="v-status is-soon">Soon…</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Updates;


