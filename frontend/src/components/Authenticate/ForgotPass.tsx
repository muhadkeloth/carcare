import React, { useState } from 'react'
import NavLogin from './NavLogin'
import carlogo from '../../assets/images/CarCare-white.png';
import { useNavigate } from 'react-router-dom';
import { navigateLogin, navigateOtpValidate } from '../utilities/navigate/common';
import { emailValidation } from '../utilities/validation';
import axios, { AxiosError } from 'axios';
import { ErrorResponse, HttpStatusCode, RoleProps } from '../utilities/interface';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { fetchForgotPass } from '../../services/apiCall';
import { ThreeDots } from 'react-loader-spinner';


const ForgotPass:React.FC<RoleProps> = ({ role }) => {
    const [email,setEmail] = useState('')
    const [emailError,setEmailError] = useState('')
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleForgotPass = async (event:React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true)
      const emailvalidation = emailValidation(email)
      if(emailvalidation){ setEmailError(emailvalidation);return; }
      else{ setEmailError('') }

      try{
        const url = role == 'user' ? '/otpgenerate' : `/${role}/otpgenerate` ;
        const response = await fetchForgotPass(url,{email, role})
        if(response.status == HttpStatusCode.CREATED){
          navigateOtpValidate(navigate,email,role )
        }
      }catch(error){
        if(axios.isAxiosError(error)){
          console.error(error.response?.data.message)
          const err = error as AxiosError<ErrorResponse>;
        const errorMessage = err?.response?.data?.message || 'error on otp generat.';
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
      }finally{
        setIsLoading(false);
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
        <form onSubmit={handleForgotPass} className="w-96 p-6">
          <div className='flex justify-center mb-5 mt-2'>
            <img src={carlogo} className='w-48' alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">Forgot Password?</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder='email@address.com'
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border border-gray-300 rounded w-full p-2 "
              style={emailError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
            <span className='block text-red-600 font-light opacity-80 text-end pe-2'>{emailError}</span>
          </div>
          <button 
            type="submit" 
            // className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
            className="w-full btn-primary flex justify-center"
          >
            { isLoading ? <ThreeDots height={20} color='white' /> : "GET OTP"}
          </button>
        <p className='text-center mt-3'>Back to{' '}
          <span className='text-mainclr-500 font-medium hover:underline hover:text-mainclr-600 cursor-pointer' onClick={()=>navigateLogin(navigate,role)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ForgotPass