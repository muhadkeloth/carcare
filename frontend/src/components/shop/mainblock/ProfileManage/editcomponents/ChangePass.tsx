import React, { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { changePasswordShop } from '../../../../../services/shopService'


const ChangePass:React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentpass, setCurrentpass] = useState('')
  const [confirmpass, setConfirmpass] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if(!currentPassword.trim()){
      setCurrentpass('Current password is required.')
      return
    }else setCurrentpass('')
    if(!newPassword.trim()){
      setConfirmpass('New password is required.')
      return
    }else if(newPassword !== confirmPassword){
      setConfirmpass('Confirm password does not match.')
      return
    }else{
      setConfirmpass('')
    }

    setIsLoading(true);

    try {
      const response = await changePasswordShop({currentPassword, newPassword});
      if (response.data?.success) toast.success("Password changed successfully.");
      if(response.data?.message) toast.error(response.data?.message)
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response: { data: {message?:string}}};
        toast.error(err.response.data.message || "Error changing password");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col mt-4 space-y-4  justify-center items-center">
      <h3 className="font-semibold text-2xl">Change Password</h3>
      <form onSubmit={handleSubmit} className='w-1/3 space-y-4'>
        <div >
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="••••••"
          value={currentPassword}
          onChange={(e)=> setCurrentPassword(e.target.value)}
          />
          {currentpass.length !== 0 && <span className='text-red-500'>{currentpass}</span>}
          </div>
      <div >
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="••••••"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          />
          {confirmpass.length !== 0 && <span className='text-red-500'>{confirmpass}</span>}
      </div>
      <div  >
        <label className="block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="••••••"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />
      </div>
      <button type='submit'
      disabled={isLoading}
      className='w-full btn-primary'>
      {/* className='w-full bg-maincol rounded-md p-2 text-white'> */}
      {isLoading ? (
        <div className="flex justify-center items-center  w-full">
        <ThreeDots height="" color='white' wrapperClass="w-10 h-6"  />
      </div>
      ) : 'Change Password'}
      </button>
          </form>

    </div>

  );
}

export default ChangePass