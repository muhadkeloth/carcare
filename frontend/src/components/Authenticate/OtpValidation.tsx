import React, { useRef, useState } from 'react'
import NavLogin from './NavLogin'
import carlogo from '../../assets/images/CarCare-white.png';
import axios from 'axios';


const OtpValidation:React.FC = () => {
  const [otp,setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError,setOtpError] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const validateOtp = async (otp: string) => {
    try{
      const response = await axios.post('http://192.168.1.3:3000/otpvalidation',{ otp });
      if(response.data.isValid) {
        console.log('OTP validated successfully!');
      }else{
        setOtpError('Invalid OTP. Please try again.')
      }
    }catch(error){
      console.error('OTP validation failed:', error);
      setOtpError('Validation error. Please try again.')
    }
  }

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>, index:number ) => {
    const value = event?.target.value;
    if(/\D/.test(value))return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if(value && index < 5){
      inputRefs.current[index + 1]?.focus();
    }else if(index === 5){
      validateOtp(updatedOtp.join(''))
    }
  }

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>,index:number) => {
    if(event.key === 'Backspace' && !otp[index] && index > 0 ) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div>
       <NavLogin />
      <div className="flex items-center justify-center mt-5 ">
        <form onSubmit={(event)=>event.preventDefault()} className="w-96 p-6">
          <div className='flex justify-center mb-5 mt-2'>
            <img src={carlogo} className='w-48' alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">OTP Verification</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="number">
              Enter Otp send to your email
            </label>
              <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="border border-gray-300 rounded w-12 h-12 text-center text-lg font-semibold"
              style={otpError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}} 
              autoFocus={index === 0}
            />
          ))}
        </div>
        {otpError && <p className="text-red-600 text-center mb-2">{otpError}</p>}
          </div>
          <button 
            type="button" 
            onClick={()=> validateOtp(otp.join(''))}
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            VERIFY OTP
          </button>
        <p className='text-center mt-3'>Don't you receive OTP? {" "}
          <span className='text-maincol font-medium hover:underline hover:cursor-pointer' >Resend OTP **time*</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default OtpValidation


// import React, { useState, useRef } from 'react';
// import axios from 'axios';


  // const [otp, setOtp] = useState<string[]>(Array(6).fill('')); // Array to hold each digit
  // const [otpError, setOtpError] = useState('');
  // const inputRefs = useRef<Array<HTMLInputElement | null>>([]); // Ref for input elements

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  //   const value = e.target.value;
  //   if (/\D/.test(value)) return; // Allow only numbers

  //   const updatedOtp = [...otp];
  //   updatedOtp[index] = value;
  //   setOtp(updatedOtp);

  //   if (value && index < 5) {
  //     inputRefs.current[index + 1]?.focus(); // Move to the next input box
  //   } else if (index === 5) {
  //     validateOtp(updatedOtp.join('')); // Auto-fetch validation on full input
  //   }
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  //   if (e.key === 'Backspace' && !otp[index] && index > 0) {
  //     inputRefs.current[index - 1]?.focus(); // Go back to the previous input on backspace
  //   }
  // };

  // const validateOtp = async (otp: string) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/otpvalidation', { otp });
  //     if (response.data.isValid) {
  //       console.log('OTP validated successfully!');
  //     } else {
  //       setOtpError('Invalid OTP. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('OTP validation failed:', error);
  //     setOtpError('Validation error. Please try again.');
  //   }
  // }

        // <h2 className="text-2xl text-center font-bold mb-4">OTP Verification</h2>
        // <label className="block text-gray-700 mb-2 text-center">
        //   Enter OTP sent to your email
        // </label>
//         <div className="flex justify-between mb-4">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               type="text"
//               inputMode="numeric"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               ref={(el) => (inputRefs.current[index] = el)}
//               className="border border-gray-300 rounded w-12 h-12 text-center text-lg font-semibold"
//               autoFocus={index === 0}
//             />
//           ))}
//         </div>
//         {otpError && <p className="text-red-600 text-center mb-2">{otpError}</p>}
//         <button
//           type="button"
//           onClick={() => validateOtp(otp.join(''))}
//           className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
//         >
//           VERIFY OTP
//         </button>
//         <p className="text-center mt-3">
//           Didn’t receive OTP?{" "}
//           <span className="text-maincol font-medium hover:underline hover:cursor-pointer">
//             Resend OTP
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default OtpForm;
