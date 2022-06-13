import Moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import FormDialog from './FormDialog/FormDialog';
import { createAxios } from '../../../lib/createAxios.js';
import { loginSuccess } from '~/redux/authSlice';
import { showToastError, showToastSuccess } from '../../../lib/showToastMessage.js';

import './registrationFormStudentStyle.css';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
const date = new Date();

function RegistrationFormStudent() {
  const dispatch = useDispatch();
  const [registrationFormStudent, setRegistrationFormStudent] = useState(null);
  const [extendDay, setExtendDay] = useState(false);
  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [open, setOpen] = useState(false);
  const [reasonDeny, setReasonDeny] = useState('');
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
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

  const { id_registration } = useParams();
  const { status } = useParams();
  useEffect(() => {
    (async () => {
      try {
        let registrationFormStudent;

        switch (status) {
          case 'deleted':
            console.log('deleted registration', status);
            registrationFormStudent = await axiosJWT.get(`${API}registrationAtDormitory/aDeleted/${id_registration}`, {
              headers: { token: `Bearer ${user?.accessToken}` },
            });
            break;
          default:
            registrationFormStudent = await axiosJWT.get(
              `${API}registrationAtDormitory/registration/${id_registration}`,
              {
                headers: { token: `Bearer ${user?.accessToken}` },
              },
            );
            break;
        }

        setRegistrationFormStudent(registrationFormStudent.data?.registration);
      } catch (error) {
        if (error.response && error.response.data) {
          showToastError(error.response.data.message);
        }
      }
    })();
  }, []);
  const handleChangeValueReasonDeny = (e) => {
    setReasonDeny(e.target.value);
  };

  const handleClickOpenFormDialog = () => {
    setOpen(true);
  };

  const handleCloseFormDialog = () => {
    setOpen(false);
  };

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
  const handleConfirmRegistration = async () => {
    try {
      const res = await axiosJWT.post(
        `${API}registrationAtDormitory/confirm-registration/${id_registration}`,
        id_registration,
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess(res.data.message, 5000);
      const registrationFormStudent = await axiosJWT.get(
        `${API}registrationAtDormitory/registration/${id_registration}`,
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      setRegistrationFormStudent(registrationFormStudent.data?.registration);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  const handleDenyRegistration = async () => {
    if (!reasonDeny) {
      showToastError('Bạn phải cho biết lý do!!', 1000);
      return;
    }
    try {
      const res = await axiosJWT.post(
        `${API}registrationAtDormitory/deny-registration/${id_registration}`,
        {
          reason: reasonDeny,
        },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      const registrationFormStudent = await axiosJWT.get(
        `${API}registrationAtDormitory/registration/${id_registration}`,
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      setRegistrationFormStudent(registrationFormStudent.data?.registration);
      setOpen(false);
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      if (error.response && error.response.data) {
        showToastError(error.response.data.message, 10000);
      }
    }
  };
  const handleDeleteRegistration = async () => {
    try {
      const res = await axiosJWT.delete(`${API}registrationAtDormitory/delete/${id_registration}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      showToastSuccess(res.data.message, 5000);
      setTimeout(() => {
        navigate('/admin/all-registration-form-confirming/');
      }, 6000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleCreateNew = () => {};

  return (
    <div className="registration-form-student">
      <div className="box-header">
        <label className="title-header">Phiếu đăng ký KTX</label>
      </div>
      <div className="container-body-re">
        <div className="box-header-title-info-student">
          <span className="box-title">Thông tin sinh viên</span>
        </div>
        <div className="content-info-student">
          <div className="content-info">
            <div className="box-header-title">
              <span className="">Thông tin hình ảnh</span>
            </div>
            {registrationFormStudent ? (
              <>
                {' '}
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
                  <span className="itemValue">
                    {' '}
                    {registrationFormStudent?.student?.birthDay &&
                      Moment(registrationFormStudent?.student?.birthDay).format('DD/MM/YYYY')}
                  </span>
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
              </>
            ) : (
              <div className="show-status">
                <span className="title-status">Đang cập nhật...!!!</span>
              </div>
            )}
          </div>
          <div className="content-info-image">
            <div className="box-header-title">
              <span className="">Thông tin hình ảnh</span>
            </div>
            <div className="container-images">
              {registrationFormStudent ? (
                <>
                  {' '}
                  <div className="info-images-avatar">
                    <span className="itemKey">Avatar</span>
                    <img className="image-avatar" src={registrationFormStudent?.student?.avatar} alt={''} />
                  </div>
                  <div className="info-images-identity">
                    <div className=" detail-form-image">
                      <span className="itemKey">CCCD mặt trước</span>
                      <img
                        className="image-identity image-front-image-identity"
                        src={registrationFormStudent?.student?.frontImageIdentity}
                        alt={''}
                      />
                    </div>
                    <div className=" detail-form-image">
                      <span className="itemKey">CCCD mặt sau</span>
                      <img
                        className="image-identity image-back-image-identity"
                        src={registrationFormStudent?.student?.backImageIdentity}
                        alt={''}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="show-status">
                  <span className="title-status">Đang cập nhật...!!!</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="box-header-title-info-student ">
          <span className="box-title">Thông tin phòng và người liên hệ</span>
        </div>
        <div className="container-room-guardian">
          <div className="content-room">
            <div className="box-header-title">
              <span className="">Thông tin phòng ở</span>
            </div>
            {registrationFormStudent ? (
              <>
                <div className="detailForm">
                  <span className="itemKey">Phòng ở: </span>
                  <span className="itemValue"> {registrationFormStudent?.student?.roomBuilding?.Room?.name}</span>
                </div>
                <div className="detailForm">
                  <span className="itemKey">Giường ở: </span>
                  <span className="itemValue"> {registrationFormStudent?.student?.roomBuilding?.Bed}</span>
                </div>{' '}
                <div className="content-info-registration-form">
                  <div className="detailForm">
                    <span className="itemKey">Trạng thái: </span>
                    <span className="itemValue">
                      {(() => {
                        switch (registrationFormStudent?.status) {
                          case 'confirming':
                            return <span className="value-table-cell">{'Đang chờ xác nhận'}</span>;
                          case 'confirmed':
                            return <span className="value-table-cell">{'Đã chờ xác nhận'}</span>;
                          case 'denied':
                            return <span className="value-table-cell">{'Không chấp nhận'}</span>;

                          default:
                            return <span className="value-table-cell">{'Đã hủy'}</span>;
                        }
                      })()}
                    </span>
                  </div>
                  <div className="detailForm">
                    <span className="itemKey">Ngày gia hạn: </span>
                    <span className="itemValue">
                      {' '}
                      {registrationFormStudent?.dateCheckInRoom &&
                        Moment(registrationFormStudent?.dateCheckInRoom).format('DD-MM-YYYY')}
                    </span>
                  </div>
                  <div className="detailForm">
                    <span className="itemKey">Ngày ngày hết hạn </span>
                    <span
                      className="itemValue"
                      style={
                        registrationFormStudent?.dateCheckOutRoom &&
                        Date.parse(registrationFormStudent?.dateCheckOutRoom) - date.getTime() <= 15 * 24 * 3600000
                          ? { color: 'red' }
                          : {}
                      }
                    >
                      {' '}
                      {registrationFormStudent?.dateCheckOutRoom &&
                        Moment(registrationFormStudent?.dateCheckOutRoom).format('DD-MM-YYYY')}
                    </span>
                  </div>
                  <div className="detailForm content-form-registration">
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
                    <div className="box-btn-registration">
                      {registrationFormStudent?.status === 'confirmed' ? (
                        <button
                          {...(Date.parse(registrationFormStudent?.dateCheckOutRoom) - date.getTime() <=
                          15 * 24 * 3600000
                            ? { disabled: false }
                            : { disabled: true })}
                          className={
                            Date.parse(registrationFormStudent?.dateCheckOutRoom) - date.getTime() <= 15 * 24 * 3600000
                              ? 'btn-registration btn-extend-day active'
                              : 'btn-registration btn-extend-day disabled'
                          }
                          onClick={handleShowComboBoxExtend}
                        >
                          {extendDay ? 'Hủy' : 'Gia hạn thêm'}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <div className="box-btn-registration">
                    {(() => {
                      switch (registrationFormStudent?.status) {
                        case 'confirming':
                          return (
                            <>
                              {' '}
                              <button
                                className="btn-registration btn-confirm-registration"
                                onClick={handleConfirmRegistration}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="btn-registration btn-deny-registration"
                                onClick={handleClickOpenFormDialog}
                              >
                                Từ chối
                              </button>
                            </>
                          );
                        case 'confirmed':
                          return <></>;
                        case 'denied':
                          return (
                            <button
                              className="btn-registration btn-delete-registration"
                              onClick={handleDeleteRegistration}
                            >
                              Xóa
                            </button>
                          );

                        default:
                          return <></>;
                      }
                    })()}
                  </div>
                </div>
              </>
            ) : (
              <div className="show-status">
                <span className="title-status">Đang cập nhật...!!!</span>
              </div>
            )}
          </div>

          <div className="content-guardian">
            <div className="box-header-title">
              <span className="">Thông tin người thân liên lạc</span>
            </div>{' '}
            {registrationFormStudent ? (
              <>
                {' '}
                {registrationFormStudent?.student?.guardianOfStudent?.map((guardian, index) => (
                  <>
                    <div className="detailForm">
                      <span className="itemKey">CCCD: </span>
                      <span className="itemValue"> {guardian.CCCDGuardian}</span>
                    </div>
                    <div className="detailForm">
                      <span className="itemKey">Họ tên: </span>
                      <span className="itemValue"> {guardian.nameGuardian}</span>
                    </div>
                    <div className="detailForm">
                      <span className="itemKey">Giới tính: </span>
                      <span className="itemValue"> {guardian.gender}</span>
                    </div>
                    <div className="detailForm">
                      <span className="itemKey">Số điện thoại: </span>
                      <span className="itemValue"> {guardian.numberPhone}</span>
                    </div>
                    <div className="detailForm">
                      <span className="itemKey">Quê quán: </span>
                      <span className="itemValue"> {guardian.province}</span>
                    </div>
                    <div className="detailForm">
                      <span className="itemKey">Địa chỉ cụ thể: </span>
                      <span className="itemValue">
                        {' '}
                        {guardian.address + ', ' + guardian.wards + ', ' + guardian.district + ', ' + guardian.province}
                      </span>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <div className="show-status">
                <span className="title-status">Đang cập nhật...!!!</span>
              </div>
            )}
          </div>
        </div>
        <div className="box-staff-create">
          <div className="detailForm ">
            <span className="itemKey">Nhân viên thực hiện: </span>
            <span className="itemValue">
              {''}
              {registrationFormStudent?.staffCreate &&
                (registrationFormStudent?.deletedBy?.nameStaff || registrationFormStudent?.staffCreate?.nameStaff)}
            </span>
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
                  ? 'btn-registration btn-confirm-extend-day'
                  : 'btn-registration btn-confirm-extend-day'
              }
              onClick={handleCreateNew}
            >
              Xác nhận gia hạn{' '}
            </button>
          )}
        </div>
      </div>

      {open && (
        <FormDialog
          open={open}
          onCloseFormDialog={handleCloseFormDialog}
          onChangeReasonDeny={handleChangeValueReasonDeny}
          onDenyRegistration={handleDenyRegistration}
        />
      )}
      <ToastContainer />
    </div>
  );
}
export default RegistrationFormStudent;
