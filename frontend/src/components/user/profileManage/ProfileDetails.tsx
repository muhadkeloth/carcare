import {  faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { DropMotionWrapper } from '../../reuseComponents/ui/MotionWrapper '

const ProfileDetails:React.FC = () => {
    const userDetails = useSelector((state:RootState) => state.user.userDetails)


  return (
    <div className="flex-1 p-1 sm:p-4 bg-gray-100 ">
      <div className="p-4">
        <h2 className="text-2xl font-bold mt-2 mb-4 text-gray-800 text-center sm:text-left">
          Profile Management
        </h2>

        <div className="container mx-auto p-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="overflow-x-auto">
              <div className="flex flex-col sm:flex-row items-center sm:items-start my-6">
                <DropMotionWrapper className="relative w-32 h-32 sm:w-48 sm:h-48 mb-4 sm:mb-0">
                  {userDetails?.image ? (
                    <img
                      src={userDetails.image}
                      alt="Profile img"
                      className="w-full h-full md:rounded-lg rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full rounded-full bg-gray-300">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-gray-500 text-6xl sm:text-9xl"
                      />
                    </div>
                  )}
                </DropMotionWrapper>
                <div className="flex flex-col flex-grow sm:ms-6 w-full">
                  <form className="space-y-4 w-full">
                    <DropMotionWrapper>
                        <label className="block text-sm font-medium">
                          Profile Name
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                          placeholder="Enter Shop Name"
                          value={userDetails?.username || ""}
                          readOnly
                        />
                    </DropMotionWrapper>

                    <DropMotionWrapper>
                        <label className="block text-sm font-medium text-gray-400">
                          Email{" "}
                        </label>
                        <input
                          type="email"
                          className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                          placeholder="user@example.com"
                          value={userDetails?.email || ""}
                          readOnly
                        />
                    </DropMotionWrapper>
                    <DropMotionWrapper>
                        <label className="block text-sm font-medium">
                          Phone Number
                        </label>
                        <input
                          type="number"
                          className="w-full border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
                          placeholder="Enter Phone Number Name"
                          value={userDetails?.phoneNumber || ""}
                          readOnly
                        />
                    </DropMotionWrapper>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails