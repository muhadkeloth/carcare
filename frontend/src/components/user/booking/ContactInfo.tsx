import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setuserdetails } from "../../../features/bookingSlice";
import { handleInputValue } from "../../utilities/validation";
import { BookingProps } from "../../utilities/interface";
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
