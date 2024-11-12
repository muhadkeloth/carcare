import React from 'react';
import Header from './Header';
import MainSection from './MainSection';
import Shops from './Shops';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { clearOtpState } from '../../../features/otpSlice';


const Home:React.FC = () => {
  const dispatch = useDispatch() 
  dispatch(clearOtpState())


 

  return (
    <>
      <Header />
      <MainSection />
      <Shops />
      <Footer />
    </>
  )
}

export default Home
