import React, { useState } from 'react'
import { estimateProps } from '../estimate/Locationfind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setPickCaruserdetails } from '../../../features/pickMyCarSlice';
import { handleInputValue } from '../../utilities/validation';
import { RootState } from '../../../store';

const ContactInfo:React.FC<estimateProps> = ({setActiveSection}) => {
    const userfromRedux = useSelector((state:RootState)=>state.user.userDetails)
    const [userdetails, setUserdetails] = useState<{
        firstName:string;lastName:string;email:string;phoneNumber:string;
      }>({
        firstName:userfromRedux?.username ||'',
        lastName:'',email:userfromRedux?.email || '',
        phoneNumber:userfromRedux?.phoneNumber || ''
      });
      const dispatch = useDispatch()
      const handleSaveChanges = async () => {
        dispatch(setPickCaruserdetails(userdetails))
        setActiveSection('Time')
      }
    

      return (
    <div className="flex justify-center pt-2 gap-4">
    <div className="border rounded-lg flex flex-col">
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
                className='w-full border rounded-md p-2'
                placeholder="Enter first Name"
                value={userdetails?.firstName }
                onChange={(e) => setUserdetails({...userdetails,firstName: e.target.value})}
                />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                className='w-full border rounded-md p-2'
                placeholder="Enter last Name"
                value={userdetails?.lastName}
                onChange={(e) => setUserdetails({...userdetails,lastName: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              className='w-full border  rounded-md p-2'
              placeholder="user@example.com"
              value={userdetails?.email }
              onChange={(e) => setUserdetails({...userdetails,email: e.target.value})}
              />
          </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                className='w-full border rounded-md p-2'
                placeholder="Enter Phone Number Name"
                value={userdetails?.phoneNumber}
                onChange={(e) => handleInputValue(e,10) && setUserdetails({...userdetails,phoneNumber: e.target.value})}
                />
            </div>
                   <button 
                   onClick={()=>handleSaveChanges()}
                  disabled={userdetails.firstName.trim().length ==0 || userdetails.lastName.trim().length ==0 || userdetails.email.trim().length ==0 || userdetails.phoneNumber.trim().length !==10}
                   className= {`btn-primary w-full ${userdetails.firstName.trim().length ==0|| userdetails.lastName.trim().length ==0 || userdetails.email.trim().length ==0 || userdetails.phoneNumber.trim().length !==10 ? "opacity-50 cursor-not-allowed" : "" } `}
                  >
                     continue to Select time <FontAwesomeIcon icon={faArrowRight} />
                   </button>
        </form>

      </div>
    </div>
  </div>
  )
}

export default ContactInfo