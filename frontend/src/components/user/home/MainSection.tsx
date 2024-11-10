import React from 'react'
import bg_blue from '../../../assets/images/bg_blue.png';


const MainSection:React.FC = () => {
  return (
    <>
    <div className='flex flex-col mt-14 mx-auto max-w-screen-md '>
        <h1 className='text-3xl mt-2 font-bold md:text-6xl mb-2 text-center'>Quality Car Service.</h1>
        <h1 className='font-bold text-3xl md:text-6xl md:mt-5 text-maincol text-center'>Fair Price Guarantee.</h1>
        <p className='mt-6 mb-9 text-base font-medium text-center'>Your One-Stop Solution for Car Car, </p>  {/* location */}
        
        <div className="m-6 flex flex-col md:flex-row md:space-x-4 items-center ">
            <input type="text" 
            className='border  border-gray-300 rounded w-full p-4 mb-4 md:mb-0 md:flex-1'
            placeholder='pincode' />

            <input type="text" 
            className='border border-gray-300 rounded w-full p-4 mb-4 md:mb-0 md:flex-1'
            placeholder='Select vehicle make' />

            <button 
            className="bg-maincol rounded w-full md:w-auto p-4 hover:bg-maincoldark text-white flex items-center justify-center">
                Find Near WorkShop {/* need to add arrow in big sceen */}
                </button>
        </div>
    </div>
    <div className="mt-20 w-full h-96 bg-cover bg-center" style={{backgroundImage:`url(${bg_blue})`}}>
    <h1 className='text-3xl pt-12 text-white font-bold md:text-6xl mb-2 text-center'>One place for all your car needs.</h1>
    <p className='mt-6 mb-9 text-xs md:text-lg pt-3 text-white font-light text-center'>Get help with maintaining your vehicle, fixing problems, and more. </p>
    {/* something here */}
    </div>
    </>
  )
}

export default MainSection