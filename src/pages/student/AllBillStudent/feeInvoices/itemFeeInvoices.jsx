import Moment from 'moment';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import './itemFeeInvoicesStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import FormInputFeeInvoiceDialog from '../../../allBillStudent/allDialogForm/FormDialogSendMail';
import FormDialogPayment from '../../../allBillStudent/allDialogForm/FormDialogPayment';
import FormDialogDelete from '../../../allBillStudent/allDialogForm/FormDialogDelete';
import FormDialogDestroy from '~/pages/allBillStudent/allDialogForm/FormDialogDestroy';
import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { createAxios } from '~/lib/createAxios.js';
import { loginSuccess } from '../../../../redux/authSlice.js';
import { PowerInputSharp } from '@material-ui/icons';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ItemFeeInvoice(props) {
  const { feeInvoice, popup } = props;
  const close = popup?.current.close;
  const { id_student } = useParams();
  console.log(id_student);
  // setTimeout(() => close(), 5000);
  const [feeInvoiceDetail, setFeeInvoiceDetail] = useState(feeInvoice);
  const [openDialogFormSendMail, setOpenDialogFormSendMail] = useState(false);
  const [openDialogPayment, setOpenDialogPayment] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogDestroy, setOpenDialogDestroy] = useState(false);

  const [contentMail, setContentMail] = useState('');
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();

  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const onCloseFormDialog = () => {
    setOpenDialogFormSendMail(!openDialogFormSendMail);
  };

  const handleCloseFormDialogDelete = () => {
    setOpenDialogDelete(!openDialogDelete);
  };
  const handleDeleteFeeInvoice = async () => {
    try {
      const res = await axiosJWT.delete(`${API}feeInvoice/delete/${feeInvoiceDetail._id}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      setOpenDialogDelete(false);
      showToastSuccess(res.data.message, 5000);
      popup.isChange = true;
      close();
    } catch (error) {
      showToastError(error.response.data.message);
    }
  };

  const handleCloseFormDialogDestroy = async () => {
    setOpenDialogDestroy(!openDialogDestroy);
  };

  const handleDestroyFeeInvoice = async () => {
    try {
      const res = await axiosJWT.delete(`${API}feeInvoice/destroy/${feeInvoiceDetail._id}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      setOpenDialogDelete(false);
      showToastSuccess(res.data.message, 5000);
      popup.isChange = true;
      close();
    } catch (error) {
      showToastError(error.response.data.message);
    }
  };
  const onChangeValueSendMail = (e) => {
    setContentMail(e.target.value);
  };
  const onSendMail = async () => {
    try {
      setOpenDialogFormSendMail(!openDialogFormSendMail);
      const res = await axiosJWT.post(
        `${API}feeInvoice/notification-mail/${feeInvoiceDetail._id}`,
        { content: contentMail },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      popup.isChange = true;
      setFeeInvoiceDetail(res.data.feeInvoice);
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
  const handleShowAllFeeInvoices = () => {
    navigate(`/admin/student/all-fee-invoices/${id_student}`);
  };
  const handleExtentDays = () => {
    navigate(`/admin/room/cost-of-living/${feeInvoiceDetail?.student?._id}`);
  };
  const handleNotificationMail = () => {
    setOpenDialogFormSendMail(!openDialogFormSendMail);
  };
  const handleOpenFormPayment = () => {
    setOpenDialogPayment(!openDialogPayment);
  };
  const handlePaymentFeeInvoice = async () => {
    try {
      const res = await axiosJWT.put(
        `${API}feeInvoice/payment-fee-invoice/${feeInvoiceDetail._id}`,
        {},
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess(res.data.message, 5000);
      setOpenDialogPayment(!openDialogPayment);
      setFeeInvoiceDetail(res.data.feeInvoice);
      popup.isChange = true;
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleMakeRecord = () => {
    navigate(`/admin/student/violation/${feeInvoiceDetail?.student?._id}`);
  };
  return (
    <div className="content-right content-right-invoices">
      <div className="box-title">
        <span className="title-header">Phiếu lệ phí</span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Hóa đơn của: </span>
        <span className="itemValue itemValueFeeInvoice"> {feeInvoiceDetail?.student?.nameStudent}</span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Phòng: </span>
        <span className="itemValue itemValueFeeInvoice"> {feeInvoiceDetail?.roomBuilding?.name}</span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Giá thuê: </span>
        <span className="itemValue itemValueFeeInvoice">
          {' '}
          {formatNumber(feeInvoiceDetail?.roomBuilding?.priceRoom)}
        </span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Giường: </span>
        <span className="itemValue itemValueFeeInvoice"> {feeInvoiceDetail?.student?.roomBuilding?.Bed}</span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Thời gian đăng ký: </span>
        <span className="itemValue itemValueFeeInvoice">
          {' '}
          {feeInvoiceDetail?.student?.registrationAtDormitory?.timeIn / 30}
          {' (Tháng)'}
        </span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Ngày hết hạn: </span>
        <span className="itemValue itemValueFeeInvoice">
          {' '}
          {feeInvoiceDetail?.student?.registrationAtDormitory?.dateCheckOutRoom &&
            Moment(feeInvoiceDetail?.student?.registrationAtDormitory?.dateCheckOutRoom).format('DD-MM-YYYY')}
        </span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Số tiền phải trả: </span>
        <span className="itemValue itemValueFeeInvoice"> {formatNumber(feeInvoiceDetail?.totalPrice)}</span>
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Trạng thái: </span>
        <span
          className="itemValue itemValueFeeInvoice"
          style={feeInvoiceDetail?.statusInvoice !== true ? { color: 'red' } : {}}
        >
          {feeInvoiceDetail?.statusInvoice ? 'Đã thanh toán' : 'Chưa thanh toán'}
          {!feeInvoiceDetail?.statusInvoice && Date.parse(feeInvoiceDetail?.dateLine) > date.getTime() && (
            <span className="itemValue itemValueFeeInvoice itemDateline" style={{ color: '#4d0026', fontSize: '12px' }}>
              (Đã quá hạn)
            </span>
          )}
        </span>
        {!feeInvoiceDetail?.statusInvoice && (
          <button className="btn-show-all btn-payment-invoice" onClick={handleOpenFormPayment}>
            Thanh toán
          </button>
        )}
      </div>
      <div className=" detailItemFeeInvoiceDetails">
        <span className="itemKey">Hạn thanh toán: </span>
        <span
          className="itemValue itemValueFeeInvoice"
          style={Date.parse(feeInvoiceDetail?.dateLine) <= date.getTime() ? { color: 'red' } : {}}
        >
          {Moment(feeInvoiceDetail?.dateLine).format('DD/MM/YYYY')}
        </span>
      </div>
      <div className="detailItemFeeInvoiceDetails">
        <span className="itemKey">Ngày thành lập: </span>
        <span className="itemValue itemValueFeeInvoice">
          {' '}
          {Moment(feeInvoiceDetail?.createdAt).format('DD/MM/YYYY')}
        </span>
      </div>
      <div className="detailItemFeeInvoiceDetails" marginBottom="20px">
        <span className="itemKey">Nhân viên tạo: </span>
        <span className="itemValue itemValueFeeInvoice"> {feeInvoiceDetail?.staffCreate?.nameStaff}</span>
      </div>
      <div className="detailItemFeeInvoiceDetailsBtn">
        {id_student && (
          <button className="btn-show-all" onClick={handleShowAllFeeInvoices}>
            Xem thêm{' '}
          </button>
        )}

        {feeInvoiceDetail?.statusInvoice ? (
          <>
            <button className="btn-show-all" style={{ marginLeft: '10px' }} onClick={handleExtentDays}>
              Gia hạn thêm{' '}
            </button>
            {!feeInvoiceDetail?.deleted ? (
              <button
                className="btn-show-all btn-delete-fee-invoice"
                style={{ marginLeft: '10px' }}
                onClick={handleCloseFormDialogDelete}
              >
                Xóa{' '}
              </button>
            ) : (
              <button
                className="btn-show-all btn-delete-fee-invoice"
                style={{ marginLeft: '10px' }}
                onClick={handleCloseFormDialogDestroy}
              >
                Xóa vĩnh viễn
              </button>
            )}
          </>
        ) : Date.parse(feeInvoiceDetail?.student?.registrationAtDormitory?.dateCheckOutRoom) <= date.getTime() ? (
          <button className="btn-show-all btn-make-record" onClick={handleMakeRecord}>
            Lập biên bản{' '}
          </button>
        ) : (
          <button className="btn-show-all btn-notify-mail" onClick={handleNotificationMail}>
            {feeInvoiceDetail.isNotification ? 'Thông báo lại' : 'Thông báo'}
          </button>
        )}
        {}
        <FormInputFeeInvoiceDialog
          open={openDialogFormSendMail}
          onCloseFormDialog={onCloseFormDialog}
          onChangeValueSendMail={onChangeValueSendMail}
          onSendMail={onSendMail}
        />
        <FormDialogPayment
          open={openDialogPayment}
          onOpenDialog={handleOpenFormPayment}
          onAgreeAction={handlePaymentFeeInvoice}
        />
        <FormDialogDelete
          open={openDialogDelete}
          onOpenDialog={handleCloseFormDialogDelete}
          onAgreeAction={handleDeleteFeeInvoice}
        />
        <FormDialogDestroy
          open={openDialogDestroy}
          onOpenDialog={handleCloseFormDialogDestroy}
          onAgreeAction={handleDestroyFeeInvoice}
        />
      </div>{' '}
    </div>
  );
}
export default ItemFeeInvoice;
