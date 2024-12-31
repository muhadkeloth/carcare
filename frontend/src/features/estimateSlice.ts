import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Estimate, estimateState, LocationDetails, Shop } from "../components/utilities/interface";


const initialState:estimateState = {
    estimateDetails:null,
}
const estimateSlice = createSlice({
    name:'estimate',
    initialState,
    reducers:{
        setEstimateAddress(state,action:PayloadAction<LocationDetails>){
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
        setEstimateWorkDetails(state,action:PayloadAction<Estimate>){
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