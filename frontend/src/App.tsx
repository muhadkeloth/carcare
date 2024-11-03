import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/authenticate/Login';
import './App.css'
import Home from './components/user/Home';
import AdminDash from './components/admin/DashAdmin';
import Signup from './components/authenticate/Signup';
import ForgotPass from './components/authenticate/ForgotPass';
import OtpValidation from './components/authenticate/OtpValidation';
import SetPassword from './components/authenticate/SetPassword';
import Shop from './components/shop/Shop';
import 'react-toastify/dist/ReactToastify.css';


const App:React.FC = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login role="user" />} />
      <Route path='/signup' element={<Signup  />} />
      <Route path='/forgotpass' element={<ForgotPass />} />
      <Route path='/Otpvalidation' element={<OtpValidation />} />
      <Route path='/setpassword' element={<SetPassword />} />

      <Route path='/shop/login' element={<Login role='shop' />} />
      <Route path='/shop' element={<Shop />} />

      <Route path='/admin/login' element={<Login role="admin" />} />
      <Route path='/admin' element={<AdminDash />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

