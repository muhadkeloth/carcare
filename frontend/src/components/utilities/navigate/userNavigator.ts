import { navigateLogin } from "./common";

const checkToken = (navigate:any):boolean | null => {
  const token = localStorage.getItem('user_token');
  if(!token) {
    navigateLogin(navigate,'user');
    return null;
  }
    return true;
}


export const navigateFindWorkShop = (navigate:any,coordinates?:[number,number]):void => {
    if(checkToken(navigate)){
      if(coordinates){
        navigate(`/findworkshop?lat=${coordinates[0]}&lng=${coordinates[1]}`)
      }else{
        navigate('/findworkshop')
      }
    }
  }
// export const navigateFindWorkShop = (navigate:any):void => {
//     if(checkToken(navigate)) navigate('/findworkshop')
//   }


export const navigateShopDetailPage = (navigate:any,id:string):void => {
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