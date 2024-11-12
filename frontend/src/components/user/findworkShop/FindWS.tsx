import React from 'react'
import Header from '../reusableComponents/Header'
import Mainbody from './Mainbody'
import Navbar from './Navbar'
import Footer from '../reusableComponents/Footer'

const FindWS:React.FC = () => {
  return (
    <>
        <Header />
        <Navbar />
        <Mainbody />
        <Footer />
    </>
  )
}

export default FindWS