import './App.css'
import Register from './components/Register';
import Login from './components/Login';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import PageNotFound from './components/PageNotFound';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
import PlayerCard from './components/PlayerCard';
import About from './components/About';
import Updates from './components/Updates';
import LayoutRight from './components/Navbar';


function App() {
 
  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutRight />}>
        <Route path="/" element={<Navigate  to="/dashboard" replace />} />
         <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
         <Route path='about' element={<About />} />
         <Route path='updates' element={<Updates />} />
         <Route path='*' element={<PageNotFound/>} />
         <Route path='/player-card' element={<PlayerCard />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        
    {/* PrivateRoute обёртка для маршрутов, где нужна авторизация. */}
      {/* <Route element={<PrivateRoute />}> */}
        {/* <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<PageNotFound/>} />
        <Route path='/player-card' element={<PlayerCard />} /> */}
      {/* </Route>  */}
        
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
