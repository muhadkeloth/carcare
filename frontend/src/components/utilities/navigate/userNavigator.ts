import { navigateLogin } from "./common";


export const navigateFindWorkShop = (navigate:any):void => {
    const token = localStorage.getItem('user_token');
    if(!token)navigateLogin(navigate,'user')
    else navigate('/findworkshop')
  }

export const navigateShopDetailPage = (navigate:any,id:string):void => {
    const token = localStorage.getItem('user_token');
    if(!token) navigateLogin(navigate,'user');
    else navigate('/shopdetails',{ state:{id} })
}

  