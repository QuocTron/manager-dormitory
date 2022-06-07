import { createSlice } from '@reduxjs/toolkit';

const staffListSlice = createSlice({
  name: 'staffs',
  initialState: {
    staffs: {
      dataStaffs: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getStaffsStart: (state) => {
      state.staffs.isFetching = true;
    },
    getStaffsSuccess: (state, action) => {
      state.staffs.isFetching = false;
      state.staffs.dataStaffs = action.payload;
    },
    getStaffsFailed: (state) => {
      state.staffs.isFetching = false;
      state.staffs.error = true;
    },
  },
});

export const { getStaffsStart, getStaffsSuccess, getStaffsFailed } = staffListSlice.actions;

export default staffListSlice.reducer;
