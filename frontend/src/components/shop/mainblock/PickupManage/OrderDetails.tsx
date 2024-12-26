import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BookingDetailsProps } from "../../../utilities/interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faClock, faIndianRupee, faMessage, faPencil, faScrewdriverWrench, faUser, faX, } from "@fortawesome/free-solid-svg-icons";
import { formatDate, ToastActive } from "../../../utilities/functions";
import { findChatRoom, togglepickupStatus } from "../../../../services/shopService";
import {  textValidation } from "../../../utilities/validation";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../../../../features/chatSlice";
import { navigateToSection } from "../../../utilities/navigate/common";

const OrderDetails: React.FC<BookingDetailsProps> = ({bookingDetails,handlesetPickupData,}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleId, setToggleId] = useState("");
  const [inputDetails, setInputDetails] = useState("");
  const [reasonError, setReasonError] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const togglePickupStatus = async (pickupId: string, status: string,reason:string = '') => {
    try {
      const response = await togglepickupStatus(pickupId, status,reason);
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
    togglePickupStatus(toggleId, "CANCELED",inputDetails)
  }

  const handleChat = async () => {
    const response = await findChatRoom(bookingDetails?.userId?._id || "");
    if (!response) throw new Error("error to create room");
    dispatch(setActiveChat(response.data.chatRooms._id));
    navigateToSection(navigate,'ChatHistory','shop');
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
              {bookingDetails?.userId?.image ? (
                <img
                  src={bookingDetails?.userId?.image}
                  alt="user img"
                  className=" w-8 h-8 rounded-full"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}{" "}
              <h3 className="text-lg font-semibold">Customer Details</h3>
            </div>
            <button onClick={handleChat} className="btn-primary p-2">
              <FontAwesomeIcon icon={faMessage} /> Contact 
            </button>
          </div>
          <div className="space-y-2 mb-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {bookingDetails?.userId?.username}{" "}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {bookingDetails?.userId?.email}
            </p>
          </div>
          <div className="space-y-2 ">
            <p className="font-medium text-gray-500">Address</p>
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
                    {bookingDetails.paymentStatus.charAt(0).toUpperCase() +
                      bookingDetails.paymentStatus.slice(1)}
                  </span>
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
                  {bookingDetails.paymentStatus === "PAID" &&
                    !["COMPLETED", "CANCELED"].includes(
                      bookingDetails.status
                    ) && (
                      <div className="inline-flex space-x-2 ml-2">
                        <button
                          onClick={() =>
                            togglePickupStatus(
                              bookingDetails._id,
                              bookingDetails?.status == "PENDING"
                                ? "CONFIRMED"
                                : bookingDetails?.status == "CONFIRMED"
                                ? "COMPLETED"
                                : ""
                            )
                          }
                          className="btn-primary p-0 px-2"
                        >
                          <FontAwesomeIcon icon={faPencil} />
                          {bookingDetails?.status == "PENDING"
                            ? "CONFIRM"
                            : bookingDetails?.status == "CONFIRMED"
                            ? "complete"
                            : ""}
                        </button>
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
    </div>
  );
};

export default OrderDetails;
