import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Moment from 'moment';
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
import Popup from 'reactjs-popup';
import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { loginSuccess } from '~/redux/authSlice';
import { createAxios } from '~/lib/createAxios.js';
import { ToastContainer } from 'react-toastify';

import ItemFeeInvoice from '~/pages/student/AllBillStudent/feeInvoices/itemFeeInvoices';
const formatNumber = (q) => {
  return q.toLocaleString('vn-VN', {
    style: 'currency',
    currency: 'VND',
  });
};
const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function AllFeeInvoices(props) {
  const { statusFeeInvoice } = props;
  const [value, setValue] = useState('1');

  const currentDay = new Date();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [indexDisabled, setIndexDisabled] = useState([]);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const [feeInvoices, setFeeInvoices] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [rerender, setRerender] = useState(true);

  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const { id_student } = useParams();

  const handleNotifyEmail = async (id, index) => {
    try {
      setIndexDisabled([...indexDisabled, index]);
      const res = await axiosJWT.post(
        `${API}feeInvoice/notification-mail/${id}`,
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

  useEffect(() => {
    (async function () {
      let feeInvoices;
      try {
        if (!id_student) {
          switch (statusFeeInvoice) {
            case 'all':
              feeInvoices = await axiosJWT.get(`${API}feeInvoice/`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-debt':
              feeInvoices = await axiosJWT.get(`${API}feeInvoice/not-payment/?page=1&limit=0`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-dateline':
              feeInvoices = await axiosJWT.get(`${API}feeInvoice//not-payment-date-line/`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-deleted':
              feeInvoices = await axiosJWT.get(`${API}feeInvoice/allDeleted/`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            default:
              break;
          }
        } else {
          feeInvoices = await axios.get(`${API}feeInvoice/student/${id_student}?page=1&limit=1/`);
        }
        setFeeInvoices(feeInvoices.data?.feeInvoices);
      } catch (error) {
        showToastError(error.response.data.message, 10000);
      }

      return () => {
        setFeeInvoices(null);
      };
    })();
  }, [rerender]);

  const studentColumns = [
    {
      id: 'nameStudent',
      label: 'Sinh viên',
    },

    {
      id: 'roomName',
      label: 'Phòng',
      width: 200,
    },

    {
      id: 'totalPrice',
      label: 'Tổng tiền',
    },
    {
      id: 'status',
      label: 'Trạng thái',
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
    },
    {
      id: 'dateLine',
      label: 'Hạn',
    },
    { id: 'action', label: 'Tác Vụ' },
  ];

  return (
    <div className="list">
      <div className="listContainer">
        <ToastContainer />
        <div className="datatable">
          <div className="datatableTitle"></div>
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
                  {feeInvoices?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.cccd}>
                        <TableCell>
                          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell className="tableCell">{row.student?.nameStudent}</TableCell>
                        <TableCell className="tableCell">{row.roomBuilding?.name}</TableCell>
                        <TableCell className="tableCell">{formatNumber(row.totalPrice)}</TableCell>
                        <TableCell
                          className="tableCell"
                          style={
                            Date.parse(row.dateLine) - currentDay.getTime() <= 15 * 86400000
                              ? { color: 'red', fontSize: '14px' }
                              : !row.statusBill
                              ? { color: '#0000ff', fontSize: '14px' }
                              : {}
                          }
                        >
                          {row.statusBill
                            ? 'Đã thanh toán'
                            : Date.parse(row.dateLine) - currentDay.getTime() <= 15 * 86400000
                            ? 'Xắp hết hạn'
                            : 'Chưa thanh toán'}
                        </TableCell>
                        <TableCell className="tableCell">
                          {row.createdAt && Moment(row.createdAt).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell className="tableCell">
                          {row.dateLine && Moment(row.dateLine).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <div className="cellAction">
                            <Popup
                              modal
                              closeOnDocumentClick={false}
                              repositionOnResize={true}
                              // onClose={handleClosedDialogDetail}
                              position="right center"
                              trigger={<button className="btn-row-cost-of-living">Xem chi tiết</button>}
                            >
                              {(close) => (
                                <>
                                  {' '}
                                  <a className="close" onClick={close}>
                                    &times;
                                  </a>
                                  <ItemFeeInvoice feeInvoice={row} statusBillCostOfLiving={statusFeeInvoice} />
                                </>
                              )}
                            </Popup>
                            {!row.statusBill &&
                              (Date.parse(row.dateLine) - currentDay.getTime() <= 15 * 86400000 ? (
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
                                  Thông báo
                                </button>
                              ) : (
                                <button className="btn-row-cost-of-living btn-edit" onClick={''}>
                                  Sửa
                                </button>
                              ))}
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
              count={feeInvoices?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              //   onPageChange={handleChangePage}
              //   onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default AllFeeInvoices;
