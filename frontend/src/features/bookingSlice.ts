import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        bookings: [],
        currentBooking: null,
    },
    reducers: {
        addBooking(state, action) {
            state.bookings.push(action.payload);
        },
        setCurrentBooking(state, action) {
            state.currentBooking = action.payload;
        },
        clearCurrentBooking(state) {
            state.currentBooking = null;
        },
    },
});

export const { addBooking, setCurrentBooking, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
