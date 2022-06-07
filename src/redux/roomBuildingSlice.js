import { createSlice } from '@reduxjs/toolkit';

const roomBuilding = createSlice({
  name: 'roomBuilding',
  initialState: {
    roomBuilding: 0,
    message: '',
    numberBedSelected: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    getRoomBuildingStart: (state) => {
      state.isFetching = true;
    },
    getRoomBuildingSuccess: (state, action) => {
      const { numberBedSelected, ...payload } = action.payload;
      state.isFetching = false;
      state.roomBuilding = payload;
      state.numberBedSelected = numberBedSelected ? numberBedSelected : 0;
      state.message = '';
      state.error = false;
    },
    getRoomBuildingFailed: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.numberBedSelected = null;
      state.roomBuilding = null;
      state.message = action.payload;
    },
  },
});

export const { getRoomBuildingStart, getRoomBuildingSuccess, getRoomBuildingFailed } = roomBuilding.actions;

export default roomBuilding.reducer;
