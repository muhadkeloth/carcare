import React, { useState } from 'react'
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';
import { navigateLogin } from '../utilities/navigate';
import { useLocation, useNavigate } from 'react-router-dom';
import { passwordConfirmValidation, passwordValidation } from '../utilities/validation';
import axios from 'axios';



const SetPassword:React.FC = () => {
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [passwordError,setPasswordError] = useState('')
    const [confirmPasswordError,setConfirmPasswordError] = useState('')
    const navigate = useNavigate()
    const location = useLocation();
    const { email } = location.state || {};

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
        const response = await axios.post('http://192.168.1.3:3000/resetPassword',{email,password});
        if(response.status == 201){
          navigateLogin(navigate);
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
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' onClick={()=>navigateLogin(navigate)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SetPassword