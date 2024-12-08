import React, { useEffect, useState } from 'react'
import Table from '../../../reuseComponents/Table';
import { PickupsDetails } from '../../../utilities/interface';
import { ToastActive } from '../../../utilities/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../reuseComponents/Modal';
import OrderDetails from './OrderDetails';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { fetchAllBookingsByShopId } from '../../../../services/shopService';



const BookingManagement:React.FC = () => {
  const [bookings, setBookings] = useState<PickupsDetails[]>([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<PickupsDetails | null>(null);

  const fetchPickupsByShopId = async(page:number)=>{
    try{
      const { data } = await fetchAllBookingsByShopId(page);
      console.log('data',data)
      if(!data || !data.bookingData) throw new Error('booking details not found')
        setBookings(data.bookingData);
      setTotalPages(data.totalPages);
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }
  }

  const tableHeaders = [
    { label: 'Customer', key: '' },
    { label: 'Vehicle', key: '' },
    { label: 'Date', key: 'shedule' },
    { label: 'Amount', key: 'amount' },
    { label: 'Payment Status', key: 'paymentStatus' },
    { label: 'Pickup Status', key: 'status' },
  ];


  const handleRowClick = (rowData: PickupsDetails) => {
    setSelectedBooking(rowData);
  };

  const handlesetPickupData = (updatedPickpDetails: PickupsDetails) => {
    setBookings?.((prev) =>
      prev.map((pickup) =>
        pickup._id === updatedPickpDetails._id ? updatedPickpDetails : pickup
      )
    );
    setSelectedBooking(updatedPickpDetails);
  };

  useEffect(()=>{
    fetchPickupsByShopId(currentPage)
},[currentPage]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Booking Management
      </h2>

      <Table headers={tableHeaders} data={bookings} onRowClick={handleRowClick} />

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
        isOpen={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        title={`Booking Details `}
      >
        {selectedBooking && (
          <OrderDetails
            bookingDetails={selectedBooking}
            handlesetPickupData={handlesetPickupData}
          />
        )}
      </Modal>
    </>
  );
}

export default BookingManagement