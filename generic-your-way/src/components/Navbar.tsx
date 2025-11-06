import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LayautRight() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const loc = useLocation();
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
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
<Link to="/" className="text-decoration-none mb-3 h5 align-self-end">Menu</Link>
<nav className="nav nav-pills flex-column gap-2">
<NavLink className="nav-link ms-auto"  to="/dashboard">Home</NavLink>    
<NavLink className="nav-link ms-auto"  to="/player-card">Profile</NavLink>  
<NavLink className="nav-link ms-auto" to="/about">About</NavLink>  
<NavLink className="nav-link ms-auto" to="/updates">Updates</NavLink> 
<NavLink className="nav-link ms-auto" to="/players">Find Players</NavLink>


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
    <button className="btn btn-primary w-100" onClick={applyFilters}>Apply</button>
    </div>
    </div>
</nav>    

<div className="mt-auto d-grid">
        {token ? (
      <button onClick={handleLogout} className="btn btn-link">Logout</button>
    ) : (
      <button onClick={() => navigate("/login")} className="btn btn-link">Login</button>
    )}
    </div>
</aside>

<div className="offcanvas offcanvas-end" tabIndex={-1} id="mobileRightNav">
<div className="offcanvas-header">
    <h5 className="offcanvas-title">Menu</h5>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"/>
</div>
        <div className="offcanvas-body d-flex flex-column gap-2">
          <NavLink className="btn btn-light" to="/dashboard" >Home</NavLink>
          <NavLink className="btn btn-light" to="/player-card" >Profile</NavLink>
          <NavLink className="btn btn-light" to="/about" >About</NavLink>
          <NavLink className="btn btn-light" to="/players" >Find Players</NavLink>

 <div className="card mt-2">
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
        <button className="btn btn-accent-outline w-100" onClick={() => { applyFilters(); }} data-bs-dismiss="offcanvas">Apply</button>
    </div>
</div>

<div className="mt-auto d-grid">
     {token ? (
      <button onClick={handleLogout} className="btn btn-link">Logout</button>
    ) : (
      <button onClick={() => navigate("/login")} className="btn btn-link">Login</button>
    )}
</div>
</div>
</div>
</div>
);
}