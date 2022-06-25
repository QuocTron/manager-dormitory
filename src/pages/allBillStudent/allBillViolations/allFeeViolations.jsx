import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Moment from 'moment';
import Popup from 'reactjs-popup';
import { useDispatch } from 'react-redux';
import { createAxios } from '../../../lib/createAxios';
import { loginSuccess } from '../../../redux/authSlice';
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
import { showToastError, showToastSuccess } from '../../../lib/showToastMessage';
import { ToastContainer } from 'react-toastify';
import { useDebounce } from '~/hooks';
import ItemViolationRecord from '~/pages/student/AllBillStudent/violation/itemViolations';

function AllFeeViolation(props) {
  const { statusViolation } = props;
  const [value, setValue] = useState('1');
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const { id_student } = useParams();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [indexDisabled, setIndexDisabled] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rerender, setRerender] = useState(true);
  const refPopup = useRef(null); // trart current với giá trị bằng null
  const [valueSearching, setValueSearching] = useState('');
  const [listViolationRecordBefore, setListViolationRecordBefore] = useState([]);

  const debounced = useDebounce(valueSearching, 800);

  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
  const [billViolations, setBillViolations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleClosedDialogDetail = (e) => {
    console.log(refPopup.isChange);
    if (refPopup.isChange) setRerender(!rerender);
  };
  const handleOpenDialogDetails = () => {
    if (refPopup) refPopup.isChange = true;
  };
  const handleNotifyEmail = async (id, index) => {
    try {
      setIndexDisabled([...indexDisabled, index]);
      const res = await axiosJWT.post(
        `${API}violationRecord/notification-email-violation-record/${id}`,
        { content: '' },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );

      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.date.message, 10000);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async function () {
      let feeViolations;
      try {
        if (!id_student) {
          console.log(statusViolation);
          switch (statusViolation) {
            case 'all':
              feeViolations = await axios.get(`${API}violationRecord/?page=1&limit=0`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-debt':
              feeViolations = await axiosJWT.get(`${API}violationRecord/?page=1&limit=0&status=false`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-dateline':
              feeViolations = await axiosJWT.get(`${API}violationRecord/allDeleted`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });

              break;
            case 'bill-deleted':
              feeViolations = await axiosJWT.get(`${API}violationRecord/allDeleted`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            default:
              // console.log(statusViolation);
              // feeViolations = await axiosJWT.get(`http://localhost:5000/api/v1/violationRecord/?page=1&limit=0`, {
              //   headers: { token: `Bearer ${user?.accessToken}` },
              // });
              break;
          }
        } else {
          feeViolations = await axiosJWT.get(`${API}violationRecord/violation/student/${id_student}?page=1&limit=1/`, {
            headers: { token: `Bearer ${user?.accessToken}` },
          });
        }
      } catch (error) {
        showToastError(error.response.data.message, 10000);
      }

      setBillViolations(feeViolations.data?.violationRecords);
      setListViolationRecordBefore(feeViolations.data?.violationRecords);
    })();
  }, [rerender]);

  const handleEditViolationRecord = (id_violation, id_student) => {
    navigate(`/admin/student/edit/violation/${id_violation}/${id_student}`);
  };
  useEffect(() => {
    (async () => {
      if (debounced) {
        try {
          const resSearch = await axios.get(`${API}violationRecord/search?q=${encodeURIComponent(debounced)}`);
          setBillViolations(resSearch?.data?.violationRecords);
        } catch (error) {
          showToastError(error.response.data.message, 10000);
        }
      }
    })();
  }, [debounced]);
  const handleChangeValueSearch = (e) => {
    if (!e.target.value.trim()) {
      setBillViolations(listViolationRecordBefore);
      return;
    }
    setValueSearching(e.target.value);
  };
  const violationColumn = [
    {
      id: 'nameStudent',
      label: 'Sinh viên',
      align: 'center',
    },
    {
      id: 'roomName',
      label: 'Phòng',
      width: 200,
      align: 'center',
    },

    {
      id: 'totalPrice',
      label: 'Tổng tiền',
      align: 'center',
    },
    {
      id: 'status',
      label: 'Trạng thái',
      align: 'center',
    },
    {
      id: 'staffCreate',
      label: 'Người lập',
      align: 'center',
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      align: 'center',
    },
    {
      id: 'dateLine',
      label: 'Hạn',
      align: 'center',
    },
    { id: 'action', label: 'Tác Vụ', align: 'center' },
  ];
  return (
    <div className="list">
      <div className="listContainer">
        <ToastContainer />
        <div className="datatable">
          <div className="datatableTitle"></div>
          <div className="box-title-search">
            <label className="title-search">
              Tìm kiếm theo tên:
              <input className="input-search" type="text" name="name" onChange={handleChangeValueSearch} />
            </label>
          </div>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {violationColumn.map((column) => (
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
                  {billViolations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.cccd}>
                        <TableCell>
                          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell className="tableCell">{row.student?.nameStudent}</TableCell>
                        <TableCell className="tableCell">{row.student?.roomBuilding?.Room?.name}</TableCell>

                        <TableCell className="tableCell">{formatNumber(row.totalViolationRecord)}</TableCell>
                        <TableCell
                          className="tableCell"
                          style={row?.statusBill !== true ? { color: 'red', fontSize: '14px', fontWeight: 'bold' } : {}}
                        >
                          {' '}
                          {row?.statusBill === true ? 'Đã đóng phạt' : 'Chưa đóng phạt'}
                        </TableCell>
                        <TableCell className="tableCell">{row.staffCreate?.nameStaff}</TableCell>
                        <TableCell className="tableCell">{Moment(row.createdAt).format('DD/MM/YYYY')}</TableCell>
                        <TableCell className="tableCell">{Moment(row.dateLine).format('DD/MM/YYYY')}</TableCell>
                        <TableCell>
                          <div className="cellAction">
                            <Popup
                              modal
                              closeOnDocumentClick={false}
                              repositionOnResize={true}
                              onClose={handleClosedDialogDetail}
                              position="right center"
                              ref={refPopup}
                              className="popup-container-violation"
                              onOpen={handleOpenDialogDetails}
                              trigger={<button className="btn-row-cost-of-living">Xem chi tiết</button>}
                            >
                              {(close) => (
                                <>
                                  {' '}
                                  <div className="box-close">
                                    <span className="close" onClick={close}>
                                      &times;
                                    </span>
                                  </div>
                                  <ItemViolationRecord violation={row} popup={refPopup} />
                                </>
                              )}
                            </Popup>
                            {!row.statusBill && (
                              <>
                                <button
                                  className="btn-row-cost-of-living btn-edit"
                                  onClick={() => handleEditViolationRecord(row._id, row.student._id)}
                                >
                                  Sửa
                                </button>
                                <button
                                  disabled={row.isNotification || indexDisabled.includes(index)}
                                  className="btn-row-cost-of-living btn-notify"
                                  style={
                                    row.isNotification || indexDisabled.includes(index)
                                      ? { backgroundColor: '#e0ebeb' }
                                      : {}
                                  }
                                  onClick={() => handleNotifyEmail(row._id, index)}
                                >
                                  Cảnh báo
                                </button>
                              </>
                            )}
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
              count={billViolations?.length}
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

export default AllFeeViolation;
