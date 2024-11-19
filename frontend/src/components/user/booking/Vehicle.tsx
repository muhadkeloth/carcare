import { faArrowRight, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { DropOffProps } from './dropOff/DropOff'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setVehicleDetails } from '../../../features/bookingSlice';


const Vehicle:React.FC<DropOffProps> = ({shop, setActiveSection}) => {
  const [make,setMake] = useState('')
  const [year,setYear] = useState('')
  const [model,setModel] = useState('')
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const dropoffTime = useSelector((state:RootState) => state.bookingdetails.bookingDetails?.shedule)


  const formatDate = (isoDate: Date | undefined) => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(dateObj.getFullYear()).slice(-2); // Get last two digits of year
    return `${day}/${month}/${year}`;
  };

  const handlevehicledetails = () => {
    if(make && model && year){
      dispatch(setVehicleDetails({make,model,year,description}))
    }
    setActiveSection('ContactInfo')     
  }



  return (
    <div className="flex justify-center pt-2 gap-4">
      <div className="border rounded-lg flex flex-col">
        <h1 className="text-2xl border-b py-6 px-14 font-semibold">
          Tell us about your vehicle
        </h1>

        {/* <div className="p-4 mt-4   ">
          <div className=" mb-4 justify-start items-start"> */}
        <div className="p-6  ">
          <div className=" mb-6">
          
            {/* <h2 className="text-lg font-bold">Make</h2> */}
            <h2 className="text-lg font-bold mb-2">Make</h2>
            <select name="make"className="w-full border rounded px-3 py-2 text-gray-700"
            value={make}
            onChange={(e)=>setMake(e.target.value)}>
              <option value="" disabled>Select Make</option>
              <option value="Toyota">Toyota</option>
              <option value="Maruti Suzuki">Maruti Suzuki</option>
              <option value="Honda">Honda</option>
              <option value="Hyundai">Hyundai</option>
            </select>
          </div>
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-bold">Year</h2>
            <select name="year" className='w-full border rounded px-3 py-2 text-gray-700'
            value={year}
            onChange={(e)=> setYear(e.target.value)}>
              <option value="" disabled>Select Year</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="mb-6">
            <h2 className="mt-3 text-lg font-bold">Modle</h2>
            <select name="model" className='w-full border rounded px-3 py-2 text-gray-700'
            value={model}
            onChange={(e)=> setModel(e.target.value)}>
            <option value="" disabled>Select Model</option>
              <option value="LXi">LXi</option>
              <option value="VXi">VXi</option>
              <option value="Zxi">Zxi</option>
              <option value="Zxi+">Zxi+</option>
            </select>
          </div>
            
          <div className=" mb-6   ">
            <h2 className='font-semibold text-lg mb-2' > Describe the issue you'r having with your vehicle</h2>
          <textarea name="description" className='w-full border px-3 py-2 h-24 text-gray-700 rounded' 
          placeholder='Enter a description of your issue'
          value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
          </div>

      
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
                 </div>

                   <div className="mt-3 px-1 flex justify-center ">
                     <button 
                     onClick={()=>handlevehicledetails()}
                    disabled={!make || !model || !year}
                     className= {`btn-primary ${!make || !year || !model ? "opacity-50 cursor-not-allowed" : "" } `}
                    >
                       continue to contact info <FontAwesomeIcon icon={faArrowRight} />
                     </button>
                   </div>
        
    
      </div>
    </div>
  )
}

export default Vehicle