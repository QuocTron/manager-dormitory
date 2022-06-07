import { createSlice } from '@reduxjs/toolkit';

const studentDetailSlice = createSlice({
  name: 'studentDetail',
  initialState: {
    studentDetail: {
      dataStudent: null,
      isFetching: false,
      error: false,
    },
    msg: '',
  },
  reducers: {
    getDetailsStudentStart: (state) => {
      state.studentDetail.isFetching = true;
    },
    getDetailsStudentSuccess: (state, action) => {
      state.studentDetail.isFetching = false;
      state.studentDetail.dataStudent = action.payload;
    },
    getDetailsStudentFailed: (state) => {
      state.studentDetail.isFetching = false;
      state.studentDetail.error = true;
    },
  },
});

export const { getDetailsStudentStart, getDetailsStudentSuccess, getDetailsStudentFailed } = studentDetailSlice.actions;

export default studentDetailSlice.reducer;
