import React, { useState } from 'react'
import { estimateProps } from '../estimate/Locationfind'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { setPickCarVehicleDetails } from '../../../features/pickMyCarSlice'
import { fetchModeldetail } from '../../../services/userService'
import { HttpStatusCode } from '../../utilities/interface'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { ToastActive } from '../../utilities/functions'

const Vehicle:React.FC<estimateProps> = ({setActiveSection}) => {
  const [make,setMake] = useState('')
  const [year,setYear] = useState('')
  const [model,setModel] = useState('')
  const [description, setDescription] = useState('');
  const [modelDetails, setModelDetails] = useState([]);
  const dispatch = useDispatch();
  const shopdetails = useSelector((state:RootState)=>state.pickMyCar.PickCarDetails?.shopdetails );


  const handlevehicledetails = () => {
    if(make && model && year){
      dispatch(setPickCarVehicleDetails({make,model,year,description}))
      setActiveSection('ContactInfo')     
    }else{
        ToastActive('error','please fill form')
    }
  }

  const handleMakeChange = async (e:React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value)
    try {
      const response = await fetchModeldetail(shopdetails?._id as string,e.target.value);
      if(response.status !== HttpStatusCode.SUCCESS){
        throw new Error('models not find by brand')
      }      
      setModelDetails(response.data.models)
    } catch (error) {
      console.log('error in find model details',error);
    }
  }


  return (
    <div className="flex justify-center pt-2 gap-4">
      <div className="border rounded-lg flex flex-col">
        <h1 className="text-2xl border-b py-6 px-14 font-semibold">
          Tell us about your vehicle
        </h1>
        <div className="p-6  ">
          <div className=" mb-6">
            <h2 className="text-lg font-bold mb-2">Make</h2>
            <select name="make"className="w-full border rounded px-3 py-2 text-gray-700"
            value={make}
            onChange={(e)=>handleMakeChange(e)}>
              <option value="" disabled>Select Make</option>
              {shopdetails?.vehicleIds && shopdetails.vehicleIds.length > 0  && (
                shopdetails?.vehicleIds.map(vehicle => (
                  <option key={vehicle.brand} value={vehicle.brand}>{vehicle.brand}</option>
                ))
              )}              
            </select>
            {!shopdetails?.vehicleIds || shopdetails.vehicleIds.length == 0 &&
            <p className='text-red-500 text-sm font-light'>shop not registered any vehicle</p>
            }
          </div>
          <div className="mb-6">
            <h2 className="mt-3 text-lg font-bold">Modle</h2>
            <select name="model" className='w-full border rounded px-3 py-2 text-gray-700'
            value={model}
            onChange={(e)=> setModel(e.target.value)}>
            <option value="" disabled>Select Model</option>
              {modelDetails.length > 0  && (
                modelDetails.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))
              )}  
            </select>
            {make.length > 0 && modelDetails.length == 0 &&
            <p className='text-red-500 text-sm font-light'>brand not have any models.</p>
            }
          </div>
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-bold">Year</h2>
            <select name="year" className='w-full border rounded px-3 py-2 text-gray-700'
            value={year}
            onChange={(e)=> setYear(e.target.value)}>
              <option value="" disabled>Select Year</option>
              {Array.from({ length: 2024 - 2010 + 1 }, (_, i) => 2010 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                  </option>
                ))}
            </select>
          </div>
            
          <div className=" mb-6   ">
            <h2 className='font-semibold text-lg mb-2' > Describe the issue you'r having with your vehicle</h2>
          <textarea name="description" className='w-full border px-3 py-2 h-24 text-gray-700 rounded' 
          placeholder='Enter a description of your issue'
          value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
          </div>
        {!shopdetails?.vehicleIds || shopdetails.vehicleIds.length == 0 ? (
          <button type="button" onClick={()=>setActiveSection('Workshop')  }
            className={` btn-primary w-full end-2.5 bottom-2.5  `} >
             <FontAwesomeIcon icon={faArrowLeft} /> choose another workshop
          </button>
        ):(
          <button type="button"
            onClick={handlevehicledetails}
            className={` btn-primary w-full end-2.5 bottom-2.5 px-4 py-2 `} >
            Add contact info <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}

      
        </div>

      </div>


      {/* <div className="border rounded-lg h-fit p-3  "> */}
        {/* <p className="text-gray-500 text-sm font-semibold uppercase">drop off at</p> */}

{/* start herer */}
    
      {/* <div className="flex pb-4 pt-2 " > */}
  

                 {/* <div className="w-28  rounded overflow-hidden">
                   <img
                     src={shopdetails?.image}
                     alt="shop img"
                     className="w-full h-full object-cover rounded"
                     />
                 </div> */}
   
                 {/* <div className="flex flex-col  ms-3 w-full">
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
                       availability Wed, Oct 15 at 8 am
                     </h6>
   
                 </div> */}
                   

               {/* </div> */}

                 {/* <div className='w-full mt-2 ms-1  p-4  border-b pb-3'>
                 <p className="text-gray-500 text-sm font-semibold uppercase">drop off at</p>
                 <p className='text-gray-600'><FontAwesomeIcon icon={faClock} /> {formatDate(shedule?.date)} at {shedule?.time} </p>
                 </div> */}

                   {/* <div className="mt-3 px-1 flex justify-center ">
                     <button 
                     onClick={()=>handlevehicledetails()}
                    disabled={!make || !model || !year}
                     className= {`btn-primary ${!make || !year || !model ? "opacity-50 cursor-not-allowed" : "" } `}
                    >
                       continue to contact info <FontAwesomeIcon icon={faArrowRight} />
                     </button>
                   </div> */}
        
    
      {/* </div> */}
    </div>
  )
}

export default Vehicle