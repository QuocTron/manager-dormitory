import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './itemCostLivingStyle.css';
function ItemCostOfLiving(props) {
  const { costOfLiving, stateCost, onChangValue, billCostOfLiving } = props;

  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const [valueUseNew, setValueUseNew] = useState((billCostOfLiving && billCostOfLiving.amountUseNew) || 0);

  return (
    <div className="item-cost-of-living">
      <div className="name-cost-spending">
        <span className="itemTitleCost">Tên dịch vụ: </span>
        <span className="itemValueCost ">
          {' '}
          {billCostOfLiving ? billCostOfLiving?.nameCost?.nameCost : costOfLiving?.nameCost}
        </span>
      </div>
      <div className="price-spending">
        <div className="price-spending-item">
          {' '}
          <span className="itemTitleCost">Mức giá: </span>
          <span className="itemValueCost ">
            {formatNumber(billCostOfLiving ? billCostOfLiving?.nameCost?.priceCost : costOfLiving?.priceCost)}
          </span>
        </div>

        <div className="amount-use">
          {' '}
          <span className="itemTitleCost">Chỉ số sử dụng: </span>
          <input
            type="number"
            value={valueUseNew}
            className="inputValueUseCost "
            onChange={(e) => {
              setValueUseNew(parseInt(e.target.value));
              onChangValue(parseInt(e.target.value), stateCost, 0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default ItemCostOfLiving;
