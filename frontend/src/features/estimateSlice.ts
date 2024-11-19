import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type estimatetype = {
    pincode?:string;
    vehicleDetails?:{make:string;model:string;year:string;description?:string;};
}

interface estimateState {
    estimateDetails:estimatetype | null,
}
const initialState:estimateState = {
    estimateDetails:null,
}
const estimateSlice = createSlice({
    name:'estimate',
    initialState,
    reducers:{
        setpincode(state,action:PayloadAction<string>){
            if(state.estimateDetails){
                state.estimateDetails.pincode = action.payload;
            }else{
                state.estimateDetails = {pincode:action.payload};
            }
        },
        // setDateAndTime(state,action:PayloadAction<{selectedDate:Date;selectedTime:string;}>){
        //     if(state.bookingDetails){
        //         state.bookingDetails.shedule = {date:action.payload.selectedDate,time:action.payload.selectedTime}
        //     }else{
        //         state.bookingDetails = {shedule:{date:action.payload.selectedDate,time:action.payload.selectedTime}}
        //     };
        // },
        // setVehicleDetails(state,action:PayloadAction<{model:string;make:string;year:string;description?:string;}>){
        //     if(state.bookingDetails){
        //         state.bookingDetails.vehicleDetails = action.payload;
        //     }else{
        //         state.bookingDetails = {vehicleDetails:action.payload};
        //     };            
        // },
        // setuserdetails(state,action:PayloadAction<{firstName:string;lastName:string;email:string;phoneNumber:string;}>){
        //     if(state.bookingDetails){
        //         state.bookingDetails.userDetails = action.payload;
        //     }else{
        //         state.bookingDetails = {userDetails:action.payload};
        //     };                   
        // },
        clearestimateDetails(state){
            state.estimateDetails = null;
        },
    },
});

export const { setpincode, clearestimateDetails  } = estimateSlice.actions;
export default estimateSlice.reducer;