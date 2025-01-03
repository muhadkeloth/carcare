import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OtpState, userdetail } from "../components/utilities/interface";



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