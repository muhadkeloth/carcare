import { Route, Routes } from 'react-router-dom'
import Home from '../user/home/Home'
import Login from '../authenticate/Login'
import Signup from '../authenticate/Signup'
import ForgotPass from '../authenticate/ForgotPass'
import SetPassword from '../authenticate/SetPassword'
import OtpValidation from '../authenticate/OtpValidation'
import FindWS from '../user/findworkShop/FindWS'
import ShopDetails from '../user/shopDetailsPage/ShopDetails'
import BookingSlot from '../user/booking/BookingSlot'
import Estimate from '../user/estimate/Estimate'
import ProfileHome from '../user/profileManage/ProfileHome'
import PickCarHome from '../user/pickMyCar/PickCarHome'
import Error from '../reuseComponents/Error'
import ChatHistory from '../user/Chat/ChatHistory'
import PrivateRoute from './PrivateRoute'



const User = () => {
  return (
    <Routes>
      <Route path='login' element={<Login role="user" />} />
      <Route path='signup' element={<Signup  />} />
      <Route path='forgotpass' element={<ForgotPass role="user" />} />
      <Route path='Otpvalidation' element={<OtpValidation  />} />
      <Route path='setpassword' element={<SetPassword  />} />

      <Route path='' element={<Home />} />

      <Route element={<PrivateRoute role='user' />}>
      <Route path='findworkshop' element={<FindWS  />} />
      <Route path='workshopdetails' element={<ShopDetails  />} />
      <Route path='bookingSlot' element={<BookingSlot  />} />

      <Route path='getEstimate' element={<Estimate  />} />

      <Route path='pickMyCar' element={<PickCarHome  />} />
      
      <Route path='chats' element={<ChatHistory  />} />

      <Route path='profile' element={<ProfileHome  />} />
      </Route>

      <Route path='*' element={ <Error role='user' /> } />

    </Routes>
  )
}

export default User