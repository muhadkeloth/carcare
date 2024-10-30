import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Authenticate/Login';
import './App.css'
import Home from './components/user/Home';
import AdminDash from './components/admin/DashAdmin';
import Signup from './components/Authenticate/Signup';
import ForgotPass from './components/Authenticate/ForgotPass';
import OtpValidation from './components/Authenticate/OtpValidation';
import SetPassword from './components/Authenticate/SetPassword';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup  />} />
      <Route path='/forgotpass' element={<ForgotPass />} />
      <Route path='/Otpvalidation' element={<OtpValidation />} />
      <Route path='/setpassword' element={<SetPassword />} />
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/dash' element={<AdminDash />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
