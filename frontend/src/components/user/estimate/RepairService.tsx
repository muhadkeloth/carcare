import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { setEstimateWorkDetails } from '../../../features/estimateSlice';
import { BookingProps } from '../../utilities/interface';
import { HoverMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';

const RepairService:React.FC<BookingProps> = ({setActiveSection}) => {
  const { shopdetails } = useSelector((state: RootState) => state.estimate.estimateDetails) || {};
  const dispatch = useDispatch();

    const handlelocation = (work:any) => {
      dispatch(setEstimateWorkDetails(work))
      setActiveSection('Estimate')
    }

  return (
    <div className="flex justify-center p-5 pt-2">
      <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12 flex-col mt-24 items-center">
        <h2 className="text-5xl font-semibold">Choose Repair Service</h2>
        <div className="mt-10 w-full ">
          <div className="grid grid-cols-1  gap-3">
            {shopdetails?.estimate?.map((work) => (
              <HoverMotionWrapper key={work.work} >
              <div
                key={work.work}
                onClick={() => handlelocation(work)}
                className="border rounded-lg shadow-md cursor-pointer flex items-center hover:shadow-sm"
              >
                <div className="w-full px-3 my-4 ">
                  <h3 className="flex justify-between text-lg font-semibold">
                    {work.work}
                    <button className="text-sm text-mainclr-600 Hover:text-mainclr-400 hover:underline cursor-pointer">
                      Select
                    </button>
                  </h3>
                </div>
              </div>
              </HoverMotionWrapper>
            ))}
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
        </div>
      </div>
    </div>
  );
}

export default RepairService