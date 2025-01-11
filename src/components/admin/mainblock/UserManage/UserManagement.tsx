import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { HttpStatusCode, User } from '../../../utilities/interface';
import { fetchAllUsers, toggleuserStatus } from '../../../../services/adminService';
import { ToastActive } from '../../../utilities/functions';
import Table from '../../../reuseComponents/Table';
import { ZoomInMotionWrapper } from '../../../reuseComponents/ui/MotionWrapper ';
import ConfirmationModal from '../../../reuseComponents/ConfirmationModal';


const UserManagement = () => {
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
      if(response.status == HttpStatusCode.CREATED){
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

  const tableHeaders = [
    { label: 'username', key: 'username' },
    { label: 'email', key: 'email' },
    { label: 'Phone Number', key: 'phoneNumber' },
  ];

  const renderActions = (user: any) => (
    <span onClick={() => { setToggleId(user._id); setShowConfirmModal(true); }}
      className={`cursor-pointer ${ user.isActive
          ? "text-green-600 hover:text-green-400"
          : "text-red-600 hover:text-red-400"}`} >
      {user.isActive ? "Active" : "Block"}
    </span>
  );

  useEffect(()=>{
    fetchUsers(currentPage)
  },[currentPage]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>
      <ZoomInMotionWrapper>
      <Table
        headers={tableHeaders}
        data={users}
        renderActions={renderActions}
      />

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
      </ZoomInMotionWrapper>

      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={()=>{
          setShowConfirmModal(false);
          setToggleId("");
        }}
        onConfirm={()=> toggleStatus(toggleId)}
        title='Are you sure you want to confirm change user Status?'
        actionText='Confirm'
        />

    </>
  );
}

export default UserManagement