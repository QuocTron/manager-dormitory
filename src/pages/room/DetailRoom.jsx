import './styleRoom.scss';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Moment from 'moment';
import Button from '@mui/material/Button';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { ToastContainer } from 'react-toastify';
// import ItemCostOfLiving from '../student/AllBillStudent/billCostOfLiving/itemBillCostOfLiving';
import AllCostLiving from '../allBillStudent/allCostOfLiving/AllCostLivings';

const columnsListStudent = [
  { headerColumn: 'Giường' },
  { headerColumn: 'Họ Tên Sinh Viên' },
  { headerColumn: 'CCCD' },
  { headerColumn: 'Số điện thoại' },
  { headerColumn: 'Email' },
  { headerColumn: 'Option' },
];
const columnsListBillCostOfLiving = [
  { headerColumn: 'Phòng' },
  { headerColumn: 'Ngày chốt số' },
  { headerColumn: 'Tổng tiền phải thanh toán' },
  { headerColumn: 'Ghi chú' },
  { headerColumn: 'Trạng thái hóa đơn' },
  { headerColumn: 'Ngày thanh toán' },
  { headerColumn: 'Nhân viên khỏi tạo' },
  { headerColumn: 'Option' },
];

function DetailRoom() {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const { id_room } = useParams();
  const [detailRoom, setDetailRoom] = useState();
  const [rerender, setRerender] = useState();

  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  useEffect(() => {
    (async () => {
      if (!user) {
        navigate('/admin/login');
      }
      const res = await axios.get(
        `https://nqt-server-dormitory-manager.herokuapp.com/api/v1/roomBuilding/` + id_room,
        {},
      );
      setDetailRoom(res.data?.roomBuilding);
    })();
  }, [rerender]);
  const handleCreateBill = (e) => {
    navigate(`/admin/room/${id_room}/create-bill`);
  };
  const handleShowAll = (value) => {
    navigate(`/admin/room/cost-livings/`);
  };
  //! sendMail multi
  const handleSendMailNotification = () => {
    console.log('value');
  };
  const handleShowDetailStudent = (id) => {
    console.log(id);
    navigate(`/admin/student/${id}`);
  };
  const handleClosedDialogDetail = () => {
    const valueUpdate = value;
    setValue(valueUpdate);
    setRerender(valueUpdate);
  };
  console.log('render lại nè');
  return (
    <div className="detailContainer">
      <ToastContainer />
      <div className="top">
        <h2 className="title">{detailRoom?.name}</h2>
      </div>
      <div className="bottom">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="THÔNG TIN PHÒNG" value="1" />
                <Tab label="DANH SÁCH SINH VIÊN PHÒNG" value="2" />
                <Tab label="HÓA ĐƠN TRONG PHÒNG" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="content-tab-1">
                <div className="room-info">
                  <div className="detailItem">
                    <span className="itemKey">Tên Phòng:</span>
                    <span className="itemValue">{detailRoom?.name}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Tầng:</span>
                    <span className="itemValue">{detailRoom?.building.name}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Loại Tầng:</span>
                    <span className="itemValue">{detailRoom?.building.floorGender}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Số Lượng Giường:</span>
                    <span className="itemValue">{detailRoom?.amountBed.length}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Giá Phòng:</span>
                    <span className="itemValue">{detailRoom?.priceRoom && formatNumber(detailRoom?.priceRoom)}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Trạng Thái:</span>

                    <span
                      className="value-table-cell"
                      style={
                        detailRoom?.amountBed?.filter((item) => item.student == null).length === 0
                          ? { color: 'red' }
                          : {}
                      }
                    >
                      {detailRoom?.amountBed?.filter((item) => item.student == null).length === 0
                        ? 'Hết giường'
                        : 'Còn giường'}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Sinh viên trong phòng:</span>

                    <span className="value-table-cell">
                      {detailRoom?.amountBed?.filter((item) => item.student !== null).length +
                        '/' +
                        detailRoom?.amountBed.length}
                    </span>
                  </div>
                </div>
                <div className="box-btn-actions-create-bill-cost-living">
                  <button className="btn-bill btn-show-all-bill-cost-living" onClick={handleShowAll}>
                    Xem tất cả hóa đơn
                  </button>{' '}
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="content-tab-2">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer component={Paper} className="table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          {columnsListStudent.map((column, index) => (
                            <TableCell key={index}>{column.headerColumn}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailRoom?.amountBed.map((studentInBed) => (
                          <TableRow key={studentInBed._id}>
                            <TableCell className="tableCell">{studentInBed.numberBed}</TableCell>
                            <TableCell className="tableCell">{studentInBed.student?.nameStudent}</TableCell>
                            <TableCell className="tableCell">{studentInBed.student?.CCCD}</TableCell>
                            <TableCell className="tableCell">{studentInBed.student?.numberPhone}</TableCell>
                            <TableCell className="tableCell">{studentInBed.student?.email}</TableCell>
                            <TableCell className="tableCell">
                              <Button
                                variant="contained"
                                onClick={() => handleShowDetailStudent(studentInBed.student._id)}
                              >
                                Xem chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="content-tab-2">
                <AllCostLiving />
              </div>
            </TabPanel>
          </TabContext>
        </Box>
        <div className="box-button-create">
          {detailRoom?.amountBed.filter((item) => item.student).length > 0 && (
            <button className="btn-bill btn-create-bill-cost-living" onClick={handleCreateBill}>
              Tạo Hóa Đơn Điện/Nước
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailRoom;
