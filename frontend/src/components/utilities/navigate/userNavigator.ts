import { navigateLogin } from "./common";


export const navigateFindWorkShop = (navigate:any):void => {
    const token = localStorage.getItem('user_token');
    if(!token)navigateLogin(navigate,'user');
    navigate('/findworkshop')
  }

  