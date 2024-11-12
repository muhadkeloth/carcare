import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../user/home/Home'
import Login from '../authenticate/Login'
import Signup from '../authenticate/Signup'
import ForgotPass from '../authenticate/ForgotPass'
import SetPassword from '../authenticate/SetPassword'
import OtpValidation from '../authenticate/OtpValidation'
import FindWS from '../user/findworkShop/FindWS'
import ShopDetails from '../user/shopDetailsPage/ShopDetails'

const User:React.FC = () => {


  return (
    <Routes>
      <Route path='' element={<Home />} />
      <Route path='login' element={<Login role="user" />} />
      <Route path='signup' element={<Signup  />} />
      <Route path='forgotpass' element={<ForgotPass role="user" />} />
      <Route path='Otpvalidation' element={<OtpValidation  />} />
      <Route path='setpassword' element={<SetPassword  />} />

      <Route path='findworkshop' element={<FindWS  />} />
      <Route path='shopdetails' element={<ShopDetails  />} />

      <Route path='*' element={<div>404 user</div>} />
    </Routes>
  )
}

export default User