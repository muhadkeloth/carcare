import { faPencilAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const ProfileDetails:React.FC = () => {
    const userDetails = useSelector((state:RootState) => state.user.userDetails)


  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100 ">
        <div className="p-4">
        <h2 className="text-2xl font-bold ms-1 mt-1 mb-4 pe-1 text-gray-800">
          Profile Management
        </h2>

            <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="overflow-x-auto">
              <div className="flex flex-col sm:flex-row my-6 sm:mx-4">

        <div className="relative w-48 h-48">
          {userDetails?.image ? (
            <img
              src={userDetails.image}
              alt="Profile img"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full rounded-full bg-gray-300">
              <FontAwesomeIcon icon={faUserCircle}  className="text-gray-500 text-9xl" />
            </div>
          )}
        </div>
      <div className="flex flex-col flex-grow sm:ms-4">
      <div className="flex flex-col items-center ">
      </div>
   
        <form className="space-y-4 ms-20">
          <div >
            <div>
              <label className="block text-sm font-medium">Profile Name</label>
              <input
                type="text"
                className='w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed'
                placeholder="Enter Shop Name"
                value={userDetails?.username || ''}
                readOnly
                />
            </div>
          </div>

          <div >
          <div>
            <label className="block text-sm font-medium text-gray-400">Email </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              placeholder="user@example.com"
              value={userDetails?.email || ''}
              readOnly
              />
          </div>
          </div>
          <div >
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="number"
                className='w-full border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed'
                placeholder="Enter Phone Number Name"
                value={userDetails?.phoneNumber|| ''}
                readOnly
                />
            </div>
          </div>
         
        </form>
      </div>

      {/* {showConfirmModal && (
        <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to confirm Edit this Profile?
            </h3>
            <div className="flex items-center justify-end">
              <button
                className="btn-secondary mr-2"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveChanges} >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )} */}


    </div>
        
              </div>
            </div>
          </div>
          {/* )} */}
      
    </div>
    </div>
  )
}

export default ProfileDetails