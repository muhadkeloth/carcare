import React, { useState } from 'react'
import { BookingDetailsProps, Shop } from '../../../utilities/interface'
import { formatDate, ToastActive } from '../../../utilities/functions';
import { textValidation } from '../../../utilities/validation';
import { cancelpickupStatus, findChatRoom, updateFeedback } from '../../../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faClock, faComment, faCreditCard, faIndianRupee, faMessage, faScrewdriverWrench, faStar, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Elements } from '@stripe/react-stripe-js';
import Payment, { stripePromise } from '../../../reuseComponents/Payment';
import { navigateChatRoom } from '../../../utilities/navigate/userNavigator';
import { useNavigate } from 'react-router-dom';


const OrderDetails:React.FC<BookingDetailsProps> = ({bookingDetails,handlesetPickupData,}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toggleId, setToggleId] = useState("");
    const [inputDetails, setInputDetails] = useState("");
    const [reasonError, setReasonError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating,setRating] = useState(0);
    const [showFeedbackModel,setShowFeedbackModel] = useState(false)
    const [feedbackInput, setFeedbackInput] = useState('')
    const [feedbackError,setFeedbackError] =useState({rating:'',feedback:''})
    const navigate = useNavigate();

  const cancelPickupStatus = async (pickupId: string, status: string,reason:string = '') => {
    try {
      const response = await cancelpickupStatus(pickupId, status,reason);
      response.data.updatedPickpDetails &&
        handlesetPickupData &&
        handlesetPickupData(response.data.updatedPickpDetails);
      ToastActive("success", "status changed successfully");
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    } finally {
      setToggleId("");
      setShowConfirmModal(false);
    }
  };

  const handleCancel = () => {
    setReasonError('');
    setInputDetails(inputDetails.trim())
    if(textValidation(inputDetails)){
      setReasonError("reason must be at least 4 characters long.");
      return
    }
    cancelPickupStatus(toggleId, "CANCELED",inputDetails)
  }

  const handleFeedbackSubmit = async() => {
    setFeedbackError({rating:'',feedback:''});
    if(feedbackInput.trim().length < 4){
      setFeedbackError({...feedbackError,feedback:'please add valuable feedback'});
      return 
    }
    if(!rating){
      setFeedbackError({...feedbackError,rating:'please select Rating'});
      return 
    }
    setRating(0);
    try {
      const response = await updateFeedback(toggleId,rating,feedbackInput.trim(),'pickup');
      response.data.updatedPickpDetails &&
        handlesetPickupData &&
        handlesetPickupData(response.data.updatedPickpDetails);
      ToastActive("success", "status changed successfully");
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    }finally {
      setToggleId("");
      setShowFeedbackModel(false);
    }
  }

     const handleChat = async () => {
       if(typeof bookingDetails?.shopId !== "string"){
         const response = await findChatRoom(bookingDetails?.shopId?._id || '');
         if(!response) throw new Error('error to create room')
         console.log('response',response.data.chatRooms);
         navigateChatRoom(navigate,response.data.chatRooms._id)
       }
     }

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center space-x-2 mb-4">
            <FontAwesomeIcon icon={faCar} />
            <h3 className="text-lg font-semibold">Vehicle Details</h3>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Make:</span>{" "}
              {bookingDetails?.vehicleDetails?.make}
            </p>
            <p>
              <span className="font-medium">Model:</span>{" "}
              {bookingDetails?.vehicleDetails?.model}
            </p>
            <p>
              <span className="font-medium">Year:</span>{" "}
              {bookingDetails?.vehicleDetails?.year}
            </p>
            {bookingDetails?.vehicleDetails?.description && (
              <p>
                <span className="font-medium">Description:</span>{" "}
                {bookingDetails?.vehicleDetails.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <FontAwesomeIcon icon={faClock} />
            <h3 className="text-lg font-semibold">Appointment Time</h3>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Date:</span>{" "}
              {formatDate(bookingDetails?.shedule?.date)}
            </p>
            <p>
              <span className="font-medium">Time:</span>{" "}
              {bookingDetails?.shedule?.time}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {typeof bookingDetails?.shopId !== "string" &&
              bookingDetails?.shopId?.image ? (
                <img
                  src={bookingDetails?.shopId?.image}
                  alt="user img"
                  className=" w-8 h-8 rounded-full"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}{" "}
              <h3 className="text-lg font-semibold">Shop Details</h3>
            </div>
            <button onClick={handleChat} className="btn-primary p-2">
              <FontAwesomeIcon icon={faMessage} /> Contact us
            </button>
          </div>
          <div className="space-y-2 mb-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {typeof bookingDetails?.shopId !== "string" &&
                bookingDetails?.shopId?.shopName}{" "}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {typeof bookingDetails?.shopId !== "string" &&
                bookingDetails?.shopId?.email}
            </p>
          </div>
          <div className="space-y-2 ">
            <p className="font-medium text-gray-500">User Address</p>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {bookingDetails?.userDetails?.firstName}{" "}
              {bookingDetails?.userDetails?.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {bookingDetails?.userDetails?.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {bookingDetails?.userDetails?.phoneNumber}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <FontAwesomeIcon icon={faScrewdriverWrench} />
            <h3 className="text-lg font-semibold">Repair Details</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 italic">No repair work specified</p>
            {bookingDetails?.paymentStatus && (
              <>
                <p>
                  <span className="font-medium ">Amount: </span>
                  <FontAwesomeIcon icon={faIndianRupee} />{" "}
                  {bookingDetails.amount.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>
                  <span
                    className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold
                ${
                  bookingDetails.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-800"
                    : bookingDetails.paymentStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : bookingDetails.paymentStatus === "FAILED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                  >
                    {bookingDetails.paymentStatus}
                  </span>
                  {bookingDetails?.paymentStatus !== "PAID" &&
                    bookingDetails?.status !== "CANCELED" && (
                      <Elements stripe={stripePromise}>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="p-0 px-2 btn-primary"
                        >
                          <FontAwesomeIcon icon={faCreditCard} /> Pay now
                        </button>
                        <Payment
                          isOpen={isModalOpen}
                          closeModal={closeModal}
                          methodofBooking="pickup"
                          bookingDetails={{
                            _id: bookingDetails._id,
                            shopdetails: bookingDetails?.shopId as Shop,
                            shedule: bookingDetails?.shedule,
                            vehicleDetails: bookingDetails?.vehicleDetails,
                            userDetails: bookingDetails?.userDetails,
                            locationdetails: bookingDetails?.locationdetails,
                          }}
                        />
                      </Elements>
                    )}
                </p>
                <p>
                  <span className="font-medium">Pickup Status:</span>
                  <span
                    className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold
                ${
                  bookingDetails.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : bookingDetails.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : bookingDetails.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800"
                    : bookingDetails.status === "CANCELED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                  >
                    {bookingDetails.status}
                  </span>
                  {bookingDetails?.status == "CANCELED" &&
                    bookingDetails?.paymentFailDetails && (
                      <>
                        <p>
                          <span className="font-medium ">Canceled By: </span>
                          {bookingDetails.paymentFailDetails.actionFrom ==
                          "shop"
                            ? "workshop"
                            : "user"}
                        </p>
                        <p>
                          <span className="font-medium ">Reason: </span>
                          {bookingDetails.paymentFailDetails.reason}
                        </p>
                      </>
                    )}
                  {!["COMPLETED", "CANCELED"].includes(
                    bookingDetails.status
                  ) && (
                    <div className="inline-flex space-x-2 ml-2">
                      <button
                        onClick={() => {
                          setToggleId(bookingDetails._id);
                          setShowConfirmModal(true);
                        }}
                        className="btn-secondary p-0 px-2"
                      >
                        <FontAwesomeIcon icon={faX} /> cancel
                      </button>
                    </div>
                  )}
                  {bookingDetails.status === "COMPLETED" &&
                  !bookingDetails.review ? (
                    <div className="inline-flex space-x-2 ml-2">
                      <button
                        onClick={() => {
                          setToggleId(bookingDetails._id);
                          setShowFeedbackModel(true);
                        }}
                        className="mt-2 bg-yellow-400 text-white py-1 rounded  px-2 hover:bg-yellow-600 "
                      >
                        <FontAwesomeIcon icon={faComment} /> write feedback
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="py-1">
                        <span className="font-medium ">Rating: </span>
                        {typeof bookingDetails?.review?.rating === "number" &&
                          [...Array(5)].map((_, star) => {
                            star++;
                            return (
                              <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                                className={`cursor-pointer text-1xl  mr-1 ${
                                  star <=
                                  (bookingDetails?.review?.rating as number)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          })}
                      </p>
                      <p>
                        <span className="font-medium ">Feedback: </span>
                        {bookingDetails.review?.feedback}
                      </p>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        {bookingDetails?.locationdetails && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-lg font-semibold">Location Details</h3>
            </div>
            <p className="mb-4">
              {bookingDetails?.locationdetails?.description}{" "}
            </p>
            <div className="h-48 rounded-lg overflow-hidden">
              <MapContainer
                center={bookingDetails?.locationdetails?.coordinates}
                zoom={13}
                className="h-72 w-full z-10"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={
                    bookingDetails?.locationdetails?.coordinates || [0, 0]
                  }
                >
                  <Popup>{bookingDetails?.locationdetails?.description}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="flex justify-between text-lg font-bold mb-4">
              Are you sure to Cancel Pickup
              <FontAwesomeIcon
                icon={faX}
                className="cursor-pointer"
                onClick={() => {
                  setShowConfirmModal(false);
                  setToggleId("");
                }}
              />
            </h3>
            <label className="block text-gray-700 mb-2" htmlFor="Reason">
              Reason:
            </label>
            <input
              type="text"
              placeholder="Enter Reason"
              value={inputDetails}
              onChange={(e) => setInputDetails(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 mb-3"
              style={
                reasonError.length !== 0
                  ? { outline: "none", boxShadow: "0 0 0 1px red" }
                  : {}
              }
            />
            <span className="block text-red-600 opacity-80 font-light text-end pe-2">
              {reasonError}
            </span>

            <div className="flex items-center justify-end">
              <button
                className="btn-primary  mr-2"
                onClick={() => {
                  setShowConfirmModal(false);
                  setToggleId("");
                }}
              >
                no thanks
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                confirm cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showFeedbackModel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="flex justify-between text-lg font-bold mb-4">
              Provide Feedback for the Shop
              <FontAwesomeIcon
                icon={faX}
                className="cursor-pointer"
                onClick={() => {
                  setShowFeedbackModel(false);
                  setToggleId("");
                }}
              />
            </h3>

            <label className="block text-gray-700 mb-2" htmlFor="feedback">
              Feedback:
            </label>
            <textarea
              id="feedback"
              placeholder="Enter your feedback"
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 mb-3"
            ></textarea>
            <span className="block text-red-600 opacity-80 font-light text-end pe-2">
              {feedbackError.feedback}
            </span>

            <label className="flex gap-2 text-gray-700 mb-2" htmlFor="rating">
              Rating:
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, star) => {
                  star++;
                  return (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={`cursor-pointer text-2xl mr-1 ${
                        star <= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  );
                })}
              </div>
              <span className="block text-red-600 opacity-80 font-light text-end pe-2">
                {feedbackError.rating}
              </span>
            </label>

            <div className="flex items-center justify-end">
              <button
                className="btn-secondary mr-2"
                onClick={() => {
                  setShowFeedbackModel(false);
                  setToggleId("");
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails