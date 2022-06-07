import { createSlice } from '@reduxjs/toolkit';

const roomBuildings = createSlice({
  name: 'roomBuildings',
  initialState: {
    roomBuildings: null,
    isFetching: false,
    error: false,
    message: '',
  },
  reducers: {
    getRoomBuildingsStart: (state) => {
      state.isFetching = true;
    },
    getRoomBuildingsSuccess: (state, action) => {
      state.isFetching = false;
      state.roomBuildings = action.payload;
      state.error = false;
    },
    getRoomBuildingsFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.numberBedSelected = null;
      state.roomBuildings = null;
      state.message = action.payload;
    },
  },
});

export const { getRoomBuildingsStart, getRoomBuildingsSuccess, getRoomBuildingsFailed } = roomBuildings.actions;

export default roomBuildings.reducer;
