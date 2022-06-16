import Moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './itemFeeInvoicesStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import FormInputFeeInvoiceDialog from '../../../allBillStudent/allDialogForm/FormDialogSendMail';
import FormDialogPayment from '../../../allBillStudent/allDialogForm/FormDialogPayment';

import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { createAxios } from '~/lib/createAxios.js';
import { loginSuccess } from '../../../../redux/authSlice.js';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ItemFeeInvoice(props) {
  const { feeInvoice, id_student } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogPayment, setOpenDialogPayment] = useState(false);
  const [contentMail, setContentMail] = useState('');
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();

  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const onCloseFormDialog = () => {
    setOpenDialog(!openDialog);
  };
  const onChangeValueSendMail = (e) => {
    setContentMail(e.target.value);
  };
  const onSendMail = async () => {
    try {
      setOpenDialog(!openDialog);
      const res = await axiosJWT.post(
        `${API}feeInvoice/notification-mail/${feeInvoice._id}`,
        { content: contentMail },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      console.log(res);
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  let date = new Date();

  const navigate = useNavigate();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleShowAll = () => {
    navigate(`/admin/student/fee-invoices/`);
  };
  const handleExtentDays = () => {
    navigate(`/admin/room/cost-of-living/${feeInvoice?.student?._id}`);
  };
  const handleNotificationMail = () => {
    setOpenDialog(!openDialog);
  };
  const handleOpenFormPayment = () => {
    setOpenDialogPayment(!openDialog);
  };
  const handlePaymentFeeInvoice = async () => {
    try {
      const res = await axiosJWT.put("")
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleMakeRecord = () => {
    navigate(`/admin/student/violation/${feeInvoice?.student?._id}`);
  };
  return (
    <div className="content-right content-right-invoices">
      <div className="box-title">
        <span className="title-header">Phiếu kệ phí</span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Hóa đơn của: </span>
        <span className="itemValue"> {feeInvoice?.student?.nameStudent}</span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Phòng: </span>
        <span className="itemValue"> {feeInvoice?.roomBuilding?.name}</span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Giá thuê: </span>
        <span className="itemValue"> {formatNumber(feeInvoice?.roomBuilding?.priceRoom)}</span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Giường: </span>
        <span className="itemValue"> {feeInvoice?.student?.roomBuilding?.Bed}</span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Thời gian đăng ký: </span>
        <span className="itemValue">
          {' '}
          {feeInvoice?.student?.registrationAtDormitory?.timeIn}
          {' (Ngày)'}
        </span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Ngày hết hạn: </span>
        <span className="itemValue">
          {' '}
          {feeInvoice?.student?.registrationAtDormitory?.dateCheckOutRoom &&
            Moment(feeInvoice?.student?.registrationAtDormitory?.dateCheckOutRoom).format('DD-MM-YYYY')}
        </span>
      </div>

      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Số tiền phải trả: </span>
        <span className="itemValue"> {formatNumber(feeInvoice?.totalPrice)}</span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Trạng thái: </span>
        <span className="itemValue" style={feeInvoice?.statusInvoice !== true ? { color: 'red' } : {}}>
          {feeInvoice?.statusInvoice ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
        {!feeInvoice?.statusInvoice && (
          <button className="btn-show-all btn-payment-invoice" onClick={handleShowAll}>
            Thanh toán
          </button>
        )}
        {Date.parse(feeInvoice?.student?.registrationAtDormitory?.dateLine) > date.getTime() && (
          <span className="itemValue itemDateline" style={{ color: '#4d0026', fontSize: '12px' }}>
            (Đã quá hạn)
          </span>
        )}
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Hạn thanh toán: </span>
        <span className="itemValue" style={Date.parse(feeInvoice?.dateLine) < date.getTime() ? { color: 'red' } : {}}>
          {Moment(feeInvoice?.dateLine).format('DD-MM-YYYY')}
        </span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Ngày thành lập: </span>
        <span className="itemValue"> {Moment(feeInvoice?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItemFeeInvoiceDetailsBtn">
        {id_student && (
          <button className="btn-show-all" onClick={handleShowAll}>
            Xem thêm{' '}
          </button>
        )}
        {feeInvoice?.statusInvoice ? (
          <>
            <button className="btn-show-all" onClick={handleExtentDays}>
              Gia hạn thêm{' '}
            </button>
            <button className="btn-show-all btn-delete-fee-invoice" onClick={handleExtentDays}>
              Xóa{' '}
            </button>
          </>
        ) : Date.parse(feeInvoice?.student?.registrationAtDormitory?.dateCheckOutRoom) <= date.getTime() ? (
          <button className="btn-show-all btn-make-record" onClick={handleMakeRecord}>
            Lập biên bản{' '}
          </button>
        ) : (
          <button className="btn-show-all btn-notify-mail" onClick={handleNotificationMail}>
            {feeInvoice.isNotification ? 'Thông báo lại' : 'Thông báo'}
          </button>
        )}
        {}
      </div>
      <FormInputFeeInvoiceDialog
        open={openDialog}
        onCloseFormDialog={onCloseFormDialog}
        onChangeValueSendMail={onChangeValueSendMail}
        onSendMail={onSendMail}
      />
      <FormDialogPayment
        open={openDialogPayment}
        onOpenDialog={handleOpenFormPayment}
        onAgreeAction={handlePaymentFeeInvoice}
      />
    </div>
  );
}
export default ItemFeeInvoice;
