import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Popup from 'reactjs-popup';
import Moment from 'moment';
import ItemCostOfLiving from '../../student/AllBillStudent/billCostOfLiving/itemBillCostOfLiving';
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
import { createAxios } from '~/lib/createAxios';
import { loginSuccess } from '~/redux/authSlice';
import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { ToastContainer } from 'react-toastify';
import { useDebounce } from '~/hooks';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function AllCostOfLiving(props) {
  const { statusBillCostOfLiving } = props;
  const refPopup = useRef(null);
  const { id_room } = useParams();
  const [costOfLivings, setBillCostLivings] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [indexDisabled, setIndexDisabled] = useState([]);
  const [listBillBeforeSearch, setListBillBeforeSearch] = useState([]);
  const [valueSearching, setValueSearching] = useState('');

  const navigate = useNavigate();

  const debounced = useDebounce(valueSearching, 800);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClosedDialogDetail = (e) => {
    if (refPopup.isChange) {
      setRerender(!rerender);
    }
  };
  const user = useSelector((state) => state.auth.login?.currentUser);
  const handleNotifyEmail = async (id, index) => {
    try {
      setIndexDisabled([...indexDisabled, index]);
      const res = await axiosJWT.post(
        `${API}billCostOfLiving/notification-mail/${id}`,
        {},
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  const handleEditBill = (id_bill, id_room) => {
    navigate(`/admin/bill-cost-of-living/edit/${id_bill}/${id_room}`);
  };
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const handleOpenDialogDetails = () => {
    if (refPopup) refPopup.isChange = false;
  };
  useEffect(() => {
    (async function () {
      let billCostOfLivings;
      try {
        if (!id_room) {
          switch (statusBillCostOfLiving) {
            case 'all':
              billCostOfLivings = await axiosJWT.get(`${API}billCostOfLiving/`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-debt':
              billCostOfLivings = await axiosJWT.get(`${API}billCostOfLiving/not-pay/`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-dateline':
              billCostOfLivings = await axiosJWT.get(`${API}billCostOfLiving/bill-cost-of-living/dateline`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            case 'bill-deleted':
              billCostOfLivings = await axiosJWT.get(`${API}billCostOfLiving/allBillDeleted/`, {
                headers: { token: `Bearer ${user?.accessToken}` },
              });
              break;
            default:
              break;
          }
        } else {
          billCostOfLivings = await axiosJWT.get(`${API}billCostOfLiving/roomFollow/${id_room}?page=1&limit=1/`);
        }
        setBillCostLivings(billCostOfLivings.data?.billCostOfLivings);
        setListBillBeforeSearch(billCostOfLivings.data?.billCostOfLivings);
      } catch (error) {
        showToastError(error.response.data.message, 10000);
      }
    })();
  }, [rerender]);

  useEffect(() => {
    (async () => {
      if (debounced) {
        try {
          const resSearch = await axios.get(`${API}billCostOfLiving/search/?q=${encodeURIComponent(debounced)}`);
          setBillCostLivings(resSearch?.data?.billCostOfLivings);
        } catch (error) {
          showToastError(error.response.data.message, 10000);
        }
      }
    })();
  }, [debounced]);

  const handleChangeValueSearch = (e) => {
    if (!e.target.value.trim()) {
      setBillCostLivings(listBillBeforeSearch);
      return;
    }
    setValueSearching(e.target.value);
  };
  const currentDay = new Date();
  const billCostOfLivingColumn = [
    {
      id: 'roomName',
      label: 'Phòng',
    },
    {
      id: 'memberInRoom',
      label: 'Số người trong phòng',
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
      id: 'staffCreate',
      label: 'Người lập',
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
    },
    {
      id: 'datePayment',
      label: 'Ngày thanh toán',
    },
    { id: 'action', label: 'Tác Vụ', align: 'center' },
  ];
  return (
    <div className="list">
      <ToastContainer />
      <div className="listContainer">
        <div className="datatable">
          <div className="datatableTitle"></div>
          <div className="box-title-search" style={{ padding: '10px' }}>
            <label className="title-search">
              Tìm kiếm theo phòng:
              <input
                className="input-search"
                type="text"
                name="name"
                onChange={handleChangeValueSearch}
                style={{ width: '20%' }}
              />
            </label>
          </div>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {billCostOfLivingColumn.map((column) => (
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
                  {costOfLivings?.length > 0 ? (
                    costOfLivings?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.cccd}>
                          <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell className="tableCell">{row.Room?.name}</TableCell>
                          <TableCell className="tableCell">
                            {'Có ' + row.Room?.amountBed?.filter((item) => item.student).length + ' sinh viên'}
                          </TableCell>
                          <TableCell className="tableCell">{formatNumber(row.totalPayment)}</TableCell>
                          <TableCell
                            className="tableCell"
                            style={
                              currentDay.getTime() - Date.parse(row.createdAt) >= 25 * 86400000
                                ? { color: 'red', fontSize: '14px' }
                                : !row.statusBill
                                ? { color: '#0000ff', fontSize: '14px' }
                                : {}
                            }
                          >
                            {row.statusBill
                              ? 'Đã thanh toán'
                              : currentDay.getTime() - Date.parse(row.createdAt) >= 25 * 86400000
                              ? 'Xắp hết hạn'
                              : 'Chưa thanh toán'}
                          </TableCell>
                          <TableCell className="tableCell">{row.staffCreate?.nameStaff}</TableCell>
                          <TableCell className="tableCell">{Moment(row.createdAt).format('DD/MM/YYYY')}</TableCell>
                          <TableCell className="tableCell">
                            {row.datePayment && Moment(row.datePayment).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell>
                            <div className="cellAction">
                              <Popup
                                modal
                                closeOnDocumentClick={false}
                                repositionOnResize={true}
                                onClose={(refPopup) => handleClosedDialogDetail(refPopup)}
                                ref={refPopup}
                                onOpen={handleOpenDialogDetails}
                                position="right center"
                                trigger={<button className="btn-row-cost-of-living">Xem chi tiết</button>}
                              >
                                {(close) => (
                                  <>
                                    {' '}
                                    <div className="box-close">
                                      <a className="close" onClick={close}>
                                        &times;
                                      </a>
                                    </div>
                                    <ItemCostOfLiving billCostOfLiving={row} popup={refPopup} />
                                  </>
                                )}
                              </Popup>
                              {!row.statusBill &&
                                (currentDay.getTime() - Date.parse(row.createdAt) >= 25 * 86400000 ? (
                                  <button
                                    disabled={
                                      row.isNotification ||
                                      indexDisabled.find((position) => position === index) !== undefined
                                    }
                                    className="btn-row-cost-of-living btn-notify"
                                    style={
                                      row.isNotification ||
                                      indexDisabled.find((position) => position === index) !== undefined
                                        ? { backgroundColor: '#e0ebeb' }
                                        : {}
                                    }
                                    onClick={() => handleNotifyEmail(row._id, index)}
                                  >
                                    Thông báo
                                  </button>
                                ) : (
                                  <button
                                    className="btn-row-cost-of-living btn-edit"
                                    onClick={() => handleEditBill(row._id, row.Room._id)}
                                  >
                                    Sửa
                                  </button>
                                ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableCell align="right" colspan={billCostOfLivingColumn.length}>
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
              count={costOfLivings?.length}
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

export default AllCostOfLiving;
