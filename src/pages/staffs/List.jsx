import './listStaff.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getListStaff } from '~/redux/apiRequest';
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
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { loginSuccess } from '~/redux/authSlice';

const staffColumns = [
  { id: 'cccd', label: 'CCCD', align: 'center' },

  {
    id: 'nameStaff',
    label: 'Họ Và Tên',
    align: 'center',
  },

  {
    id: 'province',
    label: 'Quê Quán',
    align: 'center',
  },
  {
    id: 'phone',
    label: 'Số Điện Thoại',
    align: 'center',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    align: 'center',
  },
  {
    id: 'status',
    label: 'Trạng Thái',
    align: 'center',
  },
  { id: 'action', label: 'Tác Vụ', align: 'center' },
];

function ListStaff() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const staffList = useSelector((state) => state.staffs.staffs?.dataStaffs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = axios.create();

  const refreshToken = async () => {
    try {
      const res = await axios.post('https://nqt-server-dormitory-manager.herokuapp.com/api/v1/staffDormitory/refresh', {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp < date.getTime / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers['token'] = 'Bearer' + data.accessToken;
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
      getListStaff(user?.accessToken, dispatch);
    }
  }, []);

  const staffRows = staffList?.allStaffs.map((staff) => ({
    cccd: staff.CCCD,
    nameStaff: staff.nameStaff,
    province: staff.province,
    phone: staff.numberPhone,
    gmail: staff.email,
  }));

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

  if (staffList?.success === true) {
    return (
      <div className="list">
        <div className="listContainer">
          <div className="datatable">
            <div className="datatableTitle">
              <Link to="/" className="link">
                Thêm Mới
              </Link>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {staffColumns.map((column) => (
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
                    {staffRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.cccd}>
                          <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell className="tableCell">{row.cccd}</TableCell>
                          <TableCell className="tableCell">{row.nameStaff}</TableCell>
                          <TableCell className="tableCell">{row.province}</TableCell>
                          <TableCell className="tableCell">{row.phone}</TableCell>
                          <TableCell className="tableCell">{row.gmail}</TableCell>
                          <TableCell className="tableCell">
                            <span className={`status ${row.status}`}>{row.status}</span>
                          </TableCell>
                          <TableCell>
                            <div className="cellAction">
                              <Link to="/users/hihi" style={{ textDecoration: 'none' }}>
                                <div className="viewButton">View</div>
                              </Link>
                              <div
                              // className="deleteButton"
                              // onClick={() => handleDelete(params.row.id)}
                              >
                                Delete
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
                count={staffRows?.length}
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
}

export default ListStaff;
