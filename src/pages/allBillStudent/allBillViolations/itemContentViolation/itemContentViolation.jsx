import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './itemContentViolationStyle.css';
function ItemContentViolation(props) {
  const { ruleViolation, onChangeValue, idRule } = props;

  const navigate = useNavigate();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  return (
    <div className="item-rule-violation">
      <div className="detail-content-violation name-rule-violation">
        <span className="itemTitleViolation">Nội dung vi phạm: </span>
        <span className="itemValueRule key-value-content"> {ruleViolation?.nameRule}</span>
      </div>
      <div className="detail-content-violation monetary-fine-item">
        <span className="itemTitleViolation">Xử phạt: </span>
        <span className="itemValueRule key-value-content">{formatNumber(ruleViolation?.monetaryFine)}</span>
      </div>
      <div className="monetaryFine">
        <div className="detail-content-violation amount-violation">
          <span className="itemTitleViolation">Số lần vi phạm: </span>
          <input
            type="number"
            min="0"
            max="10"
            step="1"
            value="1"
            className="inputValueAmountViolation key-value-content"
            onChange={(e) => onChangeValue(idRule, parseInt(e.target.value), '')}
          />
        </div>
        <div className="detail-content-violation overcome-violation">
          <span className="itemTitleViolation">Nội dung vi phạm: </span>
          <textarea
            type="text"
            className="inputValueOvercome key-value-content"
            onChange={(e) => onChangeValue(idRule, 1, e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
export default ItemContentViolation;
