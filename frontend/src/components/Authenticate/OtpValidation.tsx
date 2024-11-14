import React, { useEffect, useRef, useState } from 'react'
import NavLogin from './NavLogin'
import carlogo from '../../assets/images/CarCare-white.png';
import { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateHome, navigateLogin, navigatePasswordChange } from '../utilities/navigate/common';
import { ErrorResponse, HttpStatusCode } from '../utilities/interface';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { fetchOtpGenerate, fetchOtpValidate, fetchSignup } from '../../services/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { setResetOtp } from '../../features/otpSlice';
import { RootState } from '../../store';
import { ThreeDots } from 'react-loader-spinner';


const OtpValidation:React.FC = () => {
  const [otp,setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError,setOtpError] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const location = useLocation();
  const {email,role} = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const newUserDetails = useSelector((state:RootState) => state.otp.signupDetails)
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [showResend, setShowResend] = useState(false);

  const formatTime = (seconds:number):string => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resendOtp = async () => {
      try {
        let status;
        if(role == 'userSign'){
          const response = await fetchSignup('/signupOtpGenerate',{email});
          dispatch(setResetOtp(response.data.otp))
          status = response.status;
        }else{
          const url = role == 'user' ? '/otpgenerate' : `/${role}/otpgenerate`;
          const response = await fetchOtpGenerate(url,{email,role})
          status = response.status;
        }
          if (status === HttpStatusCode.CREATED) {
              setTimeLeft(120); 
              setShowResend(false); 
          }
      } catch (error) {
          console.error('Error resending OTP:', error);
          const err = error as AxiosError<ErrorResponse>;
          const errorMessage = err?.response?.data?.message || 'oops please go back to login';
          toast.error(errorMessage, {
            position: "bottom-right", autoClose: 3000,
            hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true,
            progress: undefined, theme: "dark",
            transition: Bounce,
            });
      }
  };


  const validateOtp = async (otp: string) => {
    setIsLoading(true);
    try{      
      if(role == 'userSign'){
        const response = await fetchSignup('/signup',{...newUserDetails,userOtp:otp});
        if(response.status == HttpStatusCode.SUCCESS) {
          if(response.data.token){
            localStorage.setItem(`${response.data.role}_token`,response.data.token);
            console.log('signup : OTP validated successfully!');
            navigateHome(navigate,response.data.role);
          }
        }else{
          setOtpError('Invalid OTP. Please try again.')
        }
      }else{
        const url = role == 'user' ? '/otpvalidation' : `/${role}/otpvalidation`;
        const response = await fetchOtpValidate(url,{ otp, email,role })
        if(response.status == HttpStatusCode.SUCCESS) {
          console.log('F : OTP validated successfully!');
          navigatePasswordChange(navigate,email,role);
        }else{
          setOtpError('Invalid OTP. Please try again.')
        }
      }
    }catch(error){
      console.error('OTP validation failed:', error);
      setOtpError('Validation error. Please try again.')
      const err = error as AxiosError<ErrorResponse>;
          const errorMessage = err?.response?.data?.message || 'otp validation error';
          toast.error(errorMessage, {
            position: "bottom-right", autoClose: 3000,
            hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true,
            progress: undefined, theme: "dark",
            transition: Bounce,
            });
    }finally{
      setIsLoading(false);
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

  useEffect(() => {
    if (timeLeft > 0) {
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer); 
      } else {
        setShowResend(true); 
      }
    }, [timeLeft]);

  return (
    <div>
       <NavLogin />

      <ToastContainer />

      <div className="flex items-center justify-center mt-5 ">
        <form onSubmit={(event)=>event.preventDefault()} className="w-96 p-6">
          <div className='flex justify-center mb-5 mt-2'>
            <img src={carlogo} className='w-48' alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">OTP Verification</h2>
          <div className="mb-4">
            <label className="block font-light text-gray-700 mb-4" htmlFor="number">
              Check mail for OTP: <span className='font-semibold'>"{ email}"</span>
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
            // className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
            className="w-full btn-primary flex justify-center"
          >
            { isLoading ? <ThreeDots height="20" color='#fff' /> : 'VERIFY OTP' } 
            
          </button>
        <p className='text-center mt-3'>Don't you receive OTP? {" "}
          { showResend ? (
            <span className='text-mainclr-500 font-medium hover:text-mainclr-600 cursor-pointer ' onClick={resendOtp}>Resend OTP</span>
          ) : (
            ` ${formatTime(timeLeft)}`
          ) }
          {/* <span className='text-maincol font-medium hover:underline hover:cursor-pointer' >Resend OTP **time*</span> */}
          </p>
          <p className='text-center mt-3'>Back to  {" "}
          <span className='text-mainclr-500 font-medium hover:underline hover:text-mainclr-600 cursor-pointer' 
          onClick={()=>navigateLogin(navigate,role)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default OtpValidation


