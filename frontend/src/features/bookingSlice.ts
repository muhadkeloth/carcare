import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type bookingDetailsType = {
    shopId?:string;
    shedule?:{date:Date;time:string;};
    vehicleDetails?:{make:string;model:string;year:string;description?:string;};
    userDetails?:{firstName:string;lastName:string;email:string;phoneNumber:string;};
}

interface bookingState {
    bookingDetails:bookingDetailsType | null,
}
const initialState:bookingState = {
    bookingDetails:null,
}
const bookingSlice = createSlice({
    name:'bookingdetails',
    initialState,
    reducers:{
        setShopId(state,action:PayloadAction<string>){
            if(state.bookingDetails){
                state.bookingDetails.shopId = action.payload;
            }else{
                state.bookingDetails = {shopId:action.payload};
            }
        },
        setDateAndTime(state,action:PayloadAction<{selectedDate:Date;selectedTime:string;}>){
            if(state.bookingDetails){
                state.bookingDetails.shedule = {date:action.payload.selectedDate,time:action.payload.selectedTime}
            }else{
                state.bookingDetails = {shedule:{date:action.payload.selectedDate,time:action.payload.selectedTime}}
            };
        },
        setVehicleDetails(state,action:PayloadAction<{model:string;make:string;year:string;description?:string;}>){
            if(state.bookingDetails){
                state.bookingDetails.vehicleDetails = action.payload;
            }else{
                state.bookingDetails = {vehicleDetails:action.payload};
            };            
        },
        setuserdetails(state,action:PayloadAction<{firstName:string;lastName:string;email:string;phoneNumber:string;}>){
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

export const { setShopId, clearbookingdetails ,setDateAndTime , setVehicleDetails, setuserdetails } = bookingSlice.actions;
export default bookingSlice.reducer;