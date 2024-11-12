import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type shopProfile = {
    _id:string;shopName:string;
    ownerName:string;email:string;
    phoneNumber:string;image:string;
    isActive:boolean;location:{type:string;coordinates:[number,number]};
    address:{
        street:string;city:string;
        state:string;country:string;pincode:string;
    };
    about?:string;
}
interface userState {
    shopDetails:shopProfile | null,
}
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