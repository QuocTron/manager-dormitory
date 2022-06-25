import './style/listStudent.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getListStudent, getStudentByStaff } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Cookies from 'js-cookie';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { loginSuccess } from '~/redux/authSlice';
import { getListStaff } from '~/redux/apiRequest';
import { createAxios } from '../../lib/createAxios';
import { showToastError } from '~/lib/showToastMessage';
import { useDebounce } from '~/hooks';

const studentColumns = [
  { id: 'cccd', label: 'CCCD', align: 'center', fontStyle: 'bold' },

  { id: 'idStudent', label: 'MSSV', align: 'center' },

  {
    id: 'nameStudent',
    label: 'Họ Và Tên',
    align: 'center',
  },

  {
    id: 'roomName',
    label: 'Phòng',
    width: 200,
    align: 'center',
  },

  {
    id: 'province',
    label: 'Quê Quán',
    align: 'center',
  },
  {
    id: 'numberPhone',
    label: 'Số Điện Thoại',
    align: 'center',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    align: 'center',
  },
  { id: 'action', label: 'Tác Vụ', align: 'center' },
];
const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ListStudent() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const studentList = useSelector((state) => state.students.students?.dataStudents);

  const [listStudent, setListStudent] = useState(studentList.students || []);
  const [valueSearching, setValueSearching] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const refreshToken = Cookies.get('refreshTokenStaff');
  const debounced = useDebounce(valueSearching, 800);

  useEffect(() => {
    if (!user && refreshToken) {
      navigate('/admin/login');
    }
    if (user?.accessToken) {
    }
    getListStudent(user?.accessToken, dispatch, axiosJWT);
  }, []);

  useEffect(() => {
    (async () => {
      if (debounced) {
        try {
          const resSearch = await axios.get(`${API}student/search?q=${encodeURIComponent(debounced)}`);
          setListStudent(resSearch.data.students);
        } catch (error) {
          showToastError(error.response.data.message, 10000);
        }
      }
    })();
  }, [debounced]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [open, setOpen] = useState(false);

  const handleViewDetails = (navigate, dispatch, id) => {
    getStudentByStaff(user?.accessToken, dispatch, navigate, id, `/admin/student/${id}`, axiosJWT);
  };

  const handleChangValueSearch = async (e) => {
    if (!e.target.value.trim()) {
      setListStudent(studentList?.students);
      return;
    }
    setValueSearching(e.target.value);
  };
  const studentRows = listStudent.map((student) => ({
    cccd: student?.CCCD,
    idStudent: student?.idStudent,
    nameStudent: student?.nameStudent,
    roomName: student?.roomBuilding?.Room?.name,
    province: student?.province,
    numberPhone: student?.numberPhone,
    gmail: student?.email,
    status: student.__v,
    id: student?._id,
  }));
  return (
    <div className="list">
      <div className="listContainer">
        <div className="datatable">
          <div className="datatableTitle">
            <Link to="/admin/students/new" className="link">
              Thêm Mới
            </Link>
            <div className="box-title-search">
              <label className="title-search">
                Tìm kiếm :
                <input className="input-search" type="text" name="name" onChange={(e) => handleChangValueSearch(e)} />
              </label>
            </div>
          </div>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {studentColumns.map((column) => (
                      <TableCell
                        className="headerName"
                        key={column.id}
                        align={column.align}
                        style={{ fontStyle: column.fontStyle }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.cccd}>
                        <TableCell>
                          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell className="tableCell">{row.cccd}</TableCell>
                        <TableCell className="tableCell">{row.idStudent}</TableCell>
                        <TableCell className="tableCell">{row.nameStudent}</TableCell>
                        <TableCell className="tableCell">{row.roomName}</TableCell>
                        <TableCell className="tableCell">{row.province}</TableCell>
                        <TableCell className="tableCell">{row.numberPhone}</TableCell>
                        <TableCell className="tableCell">{row.gmail}</TableCell>
                        <TableCell>
                          <div className="cellAction">
                            <div className="viewButton" onClick={() => handleViewDetails(navigate, dispatch, row.id)}>
                              Xem
                            </div>
                            <div className="editButton" onClick={() => handleViewDetails(row.id)}>
                              Sửa
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[1, 10, 25, 100]}
              component="div"
              count={studentRows?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default ListStudent;
