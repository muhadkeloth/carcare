import { navigateLogin } from "./common";

const checkToken = (navigate:any):boolean | null => {
  const token = localStorage.getItem('user_token');
  if(!token) {
    navigateLogin(navigate,'user');
    return null;
  }
    return true;
}



export const navigateFindWorkShop = (navigate:any):void => {
    if(checkToken(navigate)) navigate('/findworkshop')
  }


export const navigateShopDetailPage = (navigate:any,id:string):void => {
    // const token = localStorage.getItem('user_token');
    // if(!token) navigateLogin(navigate,'user');
    // else navigate('/workshopdetails',{ state:{id} })
    if(checkToken(navigate)) navigate('/workshopdetails',{ state:{id} })
}



export const navigateBookingSlot = (navigate:any):void => {
  if(checkToken(navigate)) navigate('/bookingSlot')
}

export const navigateEstimate = (navigate:any):void => {
  if(checkToken(navigate)) navigate('/getEstimate')
}

export const navigatePickMyCar = (navigate:any):void => {
  if(checkToken(navigate)) navigate('/pickMyCar')
}