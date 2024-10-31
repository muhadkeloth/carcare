
export const handleSignUpClick = (navigate:any):void => {
    navigate('/signup')
  }

export const handleForgotPass = (navigate:any):void => {
    navigate('/forgotpass')
  }

export const navigateLogin = (navigate:any) => {
    navigate('/login')
}

export const navigateOtpValidate = (navigate:any,email:string) => {
  navigate('/Otpvalidation',{state:{email}})
}

export const navigatePasswordChange = (navigate:any,email:string) => {
  navigate('/setpassword',{ state:{email} })
}