// import './allRegistrationFormStudentStyle.css';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Moment from 'moment';

// import '../../registrationFormStudent/registration.css/';
import AllCostOfLiving from './AllCostLivings';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ListRegistrationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState('bill-debt');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleViewRegistration = (id) => {
    navigate(`/admin/registration-form-student/${id}`);
  };

  return (
    <div className="list-room">
      <div className="room-container">
        <div className="data-table">
          <div className="top">
            <h2 className="title">Các hóa đơn điện nước</h2>
          </div>
          <div className="bottom">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab label="TẤT CẢ HÓA ĐƠN" value="all" />
                    <Tab label="CÁC HÓA ĐƠN ĐANG NỢ" value="bill-debt" />
                    <Tab label="HÓA ĐƠN SẮP HẾT HẠN" value="bill-dateline" />
                    <Tab label="HÓA ĐƠN ĐÃ XÓA" value="bill-deleted" />
                  </TabList>
                </Box>
                <TabPanel value="all">
                  <AllCostOfLiving statusBillCostOfLiving={value} />
                </TabPanel>
                <TabPanel value="bill-debt">
                  {' '}
                  <AllCostOfLiving statusBillCostOfLiving={value} />
                </TabPanel>
                <TabPanel value="bill-dateline">
                  {' '}
                  <AllCostOfLiving statusBillCostOfLiving={value} />
                </TabPanel>
                <TabPanel value="bill-deleted">
                  {' '}
                  <AllCostOfLiving statusBillCostOfLiving={value} />
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

export default ListRegistrationForm;
