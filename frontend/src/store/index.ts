import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.ts';
import otpReducer from '../features/otpSlice.ts';
import shopReducer from '../features/shopSlice.ts';
import bookingdetailsReducer from '../features/bookingSlice.ts';
import estimateReducer from '../features/estimateSlice.ts';


const store = configureStore({
    reducer:{
        otp:otpReducer,
        user: userReducer,
        shop:shopReducer,
        bookingdetails:bookingdetailsReducer,
        estimate:estimateReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;