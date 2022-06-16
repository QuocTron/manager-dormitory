// import './allRegistrationFormStudentStyle.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { showToastError } from '~/lib/showToastMessage';
import { ToastContainer } from 'react-toastify';
import Moment from 'moment';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
const columnsRegistration = [
  {},
  {
    headerColumn: 'Họ tên sinh viên',
  },
  {
    headerColumn: 'CCCD',
  },
  {
    headerColumn: 'Số điện thoại',
  },
  {
    headerColumn: 'Email',
  },
  {
    headerColumn: 'Quê quán',
  },
  {
    headerColumn: 'Địa chỉ cụ thể',
  },
  {
    headerColumn: 'Phòng',
  },
  {
    headerColumn: 'Giường',
  },
  {
    headerColumn: 'Trạng thái',
  },
  {
    headerColumn: 'Số ngày ở',
  },
  {
    headerColumn: 'Ngày vào',
  },
  {
    headerColumn: 'Ngày ra',
  },
  {
    headerColumn: 'Option',
  },
];

function AllRegistrationForm(props) {
  const { statusRegistrations } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);

  const [registrations, setRegistrations] = useState(null);
  const refreshToken = Cookies.get('refreshTokenStaff');
  useEffect(() => {
    (async () => {
      if (!user || !refreshToken) {
        navigate('/admin/login');
      }
      let res;
      try {
        switch (statusRegistrations) {
          case 'all':
            res = await axios.get(`${API}registrationAtDormitory/registration-follow-status/?page=1`);
            break;
          case 'confirming':
          case 'denied':
          case 'confirmed':
            res = await axios.get(
              `${API}registrationAtDormitory/registration-follow-status/?search=${statusRegistrations}&page=1`,
            );
            break;
          case 'deleted':
            res = await axios.get(`${API}registrationAtDormitory/allDeleted/`, {
              headers: { token: `Bearer ${user?.accessToken}` },
            });
            break;
          default:
            // showToastError('Không có tab nào phù hợp', 10000);
            break;
        }
        setRegistrations(res.data?.registrations);
      } catch (error) {
        showToastError(error.response.data.message, 10000);
      }
    })();
  }, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleViewRegistration = (id) => {
    navigate(`/admin/registration-form-student/${id}/${statusRegistrations}`);
  };
  let date = new Date();
  return (
    <div className="list-room">
      <div className="room-container">
        <div className="data-table">
          <div className="bottom">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer component={Paper} sx={{ maxHeight: 600 }} className="table">
                <Table sx={{ minWidth: '100%' }} stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {columnsRegistration.map((column, index) => (
                        <TableCell key={index} style={{ fontStyle: column.fontStyle }} align="center">
                          {column.headerColumn}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrations?.length > 0 ? (
                      registrations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((registration) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={registration._id}>
                          <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>

                          <TableCell className="tableCell">
                            <span className="value-table-cell">{registration.student?.nameStudent}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            {' '}
                            <span className="value-table-cell">{registration.student?.CCCD}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            {' '}
                            <span className="value-table-cell">{registration.student?.numberPhone}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            {' '}
                            <span className="value-table-cell">{registration.student?.email}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span className="value-table-cell">{registration.student?.province}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span className="value-table-cell">
                              {registration.student?.address +
                                ', ' +
                                registration.student?.wards +
                                ', ' +
                                registration.student?.district +
                                ', ' +
                                registration.student?.province}
                            </span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span className="value-table-cell">{registration.student?.roomBuilding?.Room?.name}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span className="value-table-cell">{registration.student?.roomBuilding?.Bed}</span>
                          </TableCell>
                          <TableCell
                            className="tableCell"
                            style={
                              (() => {
                                switch (registration?.status) {
                                  case 'confirming':
                                    return { color: '#009900', fontSize: '16px', fontWeight: '700' };
                                  case 'confirmed':
                                    return { color: '#000000', fontSize: '16px', fontWeight: '700' };

                                  case 'denied':
                                    return { color: '#ff0000', fontSize: '16px', fontWeight: '700' };

                                  default:
                                    return { color: '#0000b3', fontSize: '16px', fontWeight: '700' };
                                }
                              })()
                              // Date.parse(registrationFormStudent?.dateCheckInRoom) - date.getTime() < 15 * 24 * 3600000
                              //   ? { background: 'red' }
                              //   : { background: 'green' }
                            }
                          >
                            {(() => {
                              switch (registration?.status) {
                                case 'confirming':
                                  return <span className="value-table-cell">{'Đang chờ xác nhận'}</span>;
                                case 'confirmed':
                                  return <span className="value-table-cell">{'Đã xác nhận'}</span>;
                                case 'denied':
                                  return <span className="value-table-cell">{'Bị từ chối'}</span>;

                                default:
                                  return <span className="value-table-cell">{'Đã hủy'}</span>;
                              }
                            })()}
                            <span className="value-table-cell">{}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span className="value-table-cell">{registration.timeIn}</span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span className="value-table-cell">
                              {registration.dateCheckInRoom &&
                                Moment(registration.dateCheckInRoom).format('DD/MM/YYYY')}
                            </span>
                          </TableCell>
                          <TableCell className="tableCell">
                            <span
                              className="value-table-cell"
                              style={
                                Date.parse(registration?.dateCheckOutRoom) - date.getTime() < 15 * 24 * 3600000
                                  ? { color: '#b30000', fontSize: '16px', fontWeight: 'bold' }
                                  : { color: '#29a329', fontSize: '16px', fontWeight: 'bold' }
                              }
                            >
                              {registration.dateCheckOutRoom &&
                                Moment(registration.dateCheckOutRoom).format('DD/MM/YYYY')}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="cellAction">
                              <div className="viewButton" onClick={() => handleViewRegistration(registration._id)}>
                                Xem
                              </div>
                              {registration.status === 'confirmed' &&
                                (Date.parse(registration?.dateCheckOutRoom) - date.getTime() < 15 * 24 * 3600000 ? (
                                  <div className="editButton">Thông báo</div>
                                ) : (
                                  <div className="editButton">Sửa</div>
                                ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableCell align="right" colspan={columnsRegistration.length}>
                        <div className="show-status">
                          <span className="title-status">Đang cập nhật...!!!</span>
                        </div>
                      </TableCell>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                className="table-pagination"
                rowsPerPageOptions={[1, 10, 25, 100]}
                component="div"
                count={registrations?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllRegistrationForm;
