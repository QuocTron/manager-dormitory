import './style/listStudent.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStudentByStaff } from '~/redux/apiRequest';
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

function ListStudent() {
  //refresh
  let axiosJWT = axios.create();
  const refreshToken = async () => {
    try {
      const res = await axios.post('https://nqt-server-dormitory-manager.herokuapp.com/api/v1/staffDormitory/refresh', {
        refreshTokenStaff: Cookies.get('refreshTokenStaff'),
      });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwt_decode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers['token'] = 'Bearer ' + data.accessToken; // gắn lại token mới vào headers token
        Cookies.set('refreshTokenStaff', data.refreshToken, {
          sameSite: 'strict',
          path: '/',
        });
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
    if (user?.accessToken) {
      getListStaff(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const studentList = useSelector((state) => state.students.students?.dataStudents);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [open, setOpen] = useState(false);
  const studentRows = studentList?.students.map((student) => ({
    cccd: student.CCCD,
    idStudent: student.idStudent,
    nameStudent: student.nameStudent,
    roomName: student.roomBuilding.Room.name,
    province: student.province,
    numberPhone: student.numberPhone,
    gmail: student.email,
    status: student.__v,
    id: student._id,
  }));
  const handleViewDetails = (navigate, dispatch, id) => {
    getStudentByStaff(user?.accessToken, dispatch, navigate, id, `/admin/student/${id}`);
  };

  return (
    <div className="list">
      <div className="listContainer">
        <div className="datatable">
          <div className="datatableTitle">
            <Link to="/admin/students/new" className="link">
              Thêm Mới
            </Link>
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
