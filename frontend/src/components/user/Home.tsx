import React, { useEffect } from 'react';
import { navigateLogin } from '../utilities/navigate/common';
import { useNavigate } from 'react-router-dom';
import Header from './home/Header';
import MainSection from './home/MainSection';
import Shops from './home/Shops';
import Footer from './home/Footer';


const Home:React.FC = () => {
  const navigate = useNavigate();

  // useEffect(()=> {
  //   const token = localStorage.getItem('user_token');
  //   if(!token){ navigateLogin(navigate,'user') }
  // },[navigate]);

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
