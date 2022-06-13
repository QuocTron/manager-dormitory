import './style/studentDetails.scss';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Moment from 'moment';
import ItemInfoGuardian from './itemStudentInfo/itemInfoGuardian';
import AllBillStudent from './AllBillStudent/allBillStudent';

function StudentDetails() {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    console.log(newValue);
    console.log(event);
    setValue(newValue);
  };
  const [avatar, setAvatar] = useState();
  const [frontImageIdentity, setFrontImageIdentity] = useState();
  const [backImageIdentity, setBackImageIdentity] = useState();
  const studentDetail = useSelector((state) => state.studentDetail.studentDetail?.dataStudent.student);

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
                            avatar
                              ? URL.createObjectURL(avatar)
                              : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                          }
                          alt=""
                          id="avatar"
                        />
                        <div className="formInput">
                          <label htmlFor="file">
                            Tải lên: <DriveFolderUploadOutlinedIcon className="icon" />
                          </label>
                          <input
                            type="file"
                            id="file"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            style={{ display: 'none' }}
                          />
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
                              frontImageIdentity
                                ? URL.createObjectURL(frontImageIdentity)
                                : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                            }
                            alt=""
                            id="imageFrontImageIdentity"
                          />
                          <div className="formInput">
                            <label htmlFor="frontImageIdentity">
                              Tải lên: <DriveFolderUploadOutlinedIcon className="icon" />
                            </label>
                            <input
                              type="file"
                              id="frontImageIdentity"
                              onChange={(e) => setFrontImageIdentity(e.target.files[0])}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="label-image">CCCD Mặt Sau</label>
                        <div>
                          <img
                            className="backImageIdentity"
                            src={
                              backImageIdentity
                                ? URL.createObjectURL(backImageIdentity)
                                : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                            }
                            alt=""
                            id="imageBackImageIdentity"
                          />
                          <div className="formInput">
                            <label htmlFor="backImageIdentity" className="">
                              Tải lên: <DriveFolderUploadOutlinedIcon className="icon" />
                            </label>
                            <input
                              type="file"
                              id="backImageIdentity"
                              onChange={(e) => setBackImageIdentity(e.target.files[0])}
                              style={{ display: 'none' }}
                            />
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
                        <span className="itemValue">{studentDetail?.nameStudent}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Ngày Sinh:</span>
                        <span className="itemValue">{Moment(studentDetail?.birthDay).format('DD-MM-YYYY')}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Giới Tính:</span>
                        <span className="itemValue">{studentDetail?.gender}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">CCCD:</span>
                        <span className="itemValue">{studentDetail?.CCCD}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Mã Số Sinh Viên:</span>
                        <span className="itemValue">{studentDetail?.idStudent}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Sinh Viên Năm:</span>
                        <span className="itemValue">{studentDetail?.yearStudent}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Phòng:</span>
                        <span className="itemValue">{studentDetail?.roomBuilding.Room.name}</span>
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
                        <span className="itemValue">{studentDetail?.province}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Quận/Huyện:</span>
                        <span className="itemValue">{studentDetail?.district}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Xã/Phường:</span>
                        <span className="itemValue">{studentDetail?.wards}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Địa Chỉ:</span>
                        <span className="itemValue">{studentDetail?.address}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{studentDetail?.email}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Số Điện Thoại:</span>
                        <span className="itemValue">{studentDetail?.numberPhone}</span>
                      </div>
                    </div>
                  </div>
                  {studentDetail?.guardianOfStudent.map((guardian) => (
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
