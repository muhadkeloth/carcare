import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { HttpStatusCode, User } from '../../../utilities/interface';
import { fetchAllUsers, toggleuserStatus } from '../../../../services/adminService';
import { ToastActive } from '../../../utilities/functions';


const UserManagement:React.FC = () => {
  const [users,setUsers] = useState<User[]>([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [toggleId, setToggleId] = useState('')


  const fetchUsers = async(page:number)=>{
    try{
      const usersData = await fetchAllUsers(page);
      if(!usersData || !usersData.users) throw new Error('user data not found')
      setUsers(usersData.users);
      setTotalPages(usersData.totalPages);
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }
  }

  const toggleStatus = async(id:string) =>{
    try{
      const response = await toggleuserStatus(id);
      if(response.status = HttpStatusCode.CREATED){
        const index = users.findIndex(user => user._id == id);
        if(index !== -1){
          const updatedUsers = [...users];
          updatedUsers[index] = { ...updatedUsers[index], isActive: !updatedUsers[index].isActive };
          setUsers(updatedUsers)
        }
        ToastActive('success','status changed successfully')
      }else{
        ToastActive('error','status toggle failed')
      }
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }finally{
      setToggleId('');
      setShowConfirmModal(false);
    }
  }

  useEffect(()=>{
    fetchUsers(currentPage)
  },[currentPage]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>
      {/* convert table reusable */}
      <div className="relative overflow-x-auto shadow-md rounded-lg">sdf
        <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
          <thead className="text-sm text-gray-700 uppercase leading-normal bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-3 px-6" scope="col">
                Username
              </th>
              <th className="py-3 px-6" scope="col">
                Email
              </th>
              <th className="py-3 px-6" scope="col">
                Phone Number
              </th>
              <th className="py-3 px-6" scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95"
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.username}
                  </th>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.phoneNumber}</td>
                  <td
                    onClick={() => {
                      setToggleId(user._id);
                      setShowConfirmModal(true);
                    }}
                    className={`py-3 px-4 hover:cursor-pointer ${
                      user.isActive
                        ? "text-green-600 hover:text-green-400"
                        : "text-red-600 hover:text-red-400"
                    }`}
                  >
                    {user.isActive ? "Active" : "Block"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-3">
                  No user listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button disabled={currentPage === 1} className="btn-primary disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-sm mx-2 text-gray-600"> Page {currentPage} of {totalPages} </span>
        <button disabled={currentPage === totalPages} className="btn-primary disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)) } >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to confirm change user Status?</h3>
            <div className="flex items-center justify-end">
              <button className="btn-secondary mr-2" onClick={() => {setShowConfirmModal(false);setToggleId(""); }} >
                Cancel
              </button>
              <button className="btn-primary" onClick={() => toggleStatus(toggleId)} > Confirm </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement