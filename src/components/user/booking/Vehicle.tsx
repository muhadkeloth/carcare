import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setVehicleDetails } from '../../../features/bookingSlice';
import { fetchModeldetail } from '../../../services/userService';
import { BookingProps, HttpStatusCode } from '../../utilities/interface';
import DropOffTemp from '../../reuseComponents/DropOffTemp';
import { DropMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';


const Vehicle:React.FC<BookingProps> = ({setActiveSection}) => {
  const [make,setMake] = useState('')
  const [year,setYear] = useState('')
  const [model,setModel] = useState('')
  const [description, setDescription] = useState('');
  const [modelDetails, setModelDetails] = useState([]);
  const dispatch = useDispatch();
  const shopdetails = useSelector((state:RootState)=>{
    return state.estimate.estimateDetails 
    ? state.estimate.estimateDetails.shopdetails
    : state.bookingdetails.bookingDetails?.shopdetails;
  } );
  const { shedule } = useSelector((state:RootState)=> state.bookingdetails.bookingDetails) || {};


  const handlevehicledetails = () => {
    if(make && model && year){
      dispatch(setVehicleDetails({make,model,year,description}))
      setActiveSection('ContactInfo')     
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
    <DropMotionWrapper className="flex flex-col sm:flex-row justify-center pt-2 gap-4">
      <div className="border rounded-lg flex flex-col sm:w-1/2 lg:w-1/3">
        <h1 className="text-2xl border-b py-6 px-14 font-semibold">
          Tell us about your vehicle
        </h1>
        <div className="p-6  ">
          <div className=" mb-6">
            <h2 className="text-lg font-bold mb-2">Make</h2>
            <select
              name="make"
              className="w-full border rounded px-3 py-2 text-gray-700"
              value={make}
              onChange={(e) => handleMakeChange(e)}
            >
              <option value="" disabled>
                Select Make
              </option>
              {shopdetails?.vehicleIds &&
                shopdetails.vehicleIds.length > 0 &&
                shopdetails?.vehicleIds.map((vehicle) => (
                  <option key={vehicle.brand} value={vehicle.brand}>
                    {vehicle.brand}
                  </option>
                ))}
            </select>
            {!shopdetails?.vehicleIds ||
              (shopdetails.vehicleIds.length == 0 && (
                <p className="text-red-500 text-sm font-light">
                  shop not registered any vehicle
                </p>
              ))}
          </div>
          <div className="mb-6">
            <h2 className="mt-3 text-lg font-bold">Modle</h2>
            <select
              name="model"
              className="w-full border rounded px-3 py-2 text-gray-700"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="" disabled>
                Select Model
              </option>
              {modelDetails.length > 0 &&
                modelDetails.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
            {make.length > 0 && modelDetails.length == 0 && (
              <p className="text-red-500 text-sm font-light">
                brand not have any models.
              </p>
            )}
          </div>
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-bold">Year</h2>
            <select
              name="year"
              className="w-full border rounded px-3 py-2 text-gray-700"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" disabled>
                Select Year
              </option>
              {Array.from({ length: 2024 - 2010 + 1 }, (_, i) => 2010 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          <div className=" mb-6   ">
            <h2 className="font-semibold text-lg mb-2">
              {" "}
              Describe the issue you'r having with your vehicle
            </h2>
            <textarea
              name="description"
              className="w-full border px-3 py-2 h-24 text-gray-700 rounded"
              placeholder="Enter a description of your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="border rounded-lg h-fit p-3 sm:w-1/2 md:w-2/5 lg:w-1/3 mt-4 sm:mt-0 ">
        <DropOffTemp shopdetails={shopdetails} shedule={shedule} />
        <div className="mt-3 px-1 flex justify-center ">
          <button
            onClick={() => handlevehicledetails()}
            disabled={!make || !model || !year}
            className={`btn-primary ${
              !make || !year || !model ? "opacity-50 cursor-not-allowed" : ""
            } `}
          >
            continue to contact info <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </DropMotionWrapper>
  );
}

export default Vehicle