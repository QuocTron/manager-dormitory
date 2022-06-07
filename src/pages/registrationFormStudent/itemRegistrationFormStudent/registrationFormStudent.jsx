import Moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import './registrationFormStudentStyle.css';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function RegistrationFormStudent() {
  const [registrationFormStudent, setRegistrationFormStudent] = useState(null);
  const [extendDay, setExtendDay] = useState(false);
  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const month = [
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
    {
      value: '4',
      label: '4',
    },
    {
      value: '5',
      label: '5',
    },
    {
      value: '6',
      label: '6',
    },
    {
      value: '7',
      label: '7',
    },
    {
      value: '8',
      label: '8',
    },
    {
      value: '9',
      label: '9',
    },
  ];
  useEffect(() => {
    (async () => {
      if (student && student.success) {
        const studentId = student?.student?._id;

        const registrationFormStudent = await axios.get(`${API}registrationAtDormitory/registerStudent/${studentId}`, {
          headers: { token: `Bearer ${user?.accessToken}` },
        });
        setRegistrationFormStudent(registrationFormStudent.data?.register);
      }
    })();
  }, []);
  let date = new Date();
  const navigate = useNavigate();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleShowComboBoxExtend = () => {
    if (!extendDay) {
      setExtendDay(true);
    } else {
      setExtendDay(false);
    }
  };
  const handleCreateNew = () => {};
  return (
    <div className="registration-form-student">
      <div className="box-header">
        <label className="title-header">Phiếu đăng ký KTX</label>
      </div>
      <div className="content-info">
        <div className="content-info-student">
          <div className="detailInfoForm">
            <span className="itemKey">Họ và tên sinh viên: </span>
            <span className="itemValue"> {registrationFormStudent?.student?.nameStudent}</span>
          </div>
          <div className="detailInfoForm">
            <span className="itemKey">CCCD: </span>
            <span className="itemValue"> {registrationFormStudent?.student?.CCCD}</span>
          </div>
        </div>
        <div className="content-info-image">
          <div className=" detailFormAvatar">
            <img
              className="image-avatar"
              // src={registrationFormStudent?.student?.avatar}
              src={'https://tse1.mm.bing.net/th?id=OIP.CjisN2ORp0t86SFIX4jVgwHaHa&pid=Api&P=0&w=168&h=168'}
              alt={'https://tse1.mm.bing.net/th?id=OIP.CjisN2ORp0t86SFIX4jVgwHaHa&pid=Api&P=0&w=168&h=168'}
            />
          </div>
        </div>
      </div>
      <div className="content-detail-info">
        <div className="detailForm">
          <span className="itemKey">Phòng ở: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.roomBuilding?.Room?.name}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Giường ở: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.roomBuilding?.Bed}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Email: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.email}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Số điện thoại: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.numberPhone}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Ngày sinh: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.birthDay}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Giới tính: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.gender}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Quốc tịch: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.national}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Quê quán: </span>
          <span className="itemValue"> {registrationFormStudent?.student?.province}</span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Địa chỉ cụ thể: </span>
          <span className="itemValue">
            {' '}
            {registrationFormStudent?.student?.address +
              ', ' +
              registrationFormStudent?.student?.wards +
              ', ' +
              registrationFormStudent?.student?.district +
              ', ' +
              registrationFormStudent?.student?.province}
          </span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Trạng thái: </span>
          <span className="itemValue" style={registrationFormStudent?.status !== true ? { color: 'red' } : {}}>
            {registrationFormStudent?.status === true ? 'Còn ở' : 'Hết ở'}
          </span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Ngày gia hạn: </span>
          <span className="itemValue" style={registrationFormStudent?.dateCheckInRoom > date ? { color: 'red' } : {}}>
            {Moment(registrationFormStudent?.dateCheckInRoom).format('DD-MM-YYYY')}
          </span>
        </div>
        <div className="detailForm">
          <span className="itemKey">Ngày ngày hết hạn </span>
          <span className="itemValue"> {Moment(registrationFormStudent?.dateCheckOutRoom).format('DD-MM-YYYY')}</span>
        </div>
        <div className="detailForm detailsFormExtend">
          <span className="itemKey">Thời gian gia hạn: </span>
          {!extendDay && <span className="itemValue"> {registrationFormStudent?.timeIn}</span>}

          {extendDay && (
            <div className="box-combo-box-extend">
              <Select
                className="combo-box-month-select"
                name="month"
                // isDisabled={cityOptions.length === 0}
                options={month}
                // onChange={(option) => onCitySelect(option)}
                placeholder="--Tháng--"
                // defaultValue={selectedCity}
              />
            </div>
          )}

          <div className="box-btn-extend">
            <button
              {...(Date.parse(registrationFormStudent?.dateCheckOutRoom) - date.getTime() >= 15 * 24 * 3600000
                ? { disabled: false }
                : { disabled: true })}
              className={
                Date.parse(registrationFormStudent?.dateCheckOutRoom) - date.getTime() >= 15 * 24 * 3600000
                  ? 'btn-extend-day active'
                  : ' btn-extend-day'
              }
              onClick={handleShowComboBoxExtend}
            >
              {extendDay ? 'Hủy' : 'Gia hạn thêm'}
            </button>
          </div>
        </div>
        <div
          className="detailFormBtn"
          // style={
          //   Date.parse(registrationFormStudent?.dateCheckInRoom) - date.getTime() < 15 * 24 * 3600000
          //     ? { background: 'red' }
          //     : { background: 'green' }

          // }
        >
          {extendDay && (
            <button
              className={
                Date.parse(registrationFormStudent?.dateCheckOutRoom) - date.getTime() >= 15 * 24 * 3600000
                  ? 'btn-confirm-extend-day'
                  : 'btn-confirm-extend-day'
              }
              onClick={handleCreateNew}
            >
              Xác nhận gia hạn{' '}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default RegistrationFormStudent;
