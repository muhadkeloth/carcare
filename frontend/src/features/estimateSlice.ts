import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop } from "../components/utilities/interface";

type estimatetype = {
    pincode?:string;
    vehicleDetails?:{make:string;model:string;year:string;description?:string;};
    shopdetails?:Shop;
    repairWork?:{work:string;priceStart:number;priceEnd:number};
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
        setEstimateShopdetails(state,action:PayloadAction<Shop>){
            if(state.estimateDetails){
                state.estimateDetails.shopdetails = action.payload;
            }else{
                state.estimateDetails = {shopdetails:action.payload};
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
        setEstimateWorkDetails(state,action:PayloadAction<{work:string;priceStart:number;priceEnd:number;}>){
            if(state.estimateDetails){
                state.estimateDetails.repairWork = action.payload;
            }else{
                state.estimateDetails = {repairWork:action.payload};
            };                   
        },
        clearestimateDetails(state){
            state.estimateDetails = null;
        },
    },
});

export const { setpincode, clearestimateDetails, setEstimateShopdetails, setEstimateWorkDetails  } = estimateSlice.actions;
export default estimateSlice.reducer;