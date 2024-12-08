import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userProfile } from "../components/utilities/interface";

export interface userState {
    userDetails:userProfile | null,
  }

const initialState:userState = {
    userDetails:null,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser(state,action:PayloadAction<userProfile>){
            state.userDetails = action.payload;
        },
        clearUser(state){
            state.userDetails = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;