import { useState } from 'react'
import NavLogin from './NavLogin'
import {  useNavigate } from 'react-router-dom';
import carlogo from '../../assets/images/CarCare-white.png';
import { navigateLogin, navigateOtpValidate } from '../utilities/navigate/common';
import { emailValidation, handleInputValue, nameValidation, passwordConfirmValidation, passwordValidation, phoneNumberValidation } from '../utilities/validation';
import { ToastContainer } from 'react-toastify';
import { HttpStatusCode } from '../utilities/interface';
import { fetchSignup } from '../../services/apiCall';
import { useDispatch } from 'react-redux';
import { setSignupDetails } from '../../features/otpSlice';
import { ThreeDots } from 'react-loader-spinner';
import { ToastActive } from '../utilities/functions';


const Signup = () => {
    const [inputDetails,setInputDetails] = useState({username:'',email:'',phoneNumber:'',password:'',confirmPassword:''})
    const [error,setError] = useState<Record<string,string> | null>(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading,setIsLoading] = useState(false);

    const handleSignup = async (e:React.FormEvent) => {
      let flag = false;
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      setInputDetails((prev) => ({
        ...prev, username: inputDetails?.username.trim(), email: inputDetails?.email.trim(),  
      }))
      if(nameValidation(inputDetails.username)){
        setError((prev) => ({...prev,nameError:"Name must be at least 4 characters long."}));
        flag = true;
      }
      if(!emailValidation(inputDetails.email)){
        setError((prev) => ({...prev,emailError:'Entered Invalid Email Address'}))
        flag = true;
      }
      if(phoneNumberValidation(inputDetails.phoneNumber)){
        setError((prev) => ({...prev,phoneNumberError:'Invalid phone number'}))
        flag = true;
      }
      const passwordvalidation = passwordValidation(inputDetails.password)
      if(typeof passwordvalidation == 'string'){
        setError((prev) => ({...prev,passError:passwordvalidation}))
        flag = true;
      }  
      if(inputDetails.confirmPassword.length === 0 || passwordConfirmValidation(inputDetails.password,inputDetails.confirmPassword)){
        setError((prev) => ({...prev,confirmPasswordError:'password mismatch or required'}))
        flag = true;
      }
      if(flag){
        setIsLoading(false); 
        return;
      }

      try{
        const response = await fetchSignup('/signupOtpGenerate',{email:inputDetails.email,phoneNumber:inputDetails.phoneNumber});
        if(response.status == HttpStatusCode.CREATED){
          const userData = { ...inputDetails, otp:response.data.otp }
          dispatch(setSignupDetails(userData));
          navigateOtpValidate(navigate, inputDetails.email, 'userSign' )
        }
      }catch(error){
        const errorMessage = (error as Error).message;
        ToastActive('error',errorMessage)
      }finally{
        setIsLoading(false);
      }
    }


  return (
    <div>
        <NavLogin showBar={false} />
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
              type="text"  
              placeholder='enter user name'
              value={inputDetails.username} 
              onChange={(e) => setInputDetails({...inputDetails, username: e.target.value })} 
              className="border border-gray-300 rounded w-full p-2 "
              style={error?.nameError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{error?.nameError}</span>

          </div>
          <div className="mb-2">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input 
              type="email"  
              placeholder='email@address.com'
              value={inputDetails.email} 
              onChange={(e) => setInputDetails({...inputDetails, email: e.target.value })} 
              className="border border-gray-300 rounded w-full p-2 "
              style={error?.emailError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{error?.emailError}</span>

          </div>
          <div className="mb-2">
            <label className="block text-gray-700 mb-2" htmlFor="number">
              Phone Number
            </label>
            <input 
              type="text"  
              placeholder='+91 0000 000 000'
              value={inputDetails.phoneNumber} 
              onChange={(e) => handleInputValue(e, 10) && setInputDetails({...inputDetails, phoneNumber:e.target.value})} 
              className="border border-gray-300 rounded w-full p-2 appearance-none"
              style={error?.phoneNumberError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
              <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{error?.phoneNumberError}</span>

          </div>
          <div className="mb-2">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="password">
               Password 
            </label>
            <input 
            type="password" 
            placeholder='••••••••••••'
            value={inputDetails.password} 
            onChange={(e) => setInputDetails({...inputDetails, password: e.target.value })} 
            className="border border-gray-300 rounded w-full p-2"
            style={error?.passError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
             <span className='block text-red-600 opacity-80 font-extralight text-end pe-2'>{error?.passError}</span>

          </div>
          <div className="mb-2">
            <label className="text-gray-700 flex justify-between items-center mb-2" htmlFor="confirmPassword">
               Confirm Password
            </label>
            <input 
            type="password" 
            placeholder='••••••••••••'
            value={inputDetails.confirmPassword} 
            onChange={(e) => setInputDetails({...inputDetails, confirmPassword: e.target.value })} 
            className="border border-gray-300 rounded w-full p-2"
            style={error?.confirmPasswordError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
            <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{error?.confirmPasswordError}</span>
          </div>
          <button 
            type="submit" 
            className=" w-full btn-primary flex justify-center mt-4"
          >
           { isLoading ? <ThreeDots height={20} color='#fff' /> : " Sign Up"}
          </button>
        <p className='text-center mt-3'>Have Account?  {" "}
          <span className='text-mainclr-500 font-medium hover:text-mainclr-600 hover:underline cursor-pointer' onClick={()=>navigateLogin(navigate,'user')}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup