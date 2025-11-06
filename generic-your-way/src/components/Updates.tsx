import type { FunctionComponent } from "react";

interface UpdatesProps {
    
}
 
const Updates: FunctionComponent<UpdatesProps> = () => {
    return ( <>
    <div className="container py-4">
        <h1 className="mb-4">Updates</h1>
        <div className="mb-4">
        <p>Version 1.1.0 - August 2025</p>
        <ul>
            <li>Added create Profile.</li>
            <li>Special narrative Campaign.</li>
            <li>Attack and Defend Planets.</li>
            <li>New Factions.</li>
            <li>PTS scoring protocol.</li>
            <li>Filter by Regions, Cities, Countries.</li>
            <li>Campaign Profile.</li>
        </ul>

        </div>
        <div className="mb-4">
        <p>Version 1.1.0 - October 2025</p>
        <ul>
            
      <section className="mt-4">
        <h3 className="h5">Roadmap (teaser)</h3>
        <ul>
          <li>Player levels/experience tags</li>
          <li>Game history & simple rating tools</li>
          <li>Random Warhammer quotes on Dashboard</li>
          <li>Standardized country/city lists</li>
        </ul>
      </section>
        </ul>
        </div>
    </div>
    </> );
}
 
export default Updates;