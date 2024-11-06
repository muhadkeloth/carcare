import React, { useState } from 'react'
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';
import { navigateHome, navigateLogin } from '../utilities/navigate/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { passwordConfirmValidation, passwordValidation } from '../utilities/validation';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../utilities/interface';
import { Bounce, toast, ToastContainer } from 'react-toastify';



const SetPassword:React.FC = () => {
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [passwordError,setPasswordError] = useState('')
    const [confirmPasswordError,setConfirmPasswordError] = useState('')
    const navigate = useNavigate()
    const location = useLocation();
    const { email,role } = location.state || {};

    const handleSetPassword = async (event:React.FormEvent) => {
      event.preventDefault();

      const passwordvalidation = passwordValidation(password)
      if(passwordvalidation){
        setPasswordError(passwordvalidation)
        return
      }else{ setPasswordError('') } 
      
      const passConfirmvalidation = passwordConfirmValidation(password,confirmPassword)
      if(passConfirmvalidation){
        setConfirmPasswordError(passConfirmvalidation)
        return
      }else{ setConfirmPasswordError('') } 

      try{
        const url = role == 'user' ? '/resetPassword':`/${role}/resetPassword`
        console.log('setpass here',url)
        const response = await axios.post(`${import.meta.env.VITE_ENDPORTFRONT+url}`,{email,password,role});
        if(response.status == 201){
          if(role == 'shop'){
            localStorage.setItem(`${role}_token`,response.data.token);
            navigateHome(navigate,role);
          }else{
            navigateLogin(navigate,role);
          }
        }
      }catch(error){
        console.log('error')
        if(axios.isAxiosError(error)){
          console.error(error.response?.data.message)
          const err = error as AxiosError<ErrorResponse>;
          const errorMessage = err?.response?.data?.message || 'error on reset password';
          toast.error(errorMessage, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
        }
      }
    }

  return (
    <div>
        <NavLogin />

        <ToastContainer
        limit={2}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
      />
      <ToastContainer />

      <div className="flex items-center justify-center mt-5 ">
        <form onSubmit={handleSetPassword} className="w-96 p-6">
          <div className='flex justify-center mb-5 mt-2'>
            <img src={carlogo} className='w-48' alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">Set New Password</h2>
          <div className="mb-4">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="password">
              New Password 
            </label>
            <input 
            type="password"
            id="password" 
            placeholder='••••••••••••'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="border border-gray-300 rounded w-full p-2"
            style={passwordError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input 
            type="password"
            id="confirmPassword" 
            placeholder='••••••••••••'
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="border border-gray-300 rounded w-full p-2"
            style={confirmPasswordError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
          </div>
          <button 
            type="submit" 
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            Reset Password
          </button>
          <p className='text-center mt-3'>Back to  {" "}
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' onClick={()=>navigateLogin(navigate,role)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SetPassword