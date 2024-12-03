import React, { useEffect, useState } from 'react';
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';
import { useNavigate } from 'react-router-dom';
import { emailValidation } from '../utilities/validation';
import { handleForgotPass, handleSignUpClick, navigateHome, navigatePasswordChange } from '../utilities/navigate/common';
import { HttpStatusCode, RoleProps } from '../utilities/interface';
import { ToastContainer } from 'react-toastify';
import { fetchLogin } from '../../services/apiCall';
import { ThreeDots } from 'react-loader-spinner';
import { ToastActive } from '../utilities/functions';



const Login: React.FC<RoleProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState<Record<string,string> | null>(null)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { SUCCESS } = HttpStatusCode;

  const handleLogin = async (e: React.FormEvent) => {
    let flag = false;
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEmail(email.trim());
    if(email.length === 0 || !emailValidation(email)) {
      flag = true;
      setError((prev) => ({ ...prev, emailError: "Entered Invalid Email Address", }));
    }
    if(flag){
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchLogin(role, { email, password, role });
      if (response.status == SUCCESS) {
        if (response.data.token) {
          localStorage.setItem(`${role}_token`, response.data.token);
          navigateHome(navigate, role);
        } else if (response.data?.validotp) {
          navigatePasswordChange(navigate, email, role);
        }
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    const rol = role == '' ? 'user' : role ;
    const token = localStorage.getItem(`${rol}_token`);
    if(token){
      navigateHome(navigate, rol)
    }
  },[navigate])


  return (
    <>
      <NavLogin showBar={false} />
      <ToastContainer />

      <div className="flex items-center justify-center mt-5 ">
        <form onSubmit={handleLogin} className="w-96 p-6 mb-9">
          <div className="flex justify-center mb-5 mt-2">
            <img src={carlogo} className="w-48" alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">{role[0].toUpperCase()}{role.slice(1)} Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="email@address.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 "
              style={error?.emailError ? { outline: "none", boxShadow: "0 0 0 1px red" } : {} } />
            <span className="block text-red-600 font-light opacity-80 text-end pe-2">
              {error?.emailError}
            </span>
          </div>
          <div className="mb-4">
            <label className="text-gray-700 flex justify-between items-center mb-2"
              htmlFor="password" >
              Password
              <span className="text-mainclr-400 hover:underline cursor-pointer ml-2"
                onClick={() => handleForgotPass(navigate, role)} >
                Forgot your password?
              </span>
            </label>
            <input type="password" id="password" placeholder="••••••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
              style={error?.passError ? { outline: "none", boxShadow: "0 0 0 1px red" } : {} } />
          </div>
          <button type="submit" className="btn-primary w-full flex justify-center" >
            {isLoading ? <ThreeDots height={20} color="#fff" /> : "Login"}
          </button>
          {role === "user" ? (
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <span className="text-mainclr-500 font-medium hover:underline hover:text-mainclr-600 cursor-pointer"
                onClick={() => handleSignUpClick(navigate)} >
                Sign Up
              </span>
            </p>
          ) : ( "" )}
        </form>
      </div>
    </>
  );
};

export default Login;
