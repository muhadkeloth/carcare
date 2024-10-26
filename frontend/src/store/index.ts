import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.ts';


const store = configureStore({
    reducer:{
        user: userReducer,
        // booking:bookingReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;