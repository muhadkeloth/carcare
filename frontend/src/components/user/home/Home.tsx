import React, { useEffect } from 'react';
import Header from '../reusableComponents/Header';
import MainSection from './MainSection';
import Footer from '../reusableComponents/Footer';
import { useDispatch } from 'react-redux';
import { clearOtpState } from '../../../features/otpSlice';
import Services from './Services';
import Workshops from './Workshops';
import Reviews from './Reviews';
import ShowServices from './ShowServices';


const Home:React.FC = () => {
  const dispatch = useDispatch() 
  
  useEffect(()=> {
    dispatch(clearOtpState())
  },[dispatch])

  return (
    <>
      <Header />
      <MainSection />
      <div className="min-h-screen bg-gray-50">
        <Workshops />
        <ShowServices />
        <Services />
        <Reviews />
      </div>
      <Footer />
    </>
  )
}

export default Home
