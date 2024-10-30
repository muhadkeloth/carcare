import React, { useState } from 'react';
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { emailValidation, passwordValidation } from '../utilities/validation';
import { handleForgotPass, handleSignUpClick } from '../utilities/navigate';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();

    const emailvalidation = emailValidation(email)
    if(emailvalidation){
      setEmailError(emailvalidation);
      return
    }else{ setEmailError('') }
    const passwordvalidation = passwordValidation(password)
    if(passwordvalidation){
      setPassError(passwordvalidation);
      return;
    }else{ setPassError('') }

    try{
      const response = await axios.post("http://192.168.1.3:3000/login",{
        email,password,
      });
      console.log('frontend response',response)
      const token = response.data.token;
      localStorage.setItem('token',token);
      navigate('/');
    }catch(error){
      console.log('login failed:',error)
    }
  };



  return (
    <>
      <NavLogin />
      <div className="flex items-center justify-center mt-5 ">
        <form onSubmit={handleLogin} className="w-96 p-6">
          <div className='flex justify-center mb-5 mt-2'>
            <img src={carlogo} className='w-48' alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
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
          <div className="mb-4">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="password">
              Password
               <span onClick={()=>handleForgotPass(navigate)} className='text-maincol opacity-80 hover:underline hover:cursor-pointer ml-2'>Forgot your password?</span>
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
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{passError}</span>
          </div>
          <button 
            type="submit" 
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            Login
          </button>
        <p className='text-center mt-3'>Don't have an account?{" "} 
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' onClick={()=>handleSignUpClick(navigate)}>Sign Up</span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
