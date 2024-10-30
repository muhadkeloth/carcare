import React, { useState } from 'react'
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';



const SetPassword:React.FC = () => {
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const handleSetPassword = () => {

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
            required
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
            required
            />
          </div>
          <button 
            type="submit" 
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default SetPassword