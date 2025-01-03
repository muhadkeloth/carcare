import { navigateLogin } from "./common";

const checkToken = (navigate:any):boolean | null => {
  const token = localStorage.getItem('user_access_token');
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

export const navigateChatHistory = (navigate:any):void => {
  if(checkToken(navigate)) navigate('/chats')
}

export const navigateChatRoom = (navigate:any,roomId:string|null =  null):void => {
  if(checkToken(navigate)) navigate(`/chats?roomId=${roomId}`)
}