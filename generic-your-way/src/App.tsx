import './App.css'
import Register from './components/Register';
import Login from './components/Login';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import PageNotFound from './components/PageNotFound';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
import PlayerCard from './components/PlayerCard';
import About from './components/About';
import LayoutRight from './components/Navbar';
import Players from './components/Players';
import MatchRoom from './components/MatchRoom';
import Updates from './components/Updates';
import WelcomePage from './components/WelcomePage';
import ProfileEdit from './components/ProfileEdit';
import AvailabilityEdit from './components/AvailabilityEdit';
import "./components/css/toast.css";
import ForgetPassword from './components/ForgetPassword';


function App() {
 
  return (
    <>
    <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        limit={3}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate  to="/welcome-page" replace />} />
        <Route path='/welcome-page' element={<WelcomePage />} />
         <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
         <Route path='/forget-password' element={<ForgetPassword />} />
         <Route element={<LayoutRight />}>
         <Route path='about' element={<About />} />
         <Route path='/updates' element={<Updates />} />
         <Route path='*' element={<PageNotFound/>} />
         <Route path='/player-card' element={<PlayerCard />} />
         <Route path='/dashboard' element={<Dashboard />} />
         <Route path='/players' element={<Players />} />
         <Route path='/match/:battleId' element={<MatchRoom />}/>
         <Route path="/profile-edit" element={<ProfileEdit/>}/>
         <Route path="/availability" element={<AvailabilityEdit />} />
        </Route>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
