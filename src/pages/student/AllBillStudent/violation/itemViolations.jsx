import Moment from 'moment';
import './itemViolationStyle.css';
import { useNavigate } from 'react-router-dom';
function ItemViolationRecord(props) {
  const { violation } = props;
  const navigate = useNavigate();
  let date = new Date();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleShowAll = () => {
    navigate('/admin/student/violations/');
  };
  return (
    <div className="content-right content-right-invoices">
      <div className="detailItem">
        <span className="itemKey">Sinh viên vi phạm: </span>
        <span className="itemValue"> {violation?.student?.nameStudent}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Nội dung vi phạm: </span>
      </div>
      <div className="detail-cost-living detailItem">
        {violation?.contentViolation?.map((violation) => (
          <div className="item-cost-living">
            <div className="name-cost-spending">
              <span className="itemTitleCost">Nội dung phạt: </span>
              <span className="itemValueCost "> {violation?.itemViolation?.nameRule}</span>
            </div>
            <div className="amount-use-spending">
              <div className="amount-use">
                {' '}
                <span className="itemTitleCost">Số lần qui phạm: </span>
                <span className="itemValueCost "> {violation?.amountViolation}</span>
              </div>

              <div className="amount-use">
                {' '}
                <span className="itemTitleCost">Hình phạt: </span>
                <span className="itemValueCost "> {violation?.itemViolation?.overcome}</span>
              </div>
            </div>
            <div className="total-price">
              <span className="itemTitleCost">Số tiền: </span>
              <span className="itemValueCost itemValue">
                {' '}
                {formatNumber(violation?.itemViolation?.monetaryFine)}/vi phạm
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="detailItem">
        <span className="itemKey">Tổng tiền: </span>
        <span className="itemValue"> {formatNumber(violation?.totalViolationRecord)}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Trạng thái: </span>
        <span className="itemValue" style={violation?.statusBill !== true ? { color: 'red' } : {}}>
          {violation?.statusBill === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Ngày lập biên bản: </span>
        <span className="itemValue">{Moment(violation?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItem item-staff-create">
        <span className="itemKey">Nhân viên thành lập: </span>
        <span className="itemValue"> {violation?.staffCreate?.nameStaff}</span>
      </div>
      <div className="detailItemBtn">
        <button className="btn-show-all" onClick={handleShowAll}>
          Xem thêm{' '}
        </button>
        <button className="btn-show-all" onClick={handleShowAll}>
          Lập biên bản{' '}
        </button>
      </div>
    </div>
  );
}
export default ItemViolationRecord;
