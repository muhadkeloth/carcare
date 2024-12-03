import { clearUser } from "../../../features/userSlice";
import store from "../../../store";

export const handleSignUpClick = (navigate:any):void => {
    navigate('/signup')
  }

export const handleForgotPass = (navigate:any,role:string):void => {
  const url:string = role == 'user' ? '/forgotpass' : `/${role}/forgotpass` ;
    navigate(url)
  }

export const navigateLogin = (navigate:any,role:string) => {
  if(role === 'user' ||  role == 'userSign' || role == '' || !role){
    navigate('/login')
  }else{
    navigate(`/${role}/login`)
  }  
}

export const navigateOtpValidate = (navigate:any,email:string,role:string) => {
  const url:string = role == 'user' || role == 'userSign' ? '/Otpvalidation' : `/${role}/Otpvalidation` ;
  navigate(url,{state:{email,role}})
}

export const navigatePasswordChange = (navigate:any,email:string,role:string) => {
  const url:string = role == 'user' ? '/setpassword' : `/${role}/setpassword` ;
  navigate(url,{ state:{email,role} })
}

export const navigateHome = (navigate:any,role:string):void => {
  if(role == 'user'){
    navigate(`/`)
  }else{
    navigate(`/${role}`)
  }
}

export const navigateProfile = (navigate:any):void => {
  if(localStorage.getItem("user_token")){
    navigate('/profile')
  }
}

export const navigateLogout = (navigate:any,role:string):void => {
  localStorage.removeItem(`${role}_token`);
  store.dispatch(clearUser())
  navigateLogin(navigate, role)
}
