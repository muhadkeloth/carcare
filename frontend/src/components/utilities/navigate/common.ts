import { clearShopUser } from "../../../features/shopSlice";
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
    navigate('/login', { replace: true })
  }else{
    navigate(`/${role}/login`, { replace: true })
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
  if(localStorage.getItem("user_access_token")){
    navigate('/profile')
  }
}

export const navigateToSection = (navigate:any,section:string,role:string):void => {
  if(role == 'shop' && localStorage.getItem("shop_access_token")){
      navigate(`/shop?menu=${section}`)
  }else if(role == 'admin' && localStorage.getItem("admin_access_token")){
      navigate(`/admin?menu=${section}`)
  }
}

export const navigateLogout = (navigate:any,role:string):void => {
  localStorage.removeItem(`${role}_access_token`);
  localStorage.removeItem(`${role}_refresh_token`);
  if(role === 'user'){
    store.dispatch(clearUser())
  }else if(role === 'shop'){
    store.dispatch(clearShopUser())
  }
  navigateLogin(navigate, role)
}
