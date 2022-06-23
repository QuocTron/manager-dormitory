import Moment from 'moment';
import './itemBillCostOfLivingStyle.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/authSlice.js';
import { showToastError, showToastSuccess, showToastPosition } from '../../../../lib/showToastMessage.js';
import { createAxios } from '../../../../lib/createAxios.js';
import AlertDialogSlide from '../billCostOfLiving/DialogFormSliceIn';
import Button from '@mui/material/Button';
import FormDialogDelete from '../../../allBillStudent/allDialogForm/FormDialogDelete';
import FormDialogDestroy from '~/pages/allBillStudent/allDialogForm/FormDialogDestroy';
const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ItemCostOfLiving(props) {
  const { billCostOfLiving, popup } = props;
  const close = popup?.current.close;
  const [billCostOfLivingDetail, setBillCostLivingDetail] = useState(billCostOfLiving);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const { id_student } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogDestroy, setOpenDialogDestroy] = useState(false);
  let date = new Date();
  const navigate = useNavigate();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleShowAllBillCostOfLiving = () => {
    navigate(`/admin/room/cost-livings/${billCostOfLiving?.Room._id}`);
  };
  const handleClickOpenDialogDelete = () => {
    setOpenDialogDelete(!openDialogDelete);
  };
  const handleClickOpenDialogDestroy = () => {
    setOpenDialogDestroy(!openDialogDestroy);
  };
  const handleDeleteBill = async () => {
    try {
      setOpenDialogDelete(false);
      popup.isChange = true;
      const res = await axiosJWT.delete(`${API}billCostOfLiving/delete-bill/${billCostOfLiving._id}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      showToastSuccess(res.data.message);
      close();
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleDestroyBill = async () => {
    try {
      setOpenDialogDestroy(false);
      popup.isChange = true;
      const res = await axiosJWT.delete(`${API}billCostOfLiving/destroyBill/${billCostOfLiving._id}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      showToastSuccess(res.data.message);
      close();
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleCreateNew = () => {
    navigate(`/admin/room/cost-of-living/`);
  };
  const handleClickOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  const handleNotifyEmail = async (id) => {
    try {
      const res = await axiosJWT.post(
        `${API}billCostOfLiving/notification-mail/${id}`,
        {},
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      popup.isChange = true;
      setBillCostLivingDetail(res.data.billCostOfLiving);
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  const handlePaymentBillCostOfLivings = async () => {
    try {
      const res = await axiosJWT.put(
        `${API}billCostOfLiving/payment-bill-cost/${billCostOfLiving._id}`,
        {},
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess(res.data.message);
      setBillCostLivingDetail(res.data.billCostOfLiving);
      popup.isChange = true;
      setOpenDialog(false);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  // useEffect(() => {
  //   let res;
  //   if (!billCostOfLivingDetail) {
  //     (async () => {
  //       try {
  //         res = await axiosJWT.get(`${API}billCostOfLiving/bill/${billCostOfLivingDetail._id}`, {
  //           headers: { token: `Bearer ${user?.accessToken}` },
  //         });

  //         setBillCostLivingDetail(res.data?.billCostOfLiving);
  //       } catch (error) {
  //         showToastPosition(error.response.data.message, 'TOP_RIGHT', 10000);
  //       }
  //     })();
  //   }
  // }, []);

  return (
    <div className="content-right content-right-invoices ">
      <div className="box-title-cost-of-living">
        <span className="title-bill-cost-of-living">Chi tiết hóa đơn</span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Hóa đơn ở phòng: </span>
        <span className="itemValueCost"> {billCostOfLivingDetail?.Room?.name}</span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Chi tiết hóa đơn: </span>
      </div>
      <div className="detail-cost-living detailItemBillCostLiving">
        {billCostOfLivingDetail?.detailBillCostOfLiving?.map((cost) => (
          <div className="item-bill-cost-of-living">
            <div className="name-cost-spending">
              <span className="itemTitleCost">Tên dịch vụ: </span>
              <span className="itemValueCost "> {cost?.nameCost?.nameCost}</span>
            </div>
            <div className="amount-use-spending">
              <div className="amount-use">
                {' '}
                <span className="itemTitleCost">Chỉ số đầu: </span>
                <span className="itemValueCost "> {cost?.amountUseOld}</span>
              </div>

              <div className="amount-use">
                {' '}
                <span className="itemTitleCost">Chỉ số cuối: </span>
                <span className="itemValueCost "> {cost?.amountUseNew}</span>
              </div>
            </div>
            <div className="total-price">
              <span className="itemTitleCost">Số tiền: </span>
              <span className="itemValueCost itemValue">
                {' '}
                {cost?.amountUseNew &&
                  formatNumber((cost?.amountUseNew - cost?.amountUseOld) * cost?.nameCost?.priceCost)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Tổng tiền: </span>
        <span className="itemValueCost">
          {' '}
          {billCostOfLivingDetail?.totalPayment && formatNumber(billCostOfLivingDetail?.totalPayment)}
        </span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Trạng thái: </span>
        <span
          className="itemValueCost"
          style={
            billCostOfLivingDetail?.statusBill !== true ? { color: 'red', fontSize: '14px', fontWeight: 'bold' } : {}
          }
        >
          {billCostOfLivingDetail?.statusBill === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
        {!billCostOfLivingDetail?.statusBill && (
          <>
            <Button
              variant="outlined"
              className="btn-payment-bill-cost-of-Living"
              marginRight="10px"
              onClick={handleClickOpenDialog}
              style={{ marginRight: '10px' }}
            >
              Thanh toán
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              marginLeft="10px"
              className="btn-notify-email-cost-of-Living"
              onClick={() => handleNotifyEmail(billCostOfLivingDetail?._id)}
            >
              {billCostOfLivingDetail?.isNotification ? 'Thông báo lại' : 'Thông báo'}
            </Button>
          </>
        )}
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Ngày chốt chỉ số: </span>
        <span className="itemValueCost">{Moment(billCostOfLivingDetail?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Ngày thanh toán: </span>
        <span className="itemValueCost">
          {billCostOfLivingDetail?.datePayment
            ? Moment(billCostOfLivingDetail?.datePayment).format('DD-MM-YYYY')
            : '--/--/--'}
        </span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Số sinh viên trong phòng: </span>
        <span className="itemValueCost">
          {' '}
          {billCostOfLivingDetail?.Room?.amountBed.filter((item) => item.student).length + ' sinh viên'}
        </span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Ghi chú: </span>
        <span className="itemValueCost">
          {' '}
          {billCostOfLivingDetail?.notePayment ? billCostOfLivingDetail?.notePayment : 'Không có'}
        </span>
      </div>
      <div className="detailItemBillCostLiving item-staff-create">
        <span className="itemTitleCost">Nhân viên khởi tạo: </span>
        <span className="itemValueCost"> {billCostOfLivingDetail?.staffCreate?.nameStaff}</span>
      </div>
      {openDialog && (
        <AlertDialogSlide
          open={openDialog}
          onOpenDialog={handleClickOpenDialog}
          onAgreePayment={handlePaymentBillCostOfLivings}
        />
      )}
      {openDialogDelete && (
        <FormDialogDelete
          open={openDialogDelete}
          onOpenDialog={handleClickOpenDialogDelete}
          onAgreeAction={handleDeleteBill}
        />
      )}
      <FormDialogDestroy
        open={openDialogDestroy}
        onOpenDialog={handleClickOpenDialogDestroy}
        onAgreeAction={handleDestroyBill}
      />
      {id_student && (
        <div className="detailItemBtn">
          <button className="btn-show-all" onClick={handleShowAllBillCostOfLiving}>
            Xem thêm{' '}
          </button>
        </div>
      )}
      <div className="detailItemBtn">
        {billCostOfLivingDetail?.deleted ? (
          <button className="btn-delete-bill" onClick={handleClickOpenDialogDestroy}>
            Xóa vĩnh viễn{' '}
          </button>
        ) : (
          billCostOfLivingDetail?.statusBill && (
            <button className="btn-destroy-bill" onClick={handleClickOpenDialogDelete}>
              Xóa{' '}
            </button>
          )
        )}
      </div>
    </div>
  );
}
export default ItemCostOfLiving;
