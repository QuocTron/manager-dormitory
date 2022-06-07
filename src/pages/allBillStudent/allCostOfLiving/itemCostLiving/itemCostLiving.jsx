import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './itemCostLivingStyle.css';
function ItemCostOfLiving(props) {
  const { costOfLiving, stateCost, changeValue } = props;
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  return (
    <div className="item-cost-living">
      <div className="name-cost-spending">
        <span className="itemTitleCost">Tên dịch vụ: </span>
        <span className="itemValueCost "> {costOfLiving?.nameCost}</span>
      </div>
      <div className="price-spending">
        <div className="price-spending-item">
          {' '}
          <span className="itemTitleCost">Mức giá: </span>
          <span className="itemValueCost ">{formatNumber(costOfLiving?.priceCost)}</span>
        </div>

        <div className="amount-use">
          {' '}
          <span className="itemTitleCost">Chỉ số sử dụng: </span>
          <input
            type="number"
            className="inputValueUseCost "
            onChange={(e) => changeValue(parseInt(e.target.value), stateCost, 0)}
          />
        </div>
        <div className="confirm">
          <button type="button" className="btn-confirm" onClick={''} />
        </div>
      </div>
    </div>
  );
}
export default ItemCostOfLiving;
