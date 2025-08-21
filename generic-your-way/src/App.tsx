import './App.css'
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PageNotFound from './components/PageNotFound';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
import PlayerCard from './components/PlayerCard';


function App() {
 

  return (
    <>
    <ToastContainer/>
     <Router>
      <Routes>
        <Route path="/" element={<Navigate  to="/dashboard" replace />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<PageNotFound/>} />
        <Route path='/player-card' element={<PlayerCard />} />
      </Routes>
     </Router>
     
    </>
  )
}

export default App
