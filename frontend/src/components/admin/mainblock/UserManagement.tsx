import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';


interface User {
  _id: number;
  username: string;
  email: string;
  phoneNumber: string;
  isActive: boolean ;
}

const UserManagement:React.FC = () => {
  const [users,setUsers] = useState<User[]>([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async(page:number)=>{
    try{
      const response = await axios.get(`http://192.168.1.3:3000/admin/users?page=${page}&limit=${itemsPerPage}`);
      console.log('response',response)
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    }catch(error){
      console.error('failed to fetch users:',error)
    }
  }

  const toggleStatus = async(id:number) =>{
    try{
      const response = await axios.patch(`http://192.168.1.3:3000/admin/user/${id}`);
      if(response.status = 200){
        console.log('User status updated successfully:', response.data);
        const index = users.findIndex(user => user._id == id);
        if(index !== -1){
          const updatedUsers = [...users];
          updatedUsers[index] = {
            ...updatedUsers[index],
            isActive: !updatedUsers[index].isActive
          };
          setUsers(updatedUsers)
        }
      }
    }catch(error){

    }
  }

  useEffect(()=>{
    fetchUsers(currentPage)
  },[currentPage]);

  return (
     <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>

      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            {/* <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"> */}
            <tr>
              {/* <th className="py-3 px-4 text-left  border-b border-gray-2000">Username</th> */}
              <th className="py-3 px-6" scope='col'>Username</th>
              <th className="py-3 px-6" scope='col'>Email</th>
              <th className="py-3 px-6" scope='col'>Phone Number</th>
              <th className="py-3 px-6" scope='col'>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user)=>(
            // <tr key={user._id} className="border-b border-gray-200 hover:hg-gray-50 text-gray-700 text-sm">
            <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:opacity-95 dark:hover:opacity-95">
              <th scope='row' className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.username}</th>
              <td className="py-4 px-6">{user.email}</td>
              <td className="py-4 px-6">{user.phoneNumber}</td>
              <td 
              onClick={()=>toggleStatus(user._id)}
              className={`py-3 px-4 hover:cursor-pointer ${user.isActive ? 'text-green-600 hover:text-green-400' : 'text-red-600 hover:text-red-400'}`}>
              {user.isActive ? 'Active' : 'Block' }
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
        onClick={()=>setCurrentPage((prev)=> Math.max(prev-1,1))}
        disabled={currentPage ===1}
        className="px-4 py-2 bg-maincol text-white rounded hover:bg-maincoldark hover:cursor-pointer disabled:bg-gray-2000">
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className='text-sm mx-2 text-gray-600'>
          Page {currentPage} of { totalPages }
        </span>
        <button
        onClick={()=>setCurrentPage((prev)=> Math.min(prev+1,totalPages))}
        disabled={currentPage === totalPages}
         className="px-4 py-2 bg-maincol text-white rounded hover:bg-maincoldark hover:cursor-pointer disabled:bg-gray-200">
          <FontAwesomeIcon icon={faAngleRight} />
         </button>

      </div>
   </>
  )
}

export default UserManagement