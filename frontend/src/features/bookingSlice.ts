import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bookingState, Shop, UserDetails, VehicleDetails } from "../components/utilities/interface";


const initialState:bookingState = {
    bookingDetails:null,
}
const bookingSlice = createSlice({
    name:'bookingdetails',
    initialState,
    reducers:{
        setShopdetails(state,action:PayloadAction<Shop>){
            if(state.bookingDetails){
                state.bookingDetails.shopdetails = action.payload;
            }else{
                state.bookingDetails = {shopdetails:action.payload};
            }
        },
        setDateAndTime(state,action:PayloadAction<{selectedDate:string;selectedTime:string;}>){
            if(state.bookingDetails){
                state.bookingDetails.shedule = {date:action.payload.selectedDate,time:action.payload.selectedTime}
            }else{
                state.bookingDetails = {shedule:{date:action.payload.selectedDate,time:action.payload.selectedTime}}
            };
        },
        setVehicleDetails(state,action:PayloadAction<VehicleDetails>){
            if(state.bookingDetails){
                state.bookingDetails.vehicleDetails = action.payload;
            }else{
                state.bookingDetails = {vehicleDetails:action.payload};
            };            
        },
        setuserdetails(state,action:PayloadAction<UserDetails>){
            if(state.bookingDetails){
                state.bookingDetails.userDetails = action.payload;
            }else{
                state.bookingDetails = {userDetails:action.payload};
            };                   
        },
        clearbookingdetails(state){
            state.bookingDetails = null;
        },
    },
});

export const { setShopdetails, clearbookingdetails ,setDateAndTime , setVehicleDetails, setuserdetails } = bookingSlice.actions;
export default bookingSlice.reducer;