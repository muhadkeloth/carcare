import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/authenticate/Login';
import './App.css'
import Home from './components/user/home/Home';
import AdminDash from './components/admin/DashAdmin';
import Signup from './components/authenticate/Signup';
import ForgotPass from './components/authenticate/ForgotPass';
import OtpValidation from './components/authenticate/OtpValidation';
import SetPassword from './components/authenticate/SetPassword';
import Shop from './components/routes/Shop';
import 'react-toastify/dist/ReactToastify.css';
import Admin from './components/routes/Admin';
import User from './components/routes/User';


const App:React.FC = () => {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/*' element={<User />} />


        <Route path='/shop/*' element={<Shop />} />


        <Route path='/admin/*' element={<Admin />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

