import React, { useEffect } from 'react';
import { navigateLogin } from '../utilities/navigate';
import { useNavigate } from 'react-router-dom';
import Header from './home/Header';
import MainSection from './home/MainSection';


const Home:React.FC = () => {
  const navigate = useNavigate();

  useEffect(()=> {

  },[]);

  return (
    <>
      <Header />
      <MainSection />
      
      <button >click me</button>
    </>
  )
}

export default Home
