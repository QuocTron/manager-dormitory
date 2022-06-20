import { createSlice } from '@reduxjs/toolkit';

const roomDetailSlice = createSlice({
    name: 'roomDetail',
    initialState: {
        roomDetail: {
            dataRoom: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getRoomDetailStart: (state) => {
            state.roomDetail.isFetching = true;
            state.roomDetail.dataRoom = null;
        },
        getRoomDetailSuccess: (state, action) => {
            state.roomDetail.isFetching = false;
            state.roomDetail.dataRoom = action.payload;
        },
        getRoomDetailFailed: (state) => {
            state.roomDetail.isFetching = false;
            state.roomDetail.error = true;
        },
    },
});

export const { getRoomDetailStart, getRoomDetailSuccess, getRoomDetailFailed } = roomDetailSlice.actions;

export default roomDetailSlice.reducer;