import './style/studentDetails.scss';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice.js';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import ItemInfoGuardian from './itemStudentInfo/itemInfoGuardian';
import AllBillStudent from './AllBillStudent/allBillStudent';
import { createAxios } from '../../lib/createAxios.js';
import { showToastError } from '~/lib/showToastMessage';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function StudentDetails() {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    console.log(newValue);
    console.log(event);
    setValue(newValue);
  };
  const { id_student } = useParams();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [avatar, setAvatar] = useState();
  const [frontImageIdentity, setFrontImageIdentity] = useState();
  const [backImageIdentity, setBackImageIdentity] = useState();
  const [detailStudent, setDetailStudent] = useState(null);
  // const studentDetail = useSelector((state) => state.studentDetail.studentDetail?.dataStudent.student);

  useEffect(() => {
    (async () => {
      let student;
      try {
        student = await axiosJWT.get(`${API}student/get-student/${id_student}`, {
          headers: { token: `Bearer ${user?.accessToken}` },
        });
        setDetailStudent(student.data.student);
      } catch (error) {
        showToastError(error.response.data.message);
      }
    })();
  });
  console.log(detailStudent);
  return (
    <div className="detail">
      <div className="detailContainer">
        <div className="top">
          <h2 className="title">Thông Tin Chi Tiết Sinh Viên KTX</h2>
        </div>
        <div className="bottom">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange}>
                  <Tab label="THÔNG TIN CHUNG" value="1" />
                  <Tab label="THÔNG TIN LIÊN HỆ" value="2" />
                  <Tab label="THÔNG TIN HÓA ĐƠN" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className="information">
                  <div className="left-1">
                    <div>
                      <label className="label-image">Hình 4x6</label>
                      <div>
                        <img
                          className="avatar"
                          src={
                            detailStudent?.avatar || 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                          }
                          alt=""
                          id="avatar"
                        />
                        <div className="formInput">
                          <input type="file" id="file" style={{ display: 'none' }} />
                        </div>
                      </div>
                    </div>
                    <div className="img-cccd">
                      <div>
                        <label className="label-image">CCCD Mặt Trước</label>
                        <div>
                          <img
                            className="frontImageIdentity"
                            src={
                              detailStudent?.frontImageIdentity ||
                              'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                            }
                            alt=""
                            id="imageFrontImageIdentity"
                          />
                          <div className="formInput">
                            <input type="file" id="frontImageIdentity" style={{ display: 'none' }} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="label-image">CCCD Mặt Sau</label>
                        <div>
                          <img
                            className="backImageIdentity"
                            src={
                              detailStudent?.backImageIdentity ||
                              'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                            }
                            alt=""
                            id="imageBackImageIdentity"
                          />
                          <div className="formInput">
                            <input type="file" id="backImageIdentity" style={{ display: 'none' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right-1">
                    <div className="title">
                      <label className="detail-title">Thông Tin Sinh Viên</label>
                    </div>
                    <div className="content-right">
                      <div className="detailItem">
                        <span className="itemKey">Họ Và Tên:</span>
                        <span className="itemValue">{detailStudent?.nameStudent}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Ngày Sinh:</span>
                        <span className="itemValue">{Moment(detailStudent?.birthDay).format('DD-MM-YYYY')}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Giới Tính:</span>
                        <span className="itemValue">{detailStudent?.gender}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">CCCD:</span>
                        <span className="itemValue">{detailStudent?.CCCD}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Mã Số Sinh Viên:</span>
                        <span className="itemValue">{detailStudent?.idStudent}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Sinh Viên Năm:</span>
                        <span className="itemValue">{detailStudent?.yearStudent}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Phòng:</span>
                        <span className="itemValue">{detailStudent?.roomBuilding.Room.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="contact-info">
                  <div className="left-2">
                    <div className="content-right">
                      <div className="box-title">
                        <label className="bill-title">Thông Tin Cư Trú, Liên Hệ</label>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Tỉnh/Thành:</span>
                        <span className="itemValue">{detailStudent?.province}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Quận/Huyện:</span>
                        <span className="itemValue">{detailStudent?.district}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Xã/Phường:</span>
                        <span className="itemValue">{detailStudent?.wards}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Địa Chỉ:</span>
                        <span className="itemValue">{detailStudent?.address}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{detailStudent?.email}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Số Điện Thoại:</span>
                        <span className="itemValue">{detailStudent?.numberPhone}</span>
                      </div>
                    </div>
                  </div>
                  {detailStudent?.guardianOfStudent.map((guardian) => (
                    <ItemInfoGuardian guardian={guardian} />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="3">
                <AllBillStudent />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
