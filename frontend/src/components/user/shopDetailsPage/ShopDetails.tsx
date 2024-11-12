import React from 'react'
import { useLocation } from 'react-router-dom';
import Header from '../reusableComponents/Header';
import MainBlock from './MainBlock';


const ShopDetails:React.FC = () => {
    const location = useLocation();
    const {id} = location.state || {};

  return (
    <div>
        <Header />
        <MainBlock />
    </div>
  )
}

export default ShopDetails