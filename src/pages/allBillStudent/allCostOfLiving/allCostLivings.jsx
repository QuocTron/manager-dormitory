import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
const formatNumber = (q) => {
  return q.toLocaleString('vn-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

function AllCostOfLiving() {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
  const [costOfLivings, setBillCostLivings] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);

  useEffect(() => {
    (async function () {
      if (student && student.success) {
        const roomId = student?.student?.roomBuilding?.Room?._id;
        const billCostOfLivings = await axios.get(`${API}billCostOfLiving/roomFollow/${roomId}?page=1&limit=1/`);
        setBillCostLivings(billCostOfLivings.data?.billCostOfLivings);
      }
      return () => {
        setBillCostLivings(null);
      };
    })();
  }, []);
  console.log(costOfLivings);

  const studentColumns = [
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
                  {costOfLivings?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.cccd}>
                        <TableCell>
                          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell className="tableCell">{row.Room?.name}</TableCell>
                        <TableCell className="tableCell">{formatNumber(row.totalPayment)}</TableCell>
                        <TableCell className="tableCell">
                          {row.statusBill === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </TableCell>
                        <TableCell className="tableCell">{row.staffCreate?.nameStaff}</TableCell>
                        <TableCell className="tableCell">{Moment(row.createdAt).format('DD/MM/YYYY')}</TableCell>
                        <TableCell className="tableCell">{Moment(row.dateLine).format('DD/MM/YYYY')}</TableCell>
                        <TableCell>
                          <div className="cellAction">
                            <div className="viewButton" onClick={''}>
                              Xem
                            </div>
                            <div className="editButton" onClick={''}>
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
              count={costOfLivings?.length}
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

export default AllCostOfLiving;
