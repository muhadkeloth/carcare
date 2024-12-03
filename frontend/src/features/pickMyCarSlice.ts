import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop } from "../components/utilities/interface";

type pickCartype = {
    locationdetails?:{
        description:string;
        location:[number,number];
    };
    vehicleDetails?:{make:string;model:string;year:string;description?:string;};
    shopdetails?:Shop;
    shedule?:{date:Date;time:string;};
    userDetails?:{firstName:string;lastName:string;email:string;phoneNumber:string;};
}

interface PickCarState {
    PickCarDetails:pickCartype | null,
}
const initialState:PickCarState = {
    PickCarDetails:null,
}
const PickCarSlice = createSlice({
    name:'pickMyCar',
    initialState,
    reducers:{
        setPickCarAddress(state,action:PayloadAction<{description:string,location:[number,number]}>){
            if(state.PickCarDetails){
                state.PickCarDetails.locationdetails = action.payload;
            }else{
                state.PickCarDetails = {locationdetails:action.payload};
            }
        },
        setPickCarShopdetails(state,action:PayloadAction<Shop>){
            if(state.PickCarDetails){
                state.PickCarDetails.shopdetails = action.payload;
            }else{
                state.PickCarDetails = {shopdetails:action.payload};
            }
        },
        setPickCarVehicleDetails(state,action:PayloadAction<{model:string;make:string;year:string;description?:string;}>){
            if(state.PickCarDetails){
                state.PickCarDetails.vehicleDetails = action.payload;
            }else{
                state.PickCarDetails = {vehicleDetails:action.payload};
            };            
        },
        setPickCaruserdetails(state,action:PayloadAction<{firstName:string;lastName:string;email:string;phoneNumber:string;}>){
            if(state.PickCarDetails){
                state.PickCarDetails.userDetails = action.payload;
            }else{
                state.PickCarDetails = {userDetails:action.payload};
            };                   
        },
        setDateAndTimePickCar(state,action:PayloadAction<{selectedDate:Date;selectedTime:string;}>){
            if(state.PickCarDetails){
                state.PickCarDetails.shedule = {date:action.payload.selectedDate,time:action.payload.selectedTime}
            }else{
                state.PickCarDetails = {shedule:{date:action.payload.selectedDate,time:action.payload.selectedTime}}
            };
        },
        clearPickCarDetails(state){
            state.PickCarDetails = null;
        },
    },
});

export const { setPickCarAddress, clearPickCarDetails,setPickCarVehicleDetails, setPickCaruserdetails, setPickCarShopdetails, setDateAndTimePickCar  } = PickCarSlice.actions;
export default PickCarSlice.reducer;