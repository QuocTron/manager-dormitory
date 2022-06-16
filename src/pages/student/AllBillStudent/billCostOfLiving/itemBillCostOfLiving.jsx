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
import FormDialog from '../../../allBillStudent/allDialogForm/FormDialog';
import FormDialogDestroy from '~/pages/allBillStudent/allDialogForm/FormDialogDestroy';
import { ToastContainer } from 'react-toastify';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ItemCostOfLiving(props) {
  const { idBillCostOfLiving, statusBillCostOfLiving } = props;
  const [billCostOfLiving, setBillCostLiving] = useState();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const { id_room } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogDestroy, setOpenDialogDestroy] = useState(false);
  const [rerender, setRerender] = useState(false);
  let date = new Date();
  const navigate = useNavigate();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleShowAll = () => {
    navigate(`/admin/room/cost-livings/`);
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
      const res = await axiosJWT.delete(`${API}billCostOfLiving/delete-bill/${idBillCostOfLiving}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      showToastSuccess(res.data.message);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleDestroyBill = async () => {
    try {
      setOpenDialogDestroy(false);
      const res = await axiosJWT.delete(`${API}billCostOfLiving/destroyBill/${idBillCostOfLiving}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      showToastSuccess(res.data.message);
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
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  const handlePaymentBillCostOfLivings = async () => {
    try {
      const res = await axiosJWT.put(`${API}billCostOfLiving/payment-bill-cost/${idBillCostOfLiving}`);
      showToastSuccess(res.data.message);
      setRerender(!rerender);
      setOpenDialog(false);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  useEffect(() => {
    let res;
    (async () => {
      try {
        if (statusBillCostOfLiving === 'bill-deleted') {
          res = await axiosJWT.get(`${API}billCostOfLiving/aCostDeleted/${idBillCostOfLiving}`, {
            headers: { token: `Bearer ${user?.accessToken}` },
          });
        } else {
          res = await axiosJWT.get(`${API}billCostOfLiving/bill/${idBillCostOfLiving}`, {
            headers: { token: `Bearer ${user?.accessToken}` },
          });
        }

        setBillCostLiving(res.data?.billCostOfLiving);
      } catch (error) {
        showToastPosition(error.response.data.message, 'TOP_RIGHT', 10000);
      }
    })();
  }, [rerender]);
  return (
    <div className="content-right content-right-invoices ">
      <div className="box-title-cost-of-living">
        <span className="title-bill-cost-of-living">Chi tiết hóa đơn</span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Hóa đơn ở phòng: </span>
        <span className="itemValueCost"> {billCostOfLiving?.Room?.name}</span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Chi tiết hóa đơn: </span>
      </div>
      <div className="detail-cost-living detailItemBillCostLiving">
        {billCostOfLiving?.detailBillCostOfLiving?.map((cost) => (
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
          {billCostOfLiving?.totalPayment && formatNumber(billCostOfLiving?.totalPayment)}
        </span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Trạng thái: </span>
        <span
          className="itemValueCost"
          style={billCostOfLiving?.statusBill !== true ? { color: 'red', fontSize: '14px', fontWeight: 'bold' } : {}}
        >
          {billCostOfLiving?.statusBill === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
        {!billCostOfLiving?.statusBill && (
          <>
            <Button variant="outlined" className="btn-payment-bill-cost-of-Living" onClick={handleClickOpenDialog}>
              Thanh toán
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              marginLeft="10px"
              className="btn-notify-email-cost-of-Living"
              onClick={() => handleNotifyEmail(billCostOfLiving?._id)}
            >
              {billCostOfLiving?.isNotification ? 'Thông báo lại' : 'Thông báo'}
            </Button>
          </>
        )}
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Ngày chốt chỉ số: </span>
        <span className="itemValueCost">{Moment(billCostOfLiving?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Ngày thanh toán: </span>
        <span className="itemValueCost">
          {billCostOfLiving?.datePayment && Moment(billCostOfLiving?.datePayment).format('DD-MM-YYYY')}
        </span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Số sinh viên trong phòng: </span>
        <span className="itemValueCost">
          {' '}
          {billCostOfLiving?.Room?.amountBed.filter((item) => item.student).length + ' sinh viên'}
        </span>
      </div>
      <div className="detailItemBillCostLiving">
        <span className="itemTitleCost">Ghi chú: </span>
        <span className="itemValueCost"> {billCostOfLiving?.notePayment}</span>
      </div>
      <div className="detailItemBillCostLiving item-staff-create">
        <span className="itemTitleCost">Nhân viên khởi tạo: </span>
        <span className="itemValueCost"> {billCostOfLiving?.staffCreate?.nameStaff}</span>
      </div>
      {openDialog && (
        <AlertDialogSlide
          open={openDialog}
          onOpenDialog={handleClickOpenDialog}
          onAgreePayment={handlePaymentBillCostOfLivings}
        />
      )}
      {openDialogDelete && (
        <FormDialog
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
      {id_room && (
        <div className="detailItemBtn">
          <button className="btn-show-all" onClick={handleShowAll}>
            Xem thêm{' '}
          </button>
        </div>
      )}
      <div className="detailItemBtn">
        {billCostOfLiving?.deleted ? (
          <button className="btn-delete-bill" onClick={handleClickOpenDialogDestroy}>
            Xóa vĩnh viễn{' '}
          </button>
        ) : (
          billCostOfLiving?.statusBill && (
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
