import { useEffect, useRef, useState } from 'react'
import NavLogin from './NavLogin'
import carlogo from '../../assets/images/CarCare-white.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateHome, navigateLogin, navigatePasswordChange } from '../utilities/navigate/common';
import { HttpStatusCode } from '../utilities/interface';
import { ToastContainer } from 'react-toastify';
import { fetchOtpGenerate, fetchOtpValidate, fetchSignup } from '../../services/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { setResetOtp } from '../../features/otpSlice';
import { RootState } from '../../store';
import { ThreeDots } from 'react-loader-spinner';
import { ToastActive } from '../utilities/functions';


const OtpValidation = () => {
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
              ToastActive('success','OTP Resend Successfully')
          }
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive('error',errorMessage)
      }
  };


  const validateOtp = async (otp: string) => {
    setIsLoading(true);
    try{      
      if(role == 'userSign'){
        const response = await fetchSignup('/signup',{...newUserDetails,userOtp:otp});
        if(response.status == HttpStatusCode.CREATED) {
          if(response.data.accessToken && response.data.refreshToken ){
            localStorage.setItem(`${response.data.role}_access_token`,response.data.accessToken);
            localStorage.setItem(`${response.data.role}_refresh_token`,response.data.refreshToken);
            navigateHome(navigate,response.data.role);
          }else{
            navigateLogin(navigate,'user')
          }
        }else{
          setOtpError('Invalid OTP. Please try again.')
        }
      }else{
        const url = role == 'user' ? '/otpvalidation' : `/${role}/otpvalidation`;
        const response = await fetchOtpValidate(url,{ otp, email,role })
        if(response.status == HttpStatusCode.SUCCESS) {
          navigatePasswordChange(navigate,email,role);
        }else{
          setOtpError('Invalid OTP. Please try again.')
        }
      }
    }catch(error){
      const errorMessage = (error as Error).message;
      setOtpError(errorMessage)
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
        const timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000);
        return () => clearInterval(timer); 
      } else {
        setShowResend(true); 
      }
    }, [timeLeft]);

  return (
    <div>
       <NavLogin showBar={false} />

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
            <input key={index} type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="border border-gray-300 rounded w-12 h-12 text-center text-lg font-semibold"
              style={otpError.length !== 0 ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}} 
              autoFocus={index === 0} />
          ))}
        </div>
        {otpError && <p className="text-red-600 text-center mb-2">{otpError}</p>}
          </div>
          <button type="button" onClick={()=> validateOtp(otp.join(''))}
            className="w-full btn-primary flex justify-center" >
            { isLoading ? <ThreeDots height="20" color='#fff' /> : 'VERIFY OTP' }     
          </button>
        <p className='text-center mt-3'>Don't you receive OTP? {" "}
          { showResend ? (
            <span className='text-mainclr-500 font-medium hover:text-mainclr-600 cursor-pointer ' onClick={resendOtp}>Resend OTP</span>
          ) : (
            ` ${formatTime(timeLeft)}`
          ) }
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


