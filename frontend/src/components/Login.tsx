import React, { useState } from 'react';
import NavLogin from './NavLogin';
import carlogo from '../assets/images/CarCare-white.png';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="password">
              Password <a href='#' className='text-maincol opacity-80 hover:underline ml-2'>Forgot your password?</a>
            </label>
            <div className="relative">

            </div>
            <input 
            type="password"
            id="password" 
            placeholder='••••••••••••'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="border border-gray-300 rounded w-full p-2"
            required
            />
          </div>
          <button 
            type="submit" 
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
