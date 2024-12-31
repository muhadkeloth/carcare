import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationDetails, PickCarState, shedule, Shop, UserDetails, VehicleDetails } from "../components/utilities/interface";


const initialState:PickCarState = {
    PickCarDetails:null,
}
const PickCarSlice = createSlice({
    name:'pickMyCar',
    initialState,
    reducers:{
        setPickCarAddress(state,action:PayloadAction<LocationDetails>){
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
        setPickCarVehicleDetails(state,action:PayloadAction<VehicleDetails>){
            if(state.PickCarDetails){
                state.PickCarDetails.vehicleDetails = action.payload;
            }else{
                state.PickCarDetails = {vehicleDetails:action.payload};
            };            
        },
        setPickCaruserdetails(state,action:PayloadAction<UserDetails>){
            if(state.PickCarDetails){
                state.PickCarDetails.userDetails = action.payload;
            }else{
                state.PickCarDetails = {userDetails:action.payload};
            };                   
        },
        setDateAndTimePickCar(state,action:PayloadAction<shedule>){
            if(state.PickCarDetails){
                state.PickCarDetails.shedule = {date:action.payload.date,time:action.payload.time}
            }else{
                state.PickCarDetails = {shedule:{date:action.payload.date,time:action.payload.time}}
            };
        },
        clearPickCarDetails(state){
            state.PickCarDetails = null;
        },
    },
});

export const { setPickCarAddress, clearPickCarDetails,setPickCarVehicleDetails, setPickCaruserdetails, setPickCarShopdetails, setDateAndTimePickCar  } = PickCarSlice.actions;
export default PickCarSlice.reducer;