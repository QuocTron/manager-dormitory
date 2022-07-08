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
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRoomDetail } from '~/redux/apiRequest';
import { ToastContainer } from 'react-toastify';
import './allRuleStyle.css';
import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { createAxios } from '../../lib/createAxios.js';
import { loginSuccess } from '~/redux/authSlice';
const columnsRoom = [
  {
    headerColumn: 'Tên luật lệ',
  },
  {
    headerColumn: 'Gía phạt',
  },
  {
    headerColumn: 'Hình thức phạt',
  },
];
const formatNumber = (q) => {
  return q.toLocaleString('vn-VN', {
    style: 'currency',
    currency: 'VND',
  });
};
const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
function RoomBuilding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allRules, setAllRules] = useState(null);
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    (async () => {
      if (!user) {
        navigate('/admin/login');
      }
      const res = await axios.get(`${API}ruleDormitory`, {});
      setAllRules(res.data?.allRules);
    })();
  }, [rerender]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewRoom = (navigate, dispatch, id) => {
    getRoomDetail(dispatch, navigate, id, `/admin/room/${id}`);
  };
  const [nameRule, setNameRule] = useState('');
  const [finesRule, setFinesRule] = useState(0);

  const handleChangeNameRule = (e) => {
    setNameRule(e.target.value);
  };
  const handleChangeFinesRule = (e) => {
    setFinesRule(e.target.value);
  };
  const handleAddRule = async () => {
    if (!nameRule.trim() || finesRule === 0) {
      showToastError('Bạn phải nhập đủ thông tin', 10000);
      return;
    }
    try {
      await axiosJWT.post(
        `${API}ruleDormitory/create/`,
        {
          nameRule: nameRule,
          monetaryFine: finesRule,
        },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess('Thêm thành công', 5000);
      setNameRule('');
      setFinesRule(0);
      setRerender(!rerender);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  return (
    <div className="list-room">
      <ToastContainer />
      <div className="room-container">
        <div className="data-table">
          <div className="top">
            <h2 className="title" style={{ marginBottom: '10px' }}>
              Các điều luật ktx
            </h2>
          </div>
          <div className="bottom">
            {/* <div className="datatableTitle">
              <Link to="/admin/students/new" className="link">
                Thêm Mới Phòng
              </Link>
            </div> */}
            <div className="container-rule-dormitory">
              <div className="create-new-rule">
                <div className="content-create">
                  <label className="title-search">
                    Nhập tên vi phạm:
                    <input
                      className="input-search"
                      type="text"
                      name="name"
                      value={nameRule}
                      onChange={handleChangeNameRule}
                    />
                  </label>
                  <label className="title-search">
                    Nhập mức phạt:
                    <input
                      className="input-search"
                      type="text"
                      name="name"
                      value={finesRule}
                      onChange={handleChangeFinesRule}
                    />
                  </label>

                  <Button className="outlined" onClick={handleAddRule}>
                    Tạo mới
                  </Button>
                </div>
              </div>
              <div className="list-rule-dormitory">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer component={Paper} sx={{ minWidth: 440 }} className="table">
                    <Table aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columnsRoom.map((column, index) => (
                            <TableCell key={index}>{column.headerColumn}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allRules?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRoom) => (
                          <TableRow key={dataRoom._id}>
                            <TableCell className="tableCell">
                              <span className="value-table-cell">{dataRoom.nameRule}</span>
                            </TableCell>
                            <TableCell className="tableCell">
                              {' '}
                              <span className="value-table-cell">{formatNumber(dataRoom.monetaryFine)}</span>
                            </TableCell>
                            <TableCell className="tableCell">
                              {' '}
                              <span className="value-table-cell">Đóng tiền</span>
                            </TableCell>

                            {/* <TableCell>
                              <div className="cellAction">
                                <div
                                  className="viewButton"
                                  onClick={() => handleViewRoom(navigate, dispatch, dataRoom._id)}
                                >
                                  Xem
                                </div>
                                <div className="editButton">Sửa</div>
                              </div>
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    className="table-pagination"
                    rowsPerPageOptions={[1, 10, 25, 100]}
                    component="div"
                    count={allRules?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomBuilding;
