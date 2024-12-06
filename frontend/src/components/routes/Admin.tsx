import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../authenticate/Login'
import AdminDash from '../admin/DashAdmin'
import ForgotPass from '../authenticate/ForgotPass'
import OtpValidation from '../authenticate/OtpValidation'
import SetPassword from '../authenticate/SetPassword'
import Error from '../reuseComponents/Error'

const Admin:React.FC = () => {
  return (
    <Routes>
      <Route path='login' element={<Login role="admin" />} />
      <Route path='' element={<AdminDash />} />
      <Route path='forgotpass' element={<ForgotPass role="admin" />} />
      <Route path='Otpvalidation' element={<OtpValidation  />} />
      <Route path='setpassword' element={<SetPassword  />} />

      <Route path='*' element={ <Error role='admin' /> } />
    </Routes>
  )
}

export default Admin