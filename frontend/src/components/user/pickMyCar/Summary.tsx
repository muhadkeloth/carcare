import React from 'react'
import { estimateProps } from '../estimate/Locationfind'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCar, faClock, faFile, faStar } from '@fortawesome/free-solid-svg-icons';

const Summary:React.FC<estimateProps> = ({setActiveSection}) => {
    const { shedule, vehicleDetails ,userDetails, shopdetails,locationdetails } = useSelector((state: RootState) => state.pickMyCar.PickCarDetails) || {};
    
    const formatDate = (isoDate: Date | undefined) => {
        if (!isoDate) return '';
        const dateObj = new Date(isoDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
        const year = String(dateObj.getFullYear()).slice(-2); 
        return `${day}/${month}/${year}`;
      };

      const handleBookPickMyCar = () => {
        
      }


    const handleEdit = (path:string) => {
        setActiveSection(path)
      }


  return (
      <div className="flex flex-col justify-center items-center pt-2  ">
    <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3  mb-4 ">
      <p className="text-gray-500 text-sm font-semibold uppercase">Booking Details</p>
    <div className="flex pb-4 pt-2 mt-3 " >
               <div className="w-32  rounded overflow-hidden">
                 <img
                   src={shopdetails?.image}
                   alt="shop img"
                   className="w-full h-full object-cover rounded"
                   />
               </div>
 
               <div className="flex flex-col  ms-3 w-full">
               <div className="flex  justify-between">
                 <h2 className=" max-w-full break-words whitespace-normal text-base font-medium  text-gray-900">
                   {shopdetails?.shopName && shopdetails?.shopName[0].toUpperCase() + shopdetails?.shopName.slice(1)}
                 </h2>
                 <p className='text-gray-500 text-sm'> <FontAwesomeIcon icon={faStar} className="text-yellow-400" /> 4.8 (15)</p>
               </div>
                 <span className="mt-3 max-w-full break-words whitespace-normal text-sm  text-gray-600">
                   {shopdetails?.address && Object.values(shopdetails?.address).join(" ")}
                 </span>
                 <span className="mt-3 text-sm  text-gray-600">
                   {shopdetails?.phoneNumber}
                 </span>
         
                   <h6 className='mt-3 text-sm  text-gray-600'>
                     Pickup on Wed, Oct 15 at 8 am
                   </h6>
 
               </div>
             </div>
               <div className='w-full mt-2 ms-1  p-4  pb-3'>
               <p className="text-gray-500 text-sm font-semibold uppercase">pickup sheduled on :</p>
               <div className="flex justify-between">
               <p className='text-gray-600  '><FontAwesomeIcon icon={faClock} /> {  formatDate(shedule?.date)} at {shedule?.time} </p>
               <p onClick={()=>handleEdit('Time')} className='text-mainclr-500 cursor-pointer hover:text-mainclr-600'>Edit</p>
               </div>
               <p className="my-3  font-bold"><FontAwesomeIcon icon={faFile} />  Instructions from the shop</p>
               <p className="">Thank you for contacting {shopdetails?.shopName}. shortly we will contact you to confirm appointment details.</p>
               </div>         
    </div>

    <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">   
               <div className='w-full mt-2 ms-1  p-4  pb-3'>
                <div className="flex justify-between">
               <p className="text-gray-500 text-sm font-semibold uppercase">vehicle details</p>
               <p onClick={()=>handleEdit('Vehicle')} className='text-mainclr-500 cursor-pointer hover:text-mainclr-600'>Edit</p>
                </div>
               <p className='text-gray-600 mt-2'><FontAwesomeIcon icon={faCar} /> {`${vehicleDetails?.make}, ${vehicleDetails?.model} ${vehicleDetails?.year}`} </p>
               <p className="my-3 text-sm"> {vehicleDetails?.description}</p>
               </div>  
    </div>

    <div className="border rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">   
               <div className='w-full mt-2 ms-1  p-4  pb-3'>
                <div className="flex justify-between">
               <p className="text-gray-500 text-sm font-semibold uppercase">CONTACT INFORMATION</p>
               <p onClick={()=>handleEdit('ContactInfo')} className='text-mainclr-500 cursor-pointer hover:text-mainclr-600'>Edit</p>
                </div>
                  
               <p className='my-3'>{`${userDetails?.firstName} ${userDetails?.lastName} `} </p>
               <p className="my-3 ">{userDetails?.email}</p>
               <p className="my-3 flex-wrap ">{userDetails?.phoneNumber}</p>
               <p className="my-3 text-wrap overflow-auto">
                <span className="block text-gray-500 text-sm">pick up location:</span>
                {locationdetails?.description}
                </p>
               </div>
    </div>
  <div className="mt-3 px-1 flex justify-center ">
                   <button 
                   onClick={()=>handleBookPickMyCar()}
                   className= 'btn-primary'>
                     Request Pickup <FontAwesomeIcon icon={faArrowRight} />
                   </button>
                 </div>
  </div>
  )
}

export default Summary