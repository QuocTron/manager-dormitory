// import './allRegistrationFormStudentStyle.css';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Moment from 'moment';
import { ToastContainer } from 'react-toastify';

// import '../../registrationFormStudent/registration.css/';
import AllFeeViolation from './allFeeViolations';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ListFeeInvoice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState('bill-debt');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  return (
    <div className="list-room">
      <ToastContainer />
      <div className="room-container">
        <div className="data-table">
          <div className="top">
            <h2 className="title">Các hóa đơn phiếu phạt</h2>
          </div>
          <div className="bottom">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={status || value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab label="TẤT CẢ BIÊN BẢN" value="all" />
                    <Tab label="CÁC BIÊN BẢN CHƯA ĐÓNG PHẠT" value="bill-debt" />
                    <Tab label="BIÊN BẢN XẮP HẾT HẠN" value="bill-dateline" />
                    <Tab label="BIÊN BẢN ĐÃ XÓA" value="bill-deleted" />
                  </TabList>
                </Box>
                <TabPanel value="all">
                  <AllFeeViolation statusViolation={status || value} />
                </TabPanel>
                <TabPanel value="bill-debt">
                  {' '}
                  <AllFeeViolation statusViolation={status || value} />
                </TabPanel>
                <TabPanel value="bill-dateline">
                  {' '}
                  <AllFeeViolation statusViolation={status || value} />
                </TabPanel>
                <TabPanel value="bill-deleted">
                  {' '}
                  <AllFeeViolation statusViolation={status || value} />
                </TabPanel>
                {/* <TabPanel value="deleted">
                  {' '}
                  <AllCostOfLiving statusBillCostOfLiving={value} />
                </TabPanel> */}
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListFeeInvoice;
