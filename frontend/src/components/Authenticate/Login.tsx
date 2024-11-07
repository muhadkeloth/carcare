import React, { useEffect, useState } from 'react';
import NavLogin from './NavLogin';
import carlogo from '../../assets/images/CarCare-white.png';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { emailValidation, passwordValidation } from '../utilities/validation';
import { handleForgotPass, handleSignUpClick, navigateHome, navigatePasswordChange } from '../utilities/navigate/common';
import { ErrorResponse, RoleProps } from '../utilities/interface';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { fetchLogin } from '../../services/common';



const Login: React.FC<RoleProps> = ({ role }) => {
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



    try{
        // const response = await axios.post(`${import.meta.env.VITE_ENDPORTFRONT}/${role}/login`,{
        //   email,password,
        // });

        const response = await fetchLogin(role,email,password);
        if(response.status == 201){
          if(response.data.token){
            localStorage.setItem(`${role}_token`,response.data.token);
          // navigate(`/${response.data.role}`);
          navigateHome(navigate, role);
          }else if(response.data?.validotp) {
            navigatePasswordChange(navigate,email,role)
          }
        }        
      }catch(error){
        console.log('login failed:',error)
        setPassError('  ')
        setEmailError('  ')
        const err = error as AxiosError<ErrorResponse>;
        const errorMessage = err?.response?.data?.message || 'Login failed. Please try again.';
        errorMessage == "Invalid password" ? setPassError(errorMessage) : (
          toast.error(errorMessage, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            })
        );
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
      <NavLogin />
      {/* <ToastContainer
        limit={2}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
      /> */}
      <ToastContainer />

      <div className="flex items-center justify-center mt-5 ">
        <form onSubmit={handleLogin} className="w-96 p-6 mb-9">
          <div className="flex justify-center mb-5 mt-2">
            <img src={carlogo} className="w-48" alt="carCare Logo..." />
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">
            {role[0].toUpperCase()}
            {role.slice(1)} Login
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email@address.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 "
              style={
                emailError.length !== 0
                  ? { outline: "none", boxShadow: "0 0 0 1px red" }
                  : {}
              }
            />
            <span className="block text-red-600 font-light opacity-80 text-end pe-2">
              {emailError}
            </span>
          </div>
          <div className="mb-4">
            <label
              className="text-gray-700 flex justify-between items-center mb-2"
              htmlFor="password"
            >
              Password
              <span
                onClick={() => handleForgotPass(navigate,role)}
                className="text-maincol opacity-80 hover:underline hover:cursor-pointer ml-2"
              >
                Forgot your password?
              </span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
              style={
                passError.length !== 0
                  ? { outline: "none", boxShadow: "0 0 0 1px red" }
                  : {}
              }
            />
            <span className="block text-red-600 opacity-80 font-light text-end pe-2">
              {passError}
            </span>
          </div>
          <button
            type="submit"
            className="bg-maincol text-white rounded w-full py-2 hover:bg-maincoldark transition-colors duration-300"
          >
            Login
          </button>
          {role === "user" ? (
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <span
                className="text-maincol font-medium hover:underline hover:cursor-pointer"
                onClick={() => handleSignUpClick(navigate)}
              >
                Sign Up
              </span>
            </p>
          ) : (
            ""
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
