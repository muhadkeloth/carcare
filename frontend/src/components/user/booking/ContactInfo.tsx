import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight,faCar,faClock,faStar,} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setuserdetails } from "../../../features/bookingSlice";
import { handleInputValue } from "../../utilities/validation";
import { BookingProps } from "../../utilities/interface";
import { formatDate } from "../../utilities/functions";
import DropOffTemp from "../../reuseComponents/DropOffTemp";
import { DropMotionWrapper } from "../../reuseComponents/ui/MotionWrapper ";

const ContactInfo: React.FC<BookingProps> = ({ setActiveSection }) => {
  const userfromRedux = useSelector((state: RootState) => state.user.userDetails);
  const [userdetails, setUserdetails] = useState<{firstName: string;lastName: string;email: string;phoneNumber: string;}>({
    firstName: userfromRedux?.username || "",lastName: "",email: userfromRedux?.email || "",phoneNumber: userfromRedux?.phoneNumber || "",
  });
  const dispatch = useDispatch();
  const shopdetails = useSelector((state: RootState) => {
    return state.estimate.estimateDetails
      ? state.estimate.estimateDetails.shopdetails
      : state.bookingdetails.bookingDetails?.shopdetails;
  });

  const { shedule, vehicleDetails } = useSelector((state: RootState) => state.bookingdetails.bookingDetails) || {};

  const handleSaveChanges = async () => {
    dispatch(setuserdetails(userdetails));
    setActiveSection("Summary");
  };


  return (
    <DropMotionWrapper className="flex flex-col sm:flex-row justify-center pt-2 gap-4">
      <div className="border rounded-lg flex flex-col sm:w-1/2 lg:w-1/3">
        <h1 className="text-2xl border-b py-6 px-14 font-semibold">
          Contact Information
        </h1>
        <div className="p-4 mt-4">
          <form className="space-y-4 m-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter first Name"
                  value={userdetails?.firstName}
                  onChange={(e) =>
                    setUserdetails({
                      ...userdetails,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Enter last Name"
                  value={userdetails?.lastName}
                  onChange={(e) =>
                    setUserdetails({ ...userdetails, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                className="w-full border  rounded-md p-2"
                placeholder="user@example.com"
                value={userdetails?.email}
                onChange={(e) =>
                  setUserdetails({ ...userdetails, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Enter Phone Number Name"
                value={userdetails?.phoneNumber}
                onChange={(e) =>
                  handleInputValue(e, 10) &&
                  setUserdetails({
                    ...userdetails,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </div>
          </form>
        </div>
      </div>

      <div className="border rounded-lg h-fit p-3 sm:w-1/2 md:w-2/5 lg:w-1/3 mt-4 sm:mt-0 ">
        {/* <p className="text-gray-500 text-sm font-semibold uppercase">
          drop off at
        </p> */}


        {/* <div className="flex pb-4 pt-2 ">
          <div className="w-28  rounded overflow-hidden">
            <img
              src={shopdetails?.image}
              alt="shop img"
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex flex-col  ms-3 w-full">
            <div className="flex  justify-between">
              <h2 className=" max-w-full break-words whitespace-normal text-base font-medium  text-gray-900">
                {shopdetails?.shopName &&
                  shopdetails?.shopName[0].toUpperCase() +
                    shopdetails?.shopName.slice(1)}
              </h2>
              <p className="text-gray-500 text-sm">
              {shopdetails?.rating && (
                        <>
                        <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-400"
                        />{" "}
                      {(shopdetails.rating.ratingSum / shopdetails.rating.count).toFixed(1)} ({shopdetails.rating.count})
                        </>
                      )}
              </p>
            </div>
            <span className="mt-3 max-w-full break-words whitespace-normal text-sm  text-gray-600">
              {shopdetails?.address &&
                Object.values(shopdetails?.address).join(" ")}
            </span>
            <span className="mt-3 text-sm  text-gray-600">
              {shopdetails?.phoneNumber}
            </span>

            <h6 className="mt-3 text-sm  text-gray-600">
              availability Wed, Oct 15 at 8 am
            </h6>
          </div>
        </div> */}

        {/* <div className="w-full mt-2 ms-1  p-4  border-b pb-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            drop off at
          </p>
          <p className="text-gray-600">
            <FontAwesomeIcon icon={faClock} /> {formatDate(shedule?.date)} at{" "}
            {shedule?.time}{" "}
          </p>
          <p className="text-gray-600">
            <FontAwesomeIcon icon={faCar} />{" "}
            {`${vehicleDetails?.make}, ${vehicleDetails?.model} ${vehicleDetails?.year}`}{" "}
          </p>
          <p className="text-gray-600">
            {vehicleDetails?.description && vehicleDetails.description}{" "}
          </p>
        </div> */}
        <DropOffTemp shopdetails={shopdetails} shedule={shedule} vehicleDetails={vehicleDetails} />
        <div className="mt-3 px-1 flex justify-center ">
          <button
            onClick={() => handleSaveChanges()}
            disabled={
              userdetails.firstName.trim().length == 0 ||
              userdetails.lastName.trim().length == 0 ||
              userdetails.email.trim().length == 0 ||
              userdetails.phoneNumber.trim().length !== 10
            }
            className={`btn-primary ${
              userdetails.firstName.trim().length == 0 ||
              userdetails.lastName.trim().length == 0 ||
              userdetails.email.trim().length == 0 ||
              userdetails.phoneNumber.trim().length !== 10
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            continue to Summary <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </DropMotionWrapper>
  );
};

export default ContactInfo;
