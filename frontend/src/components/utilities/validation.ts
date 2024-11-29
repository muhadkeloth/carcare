import { returnvalue } from "./types";



export function emailValidation(email:string):returnvalue{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function passwordValidation(password:string):returnvalue{
    if (password.length < 8 || password.length > 14) return "Password must be between 8 and 14 characters."
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter."
    if (!/[0-9]/.test(password)) return "Password must contain at least one number."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))return "Password contain at least one special character."
    return false
}

export function passwordConfirmValidation(password:string,confirmPassword:string):returnvalue{
    if(password !== confirmPassword) return true
    return false;
}

export function nameValidation(name:string):returnvalue{
    if(name.length<4 || name.length>14)return true;
    return false;
}

export const phoneNumberValidation = (number:string):returnvalue => {
    return number.length !== 10 ;
}

export const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>, maxLength: number):boolean => {
    const value = e.target.value;
    const regex = new RegExp(`^\\d{0,${maxLength}}$`)
    // return /^\d{0,6}$/.test(value)
    return regex.test(value);
};
