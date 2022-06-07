import Moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
function ItemFeeInvoice(props) {
  const { feeInvoice } = props;
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
  return (
    <div className="content-right content-right-invoices">
      <div className="detailItem">
        <span className="itemKey">Hóa đơn của: </span>
        <span className="itemValue"> {feeInvoice?.student?.nameStudent}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Phòng: </span>
        <span className="itemValue"> {feeInvoice?.roomBuilding?.name}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Số tiền phải trả: </span>
        <span className="itemValue"> {formatNumber(feeInvoice?.totalPrice)}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Trạng thái: </span>
        <span className="itemValue" style={feeInvoice?.statusInvoice !== true ? { color: 'red' } : {}}>
          {feeInvoice?.statusInvoice === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Hạng cuối: </span>
        <span className="itemValue" style={feeInvoice?.dateLine > date ? { color: 'red' } : {}}>
          {Moment(feeInvoice?.dateLine).format('DD-MM-YYYY')}
        </span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Ngày thành lập: </span>
        <span className="itemValue"> {Moment(feeInvoice?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItemBtn">
        <button className="btn-show-all" onClick={handleShowAll}>
          Xem thêm{' '}
        </button>
        <button className="btn-show-all" onClick={handleExtentDays}>
          Gia hạn thêm{' '}
        </button>
      </div>
    </div>
  );
}
export default ItemFeeInvoice;
