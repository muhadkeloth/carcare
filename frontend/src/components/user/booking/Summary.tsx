import React from 'react'
import { DropOffProps } from './dropOff/DropOff'
import { faArrowRight, faCar, faClock, faFile, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'



const Summary:React.FC<DropOffProps> = ({ shop, setActiveSection}) => {
  const dropoffTime = useSelector((state:RootState) => state.bookingdetails.bookingDetails?.shedule)
  const vehicledetail = useSelector((state:RootState)=> state.bookingdetails.bookingDetails?.vehicleDetails)
  const userDetails = useSelector((state:RootState)=> state.bookingdetails.bookingDetails?.userDetails)



  const formatDate = (isoDate: Date | undefined) => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(dateObj.getFullYear()).slice(-2); // Get last two digits of year
    return `${day}/${month}/${year}`;
  };

  const handleEdit = (path:string) => {
    setActiveSection(path)
  }



  return (
    <div className="flex flex-col justify-center items-center pt-2  ">

    {/* <div className="border rounded-lg  h-fit p-3">
      <div className="p-4 mt-4">
      </div>
    </div> */}

    <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3  mb-4 ">
      <p className="text-gray-500 text-sm font-semibold uppercase">drop off at</p>
    <div className="flex pb-4 pt-2 mt-3 " >
               <div className="w-32  rounded overflow-hidden">
                 <img
                   src={`${import.meta.env.VITE_ENDPORTFRONT}/${shop?.image}`}
                   alt="shop img"
                   className="w-full h-full object-cover rounded"
                   />
               </div>
 
               <div className="flex flex-col  ms-3 w-full">
               <div className="flex  justify-between">
                 <h2 className=" max-w-full break-words whitespace-normal text-base font-medium  text-gray-900">
                   {shop?.shopName && shop?.shopName[0].toUpperCase() + shop?.shopName.slice(1)}
                 </h2>
                 <p className='text-gray-500 text-sm'> <FontAwesomeIcon icon={faStar} className="text-yellow-400" /> 4.8 (15)</p>
               </div>
                 <span className="mt-3 max-w-full break-words whitespace-normal text-sm  text-gray-600">
                   {shop?.address && Object.values(shop?.address).join(" ")}
                 </span>
                 <span className="mt-3 text-sm  text-gray-600">
                   {shop?.phoneNumber}
                 </span>
         
                   <h6 className='mt-3 text-sm  text-gray-600'>
                     availability Wed, Oct 15 at 8 am
                   </h6>
 
               </div>
             </div>
               <div className='w-full mt-2 ms-1  p-4  pb-3'>
               <p className="text-gray-500 text-sm font-semibold uppercase">drop off at</p>
               <div className="flex justify-between">
               <p className='text-gray-600  '><FontAwesomeIcon icon={faClock} /> {  formatDate(dropoffTime?.date)} at {dropoffTime?.time} </p>
               <p onClick={()=>handleEdit('DropOff')} className='text-mainclr-500 cursor-pointer hover:text-mainclr-600'>Edit</p>
               </div>
               <p className="my-3  font-bold"><FontAwesomeIcon icon={faFile} />  Instructions from the shop</p>
               <p className="">Thank you for contacting {shop?.shopName}. Someone will contact you to confirm appointment details.</p>
               </div>

               
    </div>

    <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">   
               <div className='w-full mt-2 ms-1  p-4  pb-3'>
                <div className="flex justify-between">
               <p className="text-gray-500 text-sm font-semibold uppercase">repair summary</p>
               <p onClick={()=>handleEdit('Vehicle')} className='text-mainclr-500 cursor-pointer hover:text-mainclr-600'>Edit</p>
                </div>
               <p className='text-gray-600 mt-2'><FontAwesomeIcon icon={faCar} /> {`${vehicledetail?.make}, ${vehicledetail?.model} ${vehicledetail?.year}`} </p>
               <p className="my-3 "><FontAwesomeIcon icon={faFile} />  Let the shop know what’s wrong</p>
               <p className="my-3 text-sm"> {vehicledetail?.description}</p>
               </div>  
    </div>

    <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">   
               <div className='w-full mt-2 ms-1  p-4  pb-3'>
                <div className="flex justify-between">
               <p className="text-gray-500 text-sm font-semibold uppercase">CONTACT INFORMATION</p>
               <p onClick={()=>handleEdit('ContactInfo')} className='text-mainclr-500 cursor-pointer hover:text-mainclr-600'>Edit</p>
                </div>
                  
               <p className='my-3'>{`${userDetails?.firstName}, ${userDetails?.lastName} `} </p>
               <p className="my-3 ">{userDetails?.email}</p>
               <p className="my-3 ">{userDetails?.phoneNumber}</p>
               </div>
    </div>
  <div className="mt-3 px-1 flex justify-center ">
                   <button 
                  //  onClick={()=>handleSaveChanges()}
                   className= 'btn-primary'>
                     Request Appointment <FontAwesomeIcon icon={faArrowRight} />
                   </button>
                 </div>


  </div>
  )
}

export default Summary