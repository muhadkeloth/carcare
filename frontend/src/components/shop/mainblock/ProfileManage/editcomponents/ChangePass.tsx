import React, { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { changePasswordShop } from '../../../../../services/shopService'
import { passwordConfirmValidation, passwordValidation } from '../../../../utilities/validation'
import { ToastActive } from '../../../../utilities/functions'


const ChangePass:React.FC = () => {
  // const [currentPassword, setCurrentPassword] = useState('')
  // const [newPassword, setNewPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  const [input,setInput] = useState({password:'',newPassword:'',confirmPassword:''});
  const [error,setError] = useState<Record<string,string> | null>(null)
  // const [currentpass, setCurrentpass] = useState('')
  // const [confirmpass, setConfirmpass] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError(null)
    const passwordvalidation = passwordValidation(input.password)
    if(typeof passwordvalidation == 'string'){
      setError((prev) => ({...prev,passError:passwordvalidation}))
      return;
    } 
    const newPasswordvalidation = passwordValidation(input.newPassword)
    if(typeof newPasswordvalidation == 'string'){
      setError((prev) => ({...prev,newpassError:newPasswordvalidation}))
      return;
    } 
    if(input.confirmPassword.length === 0 || passwordConfirmValidation(input.newPassword,input.confirmPassword)){
      setError((prev) => ({...prev,confirmPasswordError:'password mismatch or required'}))
      return;
    }
    // if(!currentPassword.trim()){
    //   setCurrentpass('Current password is required.')
    //   return
    // }else setCurrentpass('')
    // if(!newPassword.trim()){
    //   setConfirmpass('New password is required.')
    //   return
    // }else if(newPassword !== confirmPassword){
    //   setConfirmpass('Confirm password does not match.')
    //   return
    // }else{
    //   setConfirmpass('')
    // }

    setIsLoading(true);

    try {
      const response = await changePasswordShop({currentPassword:input.password, newPassword:input.newPassword});
      if (response.data?.success) ToastActive('success',"Password changed successfully.");
      // if(response.data?.message) ToastActive('error',response.data?.message)
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
      // if (typeof error === 'object' && error !== null && 'response' in error) {
      //   const err = error as { response: { data: {message?:string}}};
      //   toast.error(err.response.data.message || "Error changing password");
      // } else {
      //   toast.error("Something went wrong!");
      // }
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
          value={input.password}
          onChange={(e)=> setInput({...input, password:e.target.value})}
          />
          {error?.passError && <span className='text-red-500'>{error?.passError}</span>}
          </div>
      <div >
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="••••••"
          value={input.newPassword}
          onChange={(e)=>setInput({...input, newPassword:e.target.value})}
          />
          {error?.newpassError && <span className='text-red-500'>{error?.newpassError}</span>}
      </div>
      <div  >
        <label className="block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="••••••"
          value={input.confirmPassword}
          onChange={(e)=>setInput({...input, confirmPassword:e.target.value})}
          />
          {error?.confirmPasswordError && <span className='text-red-500'>{error?.confirmPasswordError}</span>}
      </div>
      <button type='submit'
      disabled={isLoading}
      className='w-full btn-primary'>
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