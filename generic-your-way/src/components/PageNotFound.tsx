import type { FunctionComponent } from "react";


interface PageNotFoundProps {
    
}
 
const PageNotFound: FunctionComponent<PageNotFoundProps> = () => {
    return ( <>
    <div>
     <div style={{ justifyContent: 'center', alignItems: 'center', height: '100%'}}>
         <main className="welcome-page-content">
        <img src="/content/Forge.jpg" alt="FORGE logo" className="logo" />
      </main>
    <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Page not found-404</h1>
    </div>
    </div>
    
    </> );
}
 
export default PageNotFound;