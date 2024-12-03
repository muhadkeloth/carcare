import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop } from "../components/utilities/interface";

type estimatetype = {
    locationdetails?:{
        description:string;
        location:[number,number];
    };
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
        setEstimateAddress(state,action:PayloadAction<{description:string,location:[number,number]}>){
            if(state.estimateDetails){
                state.estimateDetails.locationdetails = action.payload;
            }else{
                state.estimateDetails = {locationdetails:action.payload};
            }
        },
        setEstimateShopdetails(state,action:PayloadAction<Shop>){
            if(state.estimateDetails){
                state.estimateDetails.shopdetails = action.payload;
            }else{
                state.estimateDetails = {shopdetails:action.payload};
            }
        },
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

export const { setEstimateAddress, clearestimateDetails, setEstimateShopdetails, setEstimateWorkDetails  } = estimateSlice.actions;
export default estimateSlice.reducer;