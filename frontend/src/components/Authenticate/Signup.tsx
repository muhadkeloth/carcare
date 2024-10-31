import React, { useState } from 'react'
import NavLogin from './NavLogin'
import { useNavigate } from 'react-router-dom';
import carlogo from '../../assets/images/CarCare-white.png';
import axios from 'axios';
import { navigateLogin } from '../utilities/navigate';
import { emailValidation, nameValidation, passwordConfirmValidation, passwordValidation, phoneNumberValidation } from '../utilities/validation';


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

      const userData = {
        username:name,
        email,
        phoneNumber,
        password,
        confirmPassword,
      }
      try{
        const response = await axios.post('http://192.168.1.3:3000/signup',userData);
        console.log('res',response)
        if(response.status == 201){
          console.log('here')
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
        <div className="flex items-center justify-center mt-2 ">
        <form onSubmit={handleSignup} className="w-96 p-4">
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
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' onClick={()=>navigateLogin(navigate)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup