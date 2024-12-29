import React, { useEffect, useState } from 'react'
import { fetchBrokerageTable } from '../../../../services/adminService';
import { formatDate, ToastActive } from '../../../utilities/functions';
import { PickupsDetails } from '../../../utilities/interface';
import Table from '../../../reuseComponents/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {motion} from 'framer-motion'
import { ZoomInMotionWrapper } from '../../../reuseComponents/ui/MotionWrapper ';


const BookingBrockerage:React.FC = () => {
      const [tableInputs, setTableInputs] = useState<any[]>([]);
          const [currentPage, setCurrentPage] = useState(1);
          const [totalPages, setTotalPages] = useState(1);
        
            const fetchBrokerage = async (page: number) => {
              try {
                const { data } = await fetchBrokerageTable(page,'booking');
                if (!data )
                  throw new Error("brokerage details not found");
    
                setTableInputs(data.brokerageData?.map((pickup:PickupsDetails) => {
                  return {
                    _id:pickup?._id,
                    username:pickup?.userDetails?.firstName,
                    shopName:(()=>{
                        if(typeof pickup?.shopId !== 'string'){
                            return pickup?.shopId?.shopName;
                        }
                    })(),
                    shedule:{...pickup?.shedule,date:formatDate(pickup?.shedule?.date)},
                    amount:pickup?.amount,
                    brockerage:pickup?.amount * 0.2
                  }
                } ))
                setTotalPages(data.totalPages);
              } catch (error) {
                const errorMessage = (error as Error).message;
                ToastActive("error", errorMessage);
              }
            };
    
          const tableHeaders = [
            { label: "Customer", key: "username" },
            { label: "Shop", key: "shopName" },
            { label: "Date", key: "shedule" },
            { label: "Amount", key: "amount" },
            { label: "Brokerage", key: "brockerage" },
          ];
    
           useEffect(() => {
              fetchBrokerage(currentPage);
            }, [currentPage]);
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Brokerage History
      </h2>
      <ZoomInMotionWrapper>
        <Table headers={tableHeaders} data={tableInputs} />

        <div className="flex justify-center items-center mt-4">
          <button
            disabled={currentPage === 1}
            className="btn-primary disabled:bg-gray-200"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <span className="text-sm mx-2 text-gray-600">
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>
          <button
            disabled={currentPage === totalPages}
            className="btn-primary disabled:bg-gray-200"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </ZoomInMotionWrapper>
    </>
  );
}

export default BookingBrockerage