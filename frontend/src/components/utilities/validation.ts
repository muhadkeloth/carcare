
type returnvalue = string | undefined;

export function emailValidation(email:string):returnvalue{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)) return 'Entered Invalid Email Address'
    return undefined
}

export function passwordValidation(password:string):returnvalue{
    if (password.length < 8 || password.length > 14) return "Password must be between 8 and 14 characters."
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter."
    if (!/[0-9]/.test(password)) return "Password must contain at least one number."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))return "Password contain at least one special character."
    return undefined
}

export function passwordConfirmValidation(password:string,confirmPassword:string):returnvalue{
    if(password !== confirmPassword) return 'password mismatch'
    return undefined;
}

export function nameValidation(name:string):returnvalue{
    if(name.length<4 || name.length>14)return "Name must be at least 4 characters long."
    return undefined
}

export const phoneNumberValidation = (number:string):returnvalue => {
    console.log
    if(number.length !== 10) return 'Invalid phone number';
}
