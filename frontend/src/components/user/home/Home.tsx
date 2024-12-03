import React, { useEffect } from 'react';
import Header from '../reusableComponents/Header';
import MainSection from './MainSection';
import Shops from './Shops';
import Footer from '../reusableComponents/Footer';
import { useDispatch } from 'react-redux';
import { clearOtpState } from '../../../features/otpSlice';


const Home:React.FC = () => {
  const dispatch = useDispatch() 
  
  useEffect(()=> {
    dispatch(clearOtpState())
  },[dispatch])

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
