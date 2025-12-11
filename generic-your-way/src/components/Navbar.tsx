import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./css/Navbar.css";

declare const bootstrap: any;

export default function LayautRight() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const loc = useLocation();
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    
    const closeOffcanvas = () => {
    const el = document.getElementById("mobileRightNav");
    if (!el) return;
    const instance =
      bootstrap.Offcanvas.getInstance(el) ||
      bootstrap.Offcanvas.getOrCreateInstance(el);
    instance?.hide();
    };
    const handleLogout = () => {
    logout();
    closeOffcanvas();        
    navigate("/login", { replace: true });
  };
  
useEffect(() => {
    const q = new URLSearchParams(loc.search);
    setCountry(q.get('country') || '');
    setRegion(q.get('region') || '');
    setCity(q.get('city') || '');
}, [loc.search]);

const applyFilters = () => {
    const q = new URLSearchParams();
    if (country) q.set('country', country);
    if (region) q.set('region', region);
    if (city) q.set('city', city);
    navigate(`/players?${q.toString()}`);
};
return (
<div className="d-flex">
<div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
<header className="d-md-none border-bottom">
    <div className="container d-flex align-items-center justify-content-between py-2">
    <Link to="/" className="text-decoration-none h5 m-0">GYW</Link>    
     <button className="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#mobileRightNav">
      ☰
     </button>
    </div>
</header>

<main className="flex-grow-1">
    <Outlet />
</main>

<footer className="border-top">
<div className="container py-3 text-center small">
  © {new Date().getFullYear()} Generic Your Way by Daniel Yerema.
</div>
</footer>
</div>

<aside className="d-none d-md-flex flex-column p-3 border-start" style={{ width: '300px', minHeight: '100vh' }}>
<Link to="/" className="text-decoration-none mb-2 h5 align-self-center">Generic Your Way</Link>
<hr />
<nav className="nav nav-pills flex-column gap-3">
<NavLink className="btn btn-accent-outline"  to="/dashboard">Invites</NavLink>    
<NavLink className="btn btn-accent-outline"  to="/player-card">Profile</NavLink>  
<NavLink className="btn btn-accent-outline" to="/about">About</NavLink>  
<NavLink className="btn btn-accent-outline" to="/updates">Updates</NavLink> 
<NavLink className="btn btn-accent-outline" to="/players">Find Players</NavLink>
 <div className="card ms-auto mt-2" style={{width:"100%"}}>
    <div className="card-body">
    <div className="fw-bold mb-2">Filter</div>
    <div className="mb-2">
    <label className="form-label">Region</label>
    <select className="form-select" value={region} onChange={e=>setRegion(e.target.value)}>
        <option value="">Any</option>
        <option value="North America">North America</option>
        <option value="Caribbean">Caribbean</option>
        <option value="Central America">Central America</option>
        <option value="South America">South America</option>
        <option value="Africa">Africa</option>
        <option value="Middle East">Middle East</option>
        <option value="Europe">Europe</option>
        <option value="Asia">Asia</option>
        <option value="Australia and Oceania">Australia and Oceania</option>
    </select>
 </div>
 <div className="mb-2">
    <label className="form-label">Country</label>
    <input className="form-control" value={country} onChange={e=>setCountry(e.target.value)} placeholder="e.g. England" />
    </div>
    <div className="mb-2">
    <label className="form-label">City</label>
    <input className="form-control" value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. London" />
    </div>
    <button className="btn btn-accent-outline w-100" onClick={applyFilters}>Apply</button>
    </div>
    </div>
</nav>    
<hr className="offcanvas-footer mt-auto"/>
<div className="d-grid">
        {token ? (
      <button onClick={handleLogout} className="btn btn-danger mb-1">
        Logout
      <svg xmlns="http://www.w3.org/2000/svg" 
      height="20px" 
      viewBox="0 -960 960 960" 
      width="24px" 
      fill="#F3F3F3">
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
      </svg>
      </button>
    ) : (
      <button onClick={() => navigate("/login")} className="btn btn-success mb-1">
        Login
        <svg xmlns="http://www.w3.org/2000/svg" 
        height="20px"
         viewBox="0 -960 960 960" 
         width="24px" fill="#F3F3F3">
        <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
        </svg>
        </button>
    )}
    </div>
</aside>

<div className="offcanvas offcanvas-end" tabIndex={-1} id="mobileRightNav">
<div className="offcanvas-header">
<h5 className="offcanvas-title">Menu</h5>
<button type="button" className="btn-close" data-bs-dismiss="offcanvas"/>
</div>
<div className="offcanvas-body d-flex flex-column gap-3">
          <NavLink className="btn btn-accent-outline" to="/dashboard" onClick={closeOffcanvas}>Invites</NavLink>
          <NavLink className="btn btn-accent-outline" to="/player-card" onClick={closeOffcanvas}>Profile</NavLink>
          <NavLink className="btn btn-accent-outline" to="/about" onClick={closeOffcanvas}>About</NavLink>
          <NavLink className="btn btn-accent-outline" to="/updates" onClick={closeOffcanvas}>Updates</NavLink> 
          <NavLink className="btn btn-accent-outline" to="/players" onClick={closeOffcanvas}>Find Players</NavLink>
<hr className="offcanvas-footer mt-auto"/>
<div className=" d-grid ">
     {token ? (
      <button onClick={handleLogout} className="btn btn-danger mb-1"  data-bs-dismiss="offcanvas">
        Logout
      <svg xmlns="http://www.w3.org/2000/svg" 
      height="20px" 
      viewBox="0 -960 960 960" 
      width="24px" 
      fill="#F3F3F3">
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
      </svg>
        </button>
    ) : (
      <button onClick={() => {navigate("/login"); closeOffcanvas();}} className="btn btn-success">
      Login
      <svg xmlns="http://www.w3.org/2000/svg" 
        height="20px"
         viewBox="0 -960 960 960" 
         width="24px" 
         fill="#F3F3F3">
        <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
        </svg>
      </button>
    )}
</div>
</div>
</div>
</div>
);
}