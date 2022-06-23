// import './allRegistrationFormStudentStyle.css';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Moment from 'moment';
import { ToastContainer } from 'react-toastify';

// import '../../registrationFormStudent/registration.css/';
import List from './List';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ListStudent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState('all');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleViewRegistration = (id) => {
    navigate(`/admin/registration-form-student/${id}`);
  };

  return (
    <div className="list-room">
      <ToastContainer />
      <div className="room-container">
        <div className="data-table">
          <div className="top">
            <h2 className="title">Danh sách sinh viên</h2>
          </div>
          <div className="bottom">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab label="TẤT CẢ SINH VIÊN" value="all" />
                    <Tab label="SINH VIÊN ĐÃ BỊ XÓA" value="deleted" />
                    {/* <Tab label="HÓA ĐƠN SẮP HẾT HẠN" value="bill-dateline" />
                    <Tab label="HÓA ĐƠN ĐÃ XÓA" value="bill-deleted" /> */}
                  </TabList>
                </Box>
                <TabPanel value="all">
                  <List />
                </TabPanel>
                <TabPanel value="deleted">
                  {' '}
                  <List />
                </TabPanel>
                {/* <TabPanel value="bill-dateline">
                  {' '}
                  <List />
                </TabPanel>
                <TabPanel value="bill-deleted">
                  {' '}
                  <List />
                </TabPanel> */}
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

export default ListStudent;
