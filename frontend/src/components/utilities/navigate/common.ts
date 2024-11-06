
export const handleSignUpClick = (navigate:any):void => {
    navigate('/signup')
  }

export const handleForgotPass = (navigate:any,role:string):void => {
  const url:string = role == 'user' ? '/forgotpass' : `/${role}/forgotpass` ;
    navigate(url)
  }

export const navigateLogin = (navigate:any,role:string) => {
  if(role === 'user'){
    navigate('/login')
  }else{
    navigate(`/${role}/login`)
  }  
}

export const navigateOtpValidate = (navigate:any,email:string,role:string) => {
  const url:string = role == 'user' ? '/Otpvalidation' : `/${role}/Otpvalidation` ;
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

export const navigateLogout = (navigate:any,role:string):void => {
  localStorage.removeItem(`${role}_token`);
  navigateLogin(navigate, role)
}