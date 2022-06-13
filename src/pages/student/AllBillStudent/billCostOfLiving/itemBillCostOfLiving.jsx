import Moment from 'moment';
import './itemBillCostOfLivingStyle.css';
import { useNavigate } from 'react-router-dom';
function ItemCostOfLiving(props) {
  const { costOfLiving, room } = props;
  console.log(room);
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
  console.log(costOfLiving);
  const countStudent = costOfLiving?.Room?.amountBed?.filter((student) => student != null);
  return (
    <div className="content-right content-right-invoices ">
      <div className="detailItem">
        <span className="itemTitleCost">Hóa đơn ở phòng: </span>
        <span className="itemValueCost"> {costOfLiving?.Room?.name || room}</span>
      </div>
      <div className="detailItem">
        <span className="itemTitleCost">Chi tiết hóa đơn: </span>
      </div>
      <div className="detail-cost-living detailItem">
        {costOfLiving?.detailBillCostOfLiving?.map((cost) => (
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
                {formatNumber((cost?.amountUseNew - cost?.amountUseOld) * cost?.nameCost?.priceCost)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="detailItem">
        <span className="itemTitleCost">Tổng tiền: </span>
        <span className="itemValueCost"> {costOfLiving?.totalPayment && formatNumber(costOfLiving?.totalPayment)}</span>
      </div>
      <div className="detailItem">
        <span className="itemTitleCost">Trạng thái: </span>
        <span className="itemValueCost" style={costOfLiving?.statusBill !== true ? { color: 'red' } : {}}>
          {costOfLiving?.statusBill === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      </div>
      <div className="detailItem">
        <span className="itemTitleCost">Ngày chốt chỉ số: </span>
        <span className="itemValueCost">{Moment(costOfLiving?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItem">
        <span className="itemTitleCost">Số sinh viên trong phòng: </span>
        <span className="itemValueCost"> {countStudent?.length}</span>
      </div>
      <div className="detailItem item-staff-create">
        <span className="itemTitleCost">Nhân viên khởi tạo: </span>
        <span className="itemValueCost"> {costOfLiving?.staffCreate?.nameStaff}</span>
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
