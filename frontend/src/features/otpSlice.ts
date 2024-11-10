import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type userdetail = {username:string;phoneNumber:string;email:string; password:string;otp?:string}
interface OtpState {
    signupDetails:userdetail | null;
};

const initialState:OtpState = {
    signupDetails:null,
}

const otpSlice = createSlice({
    name:'otp',
    initialState,
    reducers:{
        setSignupDetails(state,action:PayloadAction<userdetail>){
            state.signupDetails = action.payload;
        },
        setResetOtp(state,action:PayloadAction<string>){
            if(state.signupDetails){
                state.signupDetails.otp = action.payload;
            }
        },
        clearOtpState(state) {
            state.signupDetails = null;
        }
    }
})

export const { setSignupDetails, setResetOtp, clearOtpState } = otpSlice.actions;
export default otpSlice.reducer;