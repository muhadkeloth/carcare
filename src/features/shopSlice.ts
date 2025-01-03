import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shopProfile, userState } from "../components/utilities/interface";


const initialState:userState = {
    shopDetails:null,
}
const shopSlice = createSlice({
    name:'shop',
    initialState,
    reducers:{
        setShopUser(state,action:PayloadAction<shopProfile>){
            state.shopDetails = action.payload;
        },
        clearShopUser(state){
            state.shopDetails = null;
        },
    },
});

export const { setShopUser, clearShopUser } = shopSlice.actions;
export default shopSlice.reducer;