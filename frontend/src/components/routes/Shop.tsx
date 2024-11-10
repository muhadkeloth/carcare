import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../authenticate/Login'
import ForgotPass from '../authenticate/ForgotPass'
import OtpValidation from '../authenticate/OtpValidation'
import SetPassword from '../authenticate/SetPassword'
import ShopHome from '../shop/HomeShop'

const Shop:React.FC = () => {
    return (
    <Routes>
      <Route path='login' element={<Login role='shop' />} />
      <Route path='' element={<ShopHome />} />
      <Route path='forgotpass' element={<ForgotPass role="shop" />} />
      <Route path='Otpvalidation' element={<OtpValidation />} />
      <Route path='setpassword' element={<SetPassword  />} />

      <Route path='*' element={<div>404 shop</div>} />
    </Routes>
  )
}

export default Shop