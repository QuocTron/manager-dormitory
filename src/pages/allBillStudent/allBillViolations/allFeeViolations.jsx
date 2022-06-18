import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Moment from 'moment';
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

function AllFeeViolation(props) {
  const { statusViolation } = props;
  const [value, setValue] = useState('1');
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const id_student = useParams();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();

  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
  const [billViolations, setBillViolations] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [open, setOpen] = useState(false);

  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);

  useEffect(() => {
    (async function () {
      let feeViolations;
      try {
        if (!id_student) {
          switch (statusViolation) {
            case 'all':
              feeViolations = await axiosJWT.get(`${API}violationRecord/?page=1&limit=0`);
              setBillViolations(feeViolations);
              break;
            case 'bill-debt':
              feeViolations = await axiosJWT.get(`${API}violationRecord/?page=1&limit=0&status=false`);
              setBillViolations(feeViolations);
              break;
            case 'bill-dateline':
              feeViolations = await axiosJWT.get(`${API}violationRecord/allDeleted`);
              setBillViolations(feeViolations);
              break;
            case 'bill-delete':
              feeViolations = await axiosJWT.get(`${API}violationRecord/allBillDeleted?page=1&limit=1&status=true`);
              setBillViolations(feeViolations);
              break;
            default:
              break;
          }
        }
      } catch (error) {}
      if (student && student.success) {
        const studentId = student?.student?._id;

        const billViolations = await axiosJWT.get(
          `${API}violationRecord/violation/student/${studentId}?page=1&limit=1/`,
        );
        setBillViolations(billViolations.data?.violationRecords);
      }
      return () => {
        setBillViolations(null);
      };
    })();
  }, []);

  const studentColumns = [
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
                  {billViolations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
