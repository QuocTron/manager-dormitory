import { createSlice } from '@reduxjs/toolkit';

const studentListSlice = createSlice({
  name: 'students',
  initialState: {
    students: {
      dataStudents: null,
      isFetching: false,
      error: false,
    },
    msg: '',
  },
  reducers: {
    getStudentsStart: (state) => {
      state.students.isFetching = true;
    },
    getStudentsSuccess: (state, action) => {
      state.students.isFetching = false;
      state.students.dataStudents = action.payload;
    },
    getStudentsFailed: (state) => {
      state.students.isFetching = false;
      state.students.error = true;
    },

    deleteStudentsStart: (state) => {
      state.students.isFetching = true;
    },
    deleteStudentsSuccess: (state, action) => {
      state.students.isFetching = false;
      state.msg = action.payload;
    },
    deleteStudentsFailed: (state, action) => {
      state.students.isFetching = false;
      state.students.error = true;
      state.msg = action.payload;
    },
  },
});

export const {
  getStudentsStart,
  getStudentsSuccess,
  getStudentsFailed,
  deleteStudentsStart,
  deleteStudentsSuccess,
  deleteStudentsFailed,
} = studentListSlice.actions;

export default studentListSlice.reducer;
