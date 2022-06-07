import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
// import useStyles from './styles';
import { useDispatch } from 'react-redux';

import './style.scss';
import { getRoomBuilding } from '~/redux/apiRequest';

export default function CardItem(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bedChecked, setBedChecked] = useState(0);
  const [msg, setMessage] = useState('');

  const { cardItem } = props;

  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleCheckedChange = (e) => {
    setBedChecked(e.target.value);
    setMessage('');
  };
  const handleContinue = (e) => {
    e.preventDefault();
    if (bedChecked === 0) {
      setMessage('Vui lòng chọn giường');
    } else {
      getRoomBuilding(dispatch, navigate, cardItem?._id, '/admin/students/new', parseInt(bedChecked));
    }
  };
  return (
    <div className="card-item" style={{ maxWidth: '57rem', height: '17rem', borderRadius: '10px' }}>
      <div class="cards-container">
        <div class="course">
          <div class="course-preview">
            <h6>{cardItem?.building?.name}</h6>
            <h2>{cardItem?.name}</h2>
          </div>
          <div class="course-info">
            <p className="title">
              {' '}
              Giá thuê <span className="value-room">{formatNumber(cardItem?.priceRoom)}</span> /tháng
            </p>
            <p className="title">
              Trạng thái phòng <span className="value-room">{cardItem?.statusRoom}</span>
            </p>

            <p className="title">
              Phòng <span className="value-room">{cardItem?.amountBed.length} </span>giường
            </p>
            <form onSubmit={handleContinue} className="form-number-bed">
              {cardItem?.amountBed.map((bed) => {
                return (
                  <label>
                    <PersonIcon style={bed.student ? { color: 'orange' } : {}} />
                    <input
                      type="radio"
                      name="numberBed"
                      value={bed.numberBed}
                      onChange={handleCheckedChange}
                      style={bed.student ? { visibility: 'hidden' } : {}}
                    />
                  </label>
                );
              })}
              <button type="submit" class="btn">
                {' '}
                Tiếp tục{' '}
              </button>
              {msg && <div className="errorMsg">{msg}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
