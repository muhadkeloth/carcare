import React, { useEffect, useState } from 'react'
import Table from '../../../reuseComponents/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../../reuseComponents/Modal'
import OrderDetails from './OrderDetails'
import { PickupsDetails } from '../../../utilities/interface'
import { fetchAllPickupsByUser } from '../../../../services/userService'
import { formatDate, ToastActive } from '../../../utilities/functions'
import { DropMotionWrapper } from '../../../reuseComponents/ui/MotionWrapper '

const Pickups:React.FC = () => {
  const [pickups, setPickups] = useState<PickupsDetails[]>([]);
  const [tableInputs, setTableInputs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PickupsDetails | null>(null);

  const fetchPickupsByUser = async (page: number) => {
    try {
      const { data } = await fetchAllPickupsByUser(page);
      if (!data || !data.pickupsData)
        throw new Error("pickup details not found");
      setTableInputs(data.pickupsData?.map((pickup:PickupsDetails) => {
        return {
          _id:pickup?._id,
          username:pickup?.userDetails?.firstName,
          vehicle:(()=> {
            const {description, ...vehicledetails} = pickup?.vehicleDetails || {};
            return vehicledetails;
          })(),
          shedule:{...pickup?.shedule,date:formatDate(pickup?.shedule?.date)},
          amount:pickup?.amount,
          paymentStatus:pickup?.paymentStatus,
          pickupStatus:pickup?.status
        }
      } ))
      setPickups(data.pickupsData);
      setTotalPages(data.totalPages);
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    }
  };

  const tableHeaders = [
    { label: "Customer", key: "username" },
    { label: "Vehicle", key: "vehicle" },
    { label: "Date", key: "shedule" },
    { label: "Amount", key: "amount" },
    { label: "Payment Status", key: "paymentStatus", className:'paymentStatus' },
    { label: "Pickup Status", key: "pickupStatus",className:'bookingStatus' },
  ];


  const handleRowClick = (rowData: PickupsDetails) => {
    const pickupdata =
      pickups.find((pickup) => pickup._id === rowData._id) || null;
    setSelectedOrder(pickupdata);
  };

  const handlesetPickupData = (updatedPickupDetails: PickupsDetails) => {
    setPickups?.((prev) =>
      prev.map((pickup) => 
        pickup._id === updatedPickupDetails._id ? updatedPickupDetails : pickup
      ));
    setSelectedOrder(updatedPickupDetails);
  };
  

  useEffect(() => {
    fetchPickupsByUser(currentPage);
  }, [currentPage]);


  return (
    <DropMotionWrapper>
    <h2 className="text-2xl font-bold mb-4 text-gray-800">
      Pickup Management
    </h2>

    <Table headers={tableHeaders} data={tableInputs} onRowClick={handleRowClick}/>

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

    <Modal
      isOpen={selectedOrder !== null}
      onClose={() => setSelectedOrder(null)}
      title={`Repair Pickup `}
    >
      {selectedOrder && (
        <OrderDetails
        bookingDetails={selectedOrder}
        handlesetPickupData={handlesetPickupData}
        />
      )}
    </Modal>
  </DropMotionWrapper>
  )
}

export default Pickups