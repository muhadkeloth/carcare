import { useState } from 'react'
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';
import { navigateHome, navigateLogin } from '../utilities/navigate/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { passwordConfirmValidation, passwordValidation } from '../utilities/validation';
import { HttpStatusCode } from '../utilities/interface';
import { ToastContainer } from 'react-toastify';
import { fetchSetPassword } from '../../services/apiCall';
import { ThreeDots } from 'react-loader-spinner';
import { ToastActive } from '../utilities/functions';



const SetPassword:React.FC = () => {
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [error,setError] = useState<Record<string,string> | null>(null)
    const navigate = useNavigate()
    const location = useLocation();
    const { email,role } = location.state || {};
    const [isLoading, setIsLoading] = useState(false);


    const handleSetPassword = async (event:React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true)
      setError(null);
      let flag = false;

      const passwordvalidation = passwordValidation(password)
      if(typeof passwordvalidation == 'string'){
        setError((prev) => ({...prev, passError:passwordvalidation}))
        flag = true;
      }      
      if(confirmPassword.length === 0 || passwordConfirmValidation(password,confirmPassword)){
        setError((prev) => ({...prev, confirmPasswordError:'password mismatch or required'}))
        flag = true;
      }
      if(flag){
        setIsLoading(false); 
        return;
      }

      try{
        const url = role == 'user' ? '/resetPassword':`/${role}/resetPassword`
        const response = await fetchSetPassword(url,{email,password,role});
        if(response.status == HttpStatusCode.CREATED){
          if(role == 'shop'){
            // localStorage.setItem(`${role}_token`,response.data.token);
            localStorage.setItem(`${role}_access_token`,response.data.accessToken);
            localStorage.setItem(`${role}_refresh_token`,response.data.refreshToken);
            navigateHome(navigate,role);
          }else{
            navigateLogin(navigate,role);
          }
        }
      }catch(error){
        const errorMessage = (error as Error).message;
        ToastActive('error',errorMessage)
      }finally{
        setIsLoading(false)
      }
    }

  return (
    <div>
        <NavLogin showBar={false} />

      <ToastContainer />

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
            style={error?.passError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
            <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{error?.passError}</span>
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
            style={error?.confirmPasswordError ? { outline: 'none', boxShadow: '0 0 0 1px red' } : {}}
            />
            <span className='block text-red-600 opacity-80 font-light text-end pe-2'>{error?.confirmPasswordError}</span>
          </div>
          <button type="submit" className="w-full btn-primary flex justify-center">
            { isLoading ? <ThreeDots height={20} color='#fff' /> : "Reset Password"}
          </button>
          <p className='text-center mt-3'>Back to  {" "}
          <span className='text-mainclr-500 font-medium hover:underline hover:mainclr-600 cursor-pointer' onClick={()=>navigateLogin(navigate,role)}>Log In</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SetPassword