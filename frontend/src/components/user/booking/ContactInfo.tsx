import React, { useState } from 'react'
import { DropOffProps } from './dropOff/DropOff'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCar, faClock, faStar } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { setuserdetails } from '../../../features/bookingSlice'



const ContactInfo:React.FC<DropOffProps> = ({shop ,setActiveSection}) => {
  const [userdetails, setUserdetails] = useState<{
    firstName:string;lastName:string;email:string;phoneNumber:string;
  }>({
    firstName:'',lastName:'',email:'',phoneNumber:''
  });
  const dispatch = useDispatch();
  const dropoffTime = useSelector((state:RootState) => state.bookingdetails.bookingDetails?.shedule)
  const vehicledetail = useSelector((state:RootState)=> state.bookingdetails.bookingDetails?.vehicleDetails)
  
  




  const handleSaveChanges = async () => {
    dispatch(setuserdetails(userdetails))
    setActiveSection('Summary')

  }




  const formatDate = (isoDate: Date | undefined) => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(dateObj.getFullYear()).slice(-2); // Get last two digits of year
    return `${day}/${month}/${year}`;
  };



  return (
    <div className="flex justify-center pt-2 gap-4">
    <div className="border rounded-lg flex flex-col">
      <h1 className="text-2xl border-b py-6 px-14 font-semibold">
        Contact Information
      </h1>

      <div className="p-4 mt-4">
        
        
      <form className="space-y-4 m-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                className='w-full border rounded-md p-2'
                placeholder="Enter first Name"
                value={userdetails?.firstName }
                onChange={(e) => setUserdetails({...userdetails,firstName: e.target.value})}
                />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                className='w-full border rounded-md p-2'
                placeholder="Enter last Name"
                value={userdetails?.lastName}
                onChange={(e) => setUserdetails({...userdetails,lastName: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              className='w-full border  rounded-md p-2'
              placeholder="user@example.com"
              value={userdetails?.email }
              onChange={(e) => setUserdetails({...userdetails,email: e.target.value})}
              />
          </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="number"
                className='w-full border rounded-md p-2'
                placeholder="Enter Phone Number Name"
                value={userdetails?.phoneNumber}
                onChange={(e) => setUserdetails({...userdetails,phoneNumber: e.target.value})}
                />
            </div>
        </form>

      </div>

    </div>

    <div className="border rounded-lg h-fit p-3  ">
      <p className="text-gray-500 text-sm font-semibold uppercase">drop off at</p>

{/* start herer */}
  
    <div className="flex pb-4 pt-2 " >
               <div className="w-28  rounded overflow-hidden">
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

               <div className='w-full mt-2 ms-1  p-4  border-b pb-3'>
               <p className="text-gray-500 text-sm font-semibold uppercase">drop off at</p>
               <p className='text-gray-600'><FontAwesomeIcon icon={faClock} /> {formatDate(dropoffTime?.date)} at {dropoffTime?.time} </p>
               <p className='text-gray-600'><FontAwesomeIcon icon={faCar} /> {`${vehicledetail?.make}, ${vehicledetail?.model} ${vehicledetail?.year}`} </p>
               <p className='text-gray-600'>{vehicledetail?.description && vehicledetail.description} </p>
               </div>

                 <div className="mt-3 px-1 flex justify-center ">
                   <button 
                   onClick={()=>handleSaveChanges()}
                  disabled={userdetails.firstName.trim().length ==0 || userdetails.lastName.trim().length ==0 || userdetails.email.trim().length ==0 || userdetails.phoneNumber.trim().length !==10}
                   className= {`btn-primary ${userdetails.firstName.trim().length ==0|| userdetails.lastName.trim().length ==0 || userdetails.email.trim().length ==0 || userdetails.phoneNumber.trim().length !==10 ? "opacity-50 cursor-not-allowed" : "" } `}
                  >
                     continue to Summary <FontAwesomeIcon icon={faArrowRight} />
                   </button>
                 </div>
      
  
    </div>
  </div>
  )
}

export default ContactInfo