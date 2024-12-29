import React, { useEffect, useState } from 'react'
import Table from '../../../reuseComponents/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../../reuseComponents/Modal'
import OrderDetails from './OrderDetails'
import { PickupsDetails } from '../../../utilities/interface'
import { formatDate, ToastActive } from '../../../utilities/functions'
import { fetchAllBookingsByUser } from '../../../../services/userService'
import { DropMotionWrapper } from '../../../reuseComponents/ui/MotionWrapper '

const Bookings:React.FC = () => {
  const [bookings, setBookings] = useState<PickupsDetails[]>([]);
  const [tableInputs, setTableInputs] = useState<any[]>([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<PickupsDetails | null>(null);


  const fetchBookingsByShopId = async(page:number)=>{
    try{
      const { data } = await fetchAllBookingsByUser(page);
      if(!data || !data.bookingData) throw new Error('booking details not found')
        setTableInputs(data.bookingData?.map((booking:PickupsDetails) => {
          return {
            _id:booking?._id,
            username:booking?.userDetails?.firstName,
            vehicle:(()=>{
              const { description, ...vehicledetails} = booking?.vehicleDetails || {};
              return vehicledetails;
            })(),
            shedule:{...booking?.shedule,date:formatDate(booking?.shedule?.date)},
            amount:booking?.amount,
            paymentStatus:booking?.paymentStatus,
            bookingStatus:booking?.status
          }
        } ))
      setTotalPages(data.totalPages);
      setBookings(data.bookingData);
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }
  }

  const tableHeaders = [
    { label: 'Customer', key: 'username' },
    { label: 'Vehicle', key: 'vehicle' },
    { label: 'Date', key: 'shedule' },
    { label: 'Amount', key: 'amount' },
    { label: 'Payment Status', key: 'paymentStatus', className:'paymentStatus' },
    { label: 'Pickup Status', key: 'bookingStatus',className:'bookingStatus' },
  ];


  const handleRowClick = (rowData: PickupsDetails) => {
    const bookingdata = bookings.find((booking) => booking._id === rowData._id) || null;
    setSelectedBooking(bookingdata);
  };

  const handlesetBookingData = (updatedBookingDetails: PickupsDetails) => {
    setBookings?.((prev) =>
      prev.map((booking) =>
        booking._id === updatedBookingDetails._id ? updatedBookingDetails : booking
      )
    );
    setSelectedBooking(updatedBookingDetails);
  };

  useEffect(()=>{
    fetchBookingsByShopId(currentPage)
},[currentPage]);


  return (
    <DropMotionWrapper>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Booking Management
      </h2>

      <Table headers={tableHeaders} data={tableInputs} onRowClick={handleRowClick} />

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
            handlesetPickupData={handlesetBookingData}
          />
        )}
      </Modal>
    </DropMotionWrapper>
  )
}

export default Bookings