import React, { useState } from 'react'
import NavLogin from './NavLogin'
import carlogo from '../../assets/images/CarCare-white.png';
import { useNavigate } from 'react-router-dom';
import { navigateLogin, navigateOtpValidate } from '../utilities/navigate';
import { emailValidation } from '../utilities/validation';
import axios from 'axios';


const ForgotPass:React.FC = () => {
    const [email,setEmail] = useState('')
    const [emailError,setEmailError] = useState('')
    const navigate = useNavigate()


    const handleForgotPass = async (event:React.FormEvent) => {
      event.preventDefault();
      const emailvalidation = emailValidation(email)
      if(emailvalidation){ setEmailError(emailvalidation);return; }
      else{ setEmailError('') }

      try{
        const response = await axios.post('http://192.168.1.3:3000/otpgenerate',{ email })
        if(response.status == 201){
          navigateOtpValidate(navigate,email )
        }
      }catch(error){
        if(axios.isAxiosError(error)){
          console.error(error.response?.data.message)
        }
      }

    }

  return (
    <div>
         <NavLogin />
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
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            GET OTP
          </button>
        <p className='text-center mt-3'>Back to{' '}
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' onClick={()=>navigateLogin(navigate)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ForgotPass