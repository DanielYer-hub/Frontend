import type { FunctionComponent } from "react";
import Seo from "./Seo";

interface PageNotFoundProps {
    
}
 
const PageNotFound: FunctionComponent<PageNotFoundProps> = () => {
    return ( <>
       <Seo
          title="Generic Your Way"
          description="Search for local tabletop players by region, date and game system."
          url="https://generic-your-way.onrender.com/404"
        />
    <h1>Page not found-404</h1>
    </> );
}
 
export default PageNotFound;