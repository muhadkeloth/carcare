import { faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import ProfileImage from '../../../utilities/ProfileImage'
import { fetchShopUserDetails } from '../../../../services/shopService'


const Dashboard:React.FC = () => {
  const [shopdetails,setShopdetails] = useState<{shopName:string;ownerName:string;email:string;image:string;}>({shopName:'',ownerName:'',email:'',image:''})


  const handleshopDetails = async() => {
    try {
      const response = await fetchShopUserDetails()
      if(response.status !== 201) throw new Error('something went wrong')
      const detail = {
        shopName:response.data.shopUser.shopName ,
        ownerName:response.data.shopUser.ownerName ,
        email:response.data.shopUser.email ,
        image:response.data.shopUser.image ,
      }
      setShopdetails(detail)
    } catch (error) {
      console.log(error)
    }
  }

useEffect(()=> {
  handleshopDetails()
},[])
  return (
    <div className='flex justify-center mt-10'>
        

<div className="w-full max-w-sm bg-white border  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

    <div className="flex  mt-4 flex-col items-center pb-10">  

        <div className="flex flex-col items-center  mb-6 ">
        <div className="relative w-48 h-48">
          {shopdetails?.image ? (
            <img
              src={`${import.meta.env.VITE_ENDPORTFRONT}/${shopdetails.image}`}
              alt="Profile img"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full rounded-full bg-gray-300">
              <FontAwesomeIcon icon={faUserCircle}  className="text-gray-500 text-9xl" />
            </div>
          )}
        </div>
      </div>

        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{shopdetails.shopName.toUpperCase()}</h5>
        <h4 className="mb-1 text-xl font-medium text-gray-900 dark:text-white"><span className='text-sm font-thin text-gray-400'>owner:</span> {shopdetails.ownerName}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">{shopdetails.email}</span>
    </div>
</div>

    </div>
  )
}

export default Dashboard