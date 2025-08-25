import type { FunctionComponent } from "react";


interface AboutProps {}
 
const About: FunctionComponent<AboutProps> = () => {
    return ( <>
<div className="about">
<h1>About This Project</h1>
<p>
This platform was created with one clear goal: <br />
to make communication between Warhammer 40,000 players around the world easier and more accessible. <br /> <br />
Often, players face challenges when trying to find opponents outside of their local community. <br />
Whether you’re traveling abroad on vacation, moving to a new city, or simply wishing to meet new players, <br />
this app helps you connect without barriers. <br /> <br />
Our mission is: <br /> </p>
<ul>
<li>Connect players internationally – remove the limits of local groups and build a truly global community.</li>
<li>Find games anytime – even outside tournaments or official events, you can quickly find opponents nearby.</li>
<li>Campaign mode – play narrative campaigns using adjusted rules to make them easier to run at home.</li>
<li>Casual games – if you simply want to play a one-off match, use the player finder to connect instantly.</li>
<li>Community growth – by sharing experiences, rosters, and stories, we expand the universe beyond borders.</li>
</ul>
<p>
We believe Warhammer should be not just about battles, but also about friendship, storytelling, and international connections. <br />
This project is our step toward making the Warhammer community more open, inclusive, and truly global.
</p>
</div>
</> );
}
 
export default About;