import './style/new.scss';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import useLocationForm from '~/components/Province/useLocationForm';
import axios from 'axios';
import Select from 'react-select';
import TableTemplate from '@trendmicro/react-table';

function NewStudent() {
  const yearOptions = [
    { value: 1, label: 'Năm 1' },
    { value: 2, label: 'Năm 2' },
    { value: 3, label: 'Năm 3' },
    { value: 4, label: 'Năm 4' },
    { value: 5, label: 'Năm 5' },
  ];
  const [selectYear, setSelectYear] = useState();
  const handleSelect = (e) => {
    setSelectYear(e.value);
  };
  const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm(false);
  const { cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard } = state;
  var formData = new FormData();
  const [avatar, setAvatar] = useState();
  const [frontImageIdentity, setFrontImageIdentity] = useState();
  const [backImageIdentity, setBackImageIdentity] = useState();
  const [data, setData] = useState({
    CCCD: '',
    idStudent: '',
    nameStudent: '',
    numberPhone: '',
    email: '',
    address: '',
  });
  const url = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/student/create/';
  const AddDataStudent = async (e) => {
    e.preventDefault();
    formData.append('CCCD', data.CCCD);
    formData.append('idStudent', data.idStudent);
    formData.append('nameStudent', data.nameStudent);
    formData.append('numberPhone', data.numberPhone);
    formData.append('email', data.email);
    formData.append('yearStudent', selectYear);
    formData.append('address', data.address);
    formData.append('province', state.selectedCity?.label);
    formData.append('district', state.selectedDistrict?.label);
    formData.append('wards', state.selectedWard?.label);
    formData.append('room', '6266c8287155aee350956f30');
    formData.append('numberBed', 4);
    formData.append('timeIn', 50);
    formData.append('CCCDGuardian', data.CCCDGuardian);
    formData.append('nameGuardian', data.nameGuardian);
    formData.append('avatar', avatar);
    formData.append('frontImageIdentity', frontImageIdentity);
    formData.append('backImageIdentity', backImageIdentity);
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  };

  const columns = [
    {
      title: 'Event Type',
      dataKey: 'eventType',
    },
    {
      title: 'Affected Devices',
      dataKey: 'affectedDevices',
    },
    {
      title: 'Detections',
      dataKey: 'detections',
    },
  ];

  const rows = [
    { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
    { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
    { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
    { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
    { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
    { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 },
  ];

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h2 className="title">Thêm Sinh Viên Mới</h2>
        </div>
        <form encType="multipart/form-data" onSubmit={AddDataStudent}>
          <div className="bottom">
            <div className="price-table">
              <h2>THÔNG TIN DÀNH CHO SINH VIÊN ĐĂNG KÝ Ở KÝ TÚC XÁ</h2>
              <label>Các loại phòng ở: Tiền phòng ở (đơn vị tính: VNĐ)</label>
              <TableTemplate columns={columns} data={rows} width={800} />
            </div>
            <div className="input-img">
              <div className="left">
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
                      value={data.avatar}
                      onChange={(e) => setAvatar(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="right">
                <form>
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
                          value={data.frontImageIdentity}
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
                          value={data.backImageIdentity}
                          onChange={(e) => setBackImageIdentity(e.target.files[0])}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <hr />
            <div className="input-info">
              <div className="input-left">
                <form className="newStudentForm">
                  <div className="newStudentItem">
                    <label>CCCD</label>
                    <input onChange={handle} type="text" placeholder="02009300XXXX" id="CCCD" value={data.CCCD} />
                  </div>
                  <div className="newStudentItem">
                    <label>MSSV</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="191106XXXX"
                      id="idStudent"
                      value={data.idStudent}
                    />
                  </div>
                  <div className="newStudentItem">
                    <label>Họ Và Tên</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="Nguyễn Xuân A"
                      id="nameStudent"
                      value={data.nameStudent}
                    />
                  </div>
                  <div className="newStudentItem">
                    <label>Số Điện Thoại</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="0947999XXX"
                      id="numberPhone"
                      value={data.numberPhone}
                    />
                  </div>
                  <div className="newStudentItem">
                    <label>Gmail</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="nguyenxuana@gmail.com"
                      id="email"
                      value={data.email}
                    />
                  </div>
                  <div className="newStudentItem">
                    <label>Sinh Viên Năm</label>
                    <Select
                      name="yearStudent"
                      onChange={handleSelect}
                      options={yearOptions}
                      value={yearOptions.filter(function (option) {
                        return option.value === selectYear;
                      })}
                      placeholder="--Chọn--"
                    />
                  </div>
                  <div className="newStudentItem">
                    <label>CCCD Người Thân</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="02009300XXXX"
                      id="CCCDGuardian"
                      value={data.CCCDGuardian}
                    />
                  </div>
                  <div className="newStudentItem">
                    <label>Họ Tên Người Thân</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="Nguyễn ..."
                      id="nameGuardian"
                      value={data.nameGuardian}
                    />
                  </div>
                </form>
              </div>
              <div className="input-right">
                <div className="newStudentForm">
                  <div className="newStudentItem">
                    <label>Giới Tính</label>
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                      <FormControlLabel value="nữ" control={<Radio />} label="Nữ" />
                      <FormControlLabel value="nam" control={<Radio />} label="Nam" />
                    </RadioGroup>
                  </div>
                  <div className="newStudentItem">
                    <label>Tầng</label>
                    <Select name="cityId" />
                    <label>Phòng</label>
                    <Select name="cityId" />
                    <label>Giường</label>
                    <Select name="cityId" />
                  </div>
                  <div className="newStudentItem">
                    <label>Địa Chỉ Thường Trú</label>
                    <input
                      onChange={handle}
                      type="text"
                      placeholder="01 Trần Hưng Đạo"
                      id="province"
                      value={data.province}
                    />
                    <label>Tỉnh/Thành</label>
                    <Select
                      name="cityId"
                      isDisabled={cityOptions.length === 0}
                      options={cityOptions}
                      onChange={(option) => onCitySelect(option)}
                      placeholder="--Tỉnh/Thành--"
                      defaultValue={selectedCity}
                    />
                    <label>Quận/Huyện</label>
                    <Select
                      name="districtId"
                      isDisabled={districtOptions.length === 0}
                      options={districtOptions}
                      onChange={(option) => onDistrictSelect(option)}
                      placeholder="--Quận/Huyện--"
                      defaultValue={selectedDistrict}
                    />
                    <label>Phường/Xã</label>
                    <Select
                      name="wardId"
                      isDisabled={wardOptions.length === 0}
                      options={wardOptions}
                      placeholder="--Phường/Xã--"
                      onChange={(option) => onWardSelect(option)}
                      defaultValue={selectedWard}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button type="submit" value="Submit">
                Thêm Mới
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewStudent;
