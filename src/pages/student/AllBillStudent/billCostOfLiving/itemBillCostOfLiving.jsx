import Moment from 'moment';
import './itemBillCostOfLivingStyle.css';
import { useNavigate } from 'react-router-dom';
function ItemCostOfLiving(props) {
  const { costOfLiving } = props;
  console.log(costOfLiving);
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
  const handleCreateNew = () => {
    navigate(`/admin/room/cost-of-living/`);
  };
  const countStudent = costOfLiving?.Room?.amountBed.filter((student) => student != null);
  return (
    <div className="content-right content-right-invoices">
      <div className="detailItem">
        <span className="itemKey">Hóa đơn ở phòng: </span>
        <span className="itemValue"> {costOfLiving?.Room?.name}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Chi tiết hóa đơn: </span>
      </div>
      <div className="detail-cost-living detailItem">
        {costOfLiving?.detailBillCostOfLiving?.map((cost) => (
          <div className="item-cost-living">
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
                {formatNumber((cost?.amountUseNew - cost?.amountUseOld) * cost?.nameCost?.priceCost)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="detailItem">
        <span className="itemKey">Tổng tiền: </span>
        <span className="itemValue"> {formatNumber(costOfLiving?.totalPayment)}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Trạng thái: </span>
        <span className="itemValue" style={costOfLiving?.statusBill !== true ? { color: 'red' } : {}}>
          {costOfLiving?.statusBill === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Ngày chốt chỉ số: </span>
        <span className="itemValue">{Moment(costOfLiving?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Số sinh viên trong phòng: </span>
        <span className="itemValue"> {countStudent.length}</span>
      </div>
      <div className="detailItem item-staff-create">
        <span className="itemKey">Nhân viên khởi tạo: </span>
        <span className="itemValue"> {costOfLiving?.staffCreate?.nameStaff}</span>
      </div>
      <div className="detailItemBtn">
        <button className="btn-show-all" onClick={handleShowAll}>
          Xem thêm{' '}
        </button>
      </div>
    </div>
  );
}
export default ItemCostOfLiving;
