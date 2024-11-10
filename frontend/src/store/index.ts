import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.ts';
import otpReducer from '../features/otpSlice.ts';


const store = configureStore({
    reducer:{
        otp:otpReducer,
        user: userReducer,
        // booking:bookingReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;