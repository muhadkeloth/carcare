import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { setEstimateWorkDetails } from '../../../features/estimateSlice';
import { BookingProps, HttpStatusCode } from '../../utilities/interface';
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';
import { estimateFinder } from '../../../services/userService';

const RepairService:React.FC<BookingProps> = ({setActiveSection}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState<{work:string;priceStart:number;priceEnd:number;}|null>(null)
  const { shopdetails } = useSelector((state: RootState) => state.estimate.estimateDetails) || {};
  const dispatch = useDispatch();

  useEffect(()=>{
console.log(service)
  },[service])

    const handleService = async(work:any) => {
        setService(work);
      // console.log(work)
      // const isSelected = service.some((item) => item.work === work.work);
      // if (isSelected) {
      //   setService((prev) => prev.filter((item) => item.work !== work.work));
      // } else {
      //   setService( prev => [...prev, work]);
      // }
    }

    const handlelocation = async() => {
      setIsLoading(true)
      try {
        if(service){
          const response = await estimateFinder(service.work)
          if(response.status !== HttpStatusCode.SUCCESS) throw new Error('estimate find error');
          const {upperBound, lowerBound} = response.data
          const wrk = {work:service.work,priceStart:lowerBound,priceEnd:upperBound}
          dispatch(setEstimateWorkDetails(wrk))
          setActiveSection('Estimate')
        }
      } catch (error) {
        if(service){
          dispatch(setEstimateWorkDetails(service))
          setActiveSection('Estimate')        
        }
      }finally{
        setIsLoading(false);
      }
    }

  return (
    <div
      className={`flex justify-center p-5 pt-2 ${isLoading && "cursor-wait"} `}
    >
      <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12 flex-col mt-8 items-center min-h-[70%]">
        <h2 className="text-5xl font-semibold">Choose Repair Service</h2>
        <div className="mt-10 w-full ">
          <div className="grid grid-cols-1  gap-3">
            {shopdetails?.estimate?.map((work) => {
              // const isSelected = service.some( item => item.work === work.work);
              const isSelected = service?.work === work.work;
              return (
                <HoverMotionWrapper key={work.work}>
                  <div
                    key={work.work}
                    onClick={() => handleService(work)}
                    className={`border rounded-lg shadow-md   flex items-center hover:shadow-sm ${
                      isLoading ? "cursor-wait" : "cursor-pointer"
                    } ${
                      isSelected ? 'bg-mainclr-200' : ''
                    }`}
                  >
                    <div className="w-full px-3 my-4 ">
                      <h3 className="flex justify-between text-lg font-semibold">
                        {work.work}
                        <button className="text-sm text-mainclr-600 Hover:text-mainclr-400 hover:underline cursor-pointer">
                         {isSelected ? 'Unselect' : 'Select'} 
                        </button>
                      </h3>
                    </div>
                  </div>
                </HoverMotionWrapper>
              )} )}
          </div>
          {!shopdetails?.estimate ||
            (shopdetails?.estimate?.length === 0 && (
              <div className="flex flex-col items-center py-4  text-center border">
                <p className="text-gray-500 my-4 ">
                  shops dont have estimates.
                </p>
                <button
                  className="btn-primary  w-1/2"
                  onClick={() => setActiveSection("Workshop")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Change Location
                </button>
              </div>
            ))}
          <HoverMotionWrapper className="mt-5 px-1 flex justify-center">
            <button
              onClick={() => handlelocation()}
              className={`btn-primary w-full ${service === null ? 'cursor-not-allowed' : ''} ${isLoading && "cursor-wait"}`}
              disabled={service == null}
            >
              find estimate
            </button>
          </HoverMotionWrapper>
        </div>
      </div>
    </div>
  );
}

export default RepairService