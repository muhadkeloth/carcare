import React, { useState } from 'react'
import NavLogin from './NavLogin'
import {  useNavigate } from 'react-router-dom';
import carlogo from '../../assets/images/CarCare-white.png';
import axios, { AxiosError } from 'axios';
import { navigateLogin, navigateOtpValidate } from '../utilities/navigate/common';
import { emailValidation, nameValidation, passwordConfirmValidation, passwordValidation, phoneNumberValidation } from '../utilities/validation';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { ErrorResponse } from '../utilities/interface';
import { fetchSignup } from '../../services/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { setSignupDetails } from '../../features/otpSlice';
import { RootState } from '../../store';


const Signup:React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passError, setPassError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const newUserDetails = useSelector((state:RootState) => state.otp.signupDetails)

    const handleSignup = async (e:React.FormEvent) => {
      e.preventDefault();

      setName(name.trim())
      const namevalidation = nameValidation(name)
      if(namevalidation){
        setNameError(namevalidation)
        return
      }else{ setNameError('') }

      const emailvalidation = emailValidation(email)
      if(emailvalidation){
        setEmailError(emailvalidation);
        return
      }else{ setEmailError('') }

      const phoneNumbervalidation = phoneNumberValidation(phoneNumber)
      if(phoneNumbervalidation){
        setPhoneNumberError(phoneNumbervalidation);
        return
      }else{ setPhoneNumberError('') }

      const passwordvalidation = passwordValidation(password)
      if(passwordvalidation){
        setPassError(passwordvalidation);
        return;
      }else{ setPassError('') }

      const passwordConfirmvalidation = passwordConfirmValidation(password,confirmPassword)
      if(passwordConfirmvalidation){
        setConfirmPasswordError(passwordConfirmvalidation)
        return;
      }else{ setConfirmPasswordError('') }

      try{
        const response = await fetchSignup('/signupOtpGenerate',{email,phoneNumber});
        if(response.status == 201){
          const userData = {
            username:name,
            email,
            phoneNumber,
            password,
            otp:response.data.otp 
          }
          dispatch(setSignupDetails(userData));
          navigateOtpValidate(navigate,email,'userSign' )
        }
      }catch(error){
        if(axios.isAxiosError(error)){
          console.error(error.response?.data.message)
          const err = error as AxiosError<ErrorResponse>;
          const errorMessage = err?.response?.data?.message || 'signup error';  
          toast.error(errorMessage, {
            position: "bottom-right", autoClose: 3000,
            hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true,
            progress: undefined, theme: "dark",
            transition: Bounce,
            });
        }
      }
    }


  return (
    <div>
        <NavLogin />

        {/* <ToastContainer
        limit={2}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
      /> */}
        <ToastContainer />

        <div className="flex items-center justify-center mt-2 ">
        <form onSubmit={handleSignup} className="w-96 p-4 mb-9">
          <div className='flex justify-center mb-5 '>
            <img src={carlogo} className='w-48' alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-2">Sign Up</h2>
          <div className="mb-2">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input 
              type="name" 
              id="name" 
              placeholder='enter user name'
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="border border-gray-300 rounded w-full p-2 "
              style={nameError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{nameError}</span>

          </div>
          <div className="mb-2">
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
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{emailError}</span>


          </div>
          <div className="mb-2">
            <label className="block text-gray-700 mb-2" htmlFor="number">
              Phone Number
            </label>
            <input 
              type="number" 
              id="number" 
              placeholder='+91 0000 000 000'
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="border border-gray-300 rounded w-full p-2 appearance-none"
              style={phoneNumberError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{phoneNumberError}</span>


          </div>
          <div className="mb-2">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="password">
               Password 
            </label>

            <input 
            type="password"
            id="password" 
            placeholder='••••••••••••'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="border border-gray-300 rounded w-full p-2"
            style={passError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
             <span className='block text-red-600 opacity-80 font-extralight text-end pe-2'>{passError}</span>

          </div>
          <div className="mb-2">
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
            <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{confirmPasswordError}</span>
          </div>
          <button 
            type="submit" 
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            Sign Up
          </button>
        <p className='text-center mt-3'>Have Account?  {" "}
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' onClick={()=>navigateLogin(navigate,'user')}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup