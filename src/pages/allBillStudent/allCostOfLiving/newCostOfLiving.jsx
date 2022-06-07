import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ItemCostOfLiving from './itemCostLiving/itemCostLiving';
import './newCostLivingStyle.css';

function NewBillCostOfLiving() {
  const [costOfLivings, setCostOfLivings] = useState(null);
  const [lastBillCostOfLivings, setLastBillCostOfLivings] = useState(null);
  const [costSend, setCostSend] = useState(null);

  const nameStateNew = 'amountUseNew';
  const nameStateOld = 'amountUseOld';

  const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);
  const user = useSelector((state) => state.auth.login?.currentUser);

  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  useEffect(() => {
    (async function () {
      const costOfLivings = await axios.get(`${API}costOfLiving/`);

      setCostOfLivings(costOfLivings.data?.costOfLivings);
      const detailBillCostOfLiving = costOfLivings.data?.costOfLivings?.map((item, index) => {
        return {
          nameCost: item._id,
          [nameStateOld]: 0,
          [nameStateNew]: 0,
        };
      });
      setCostSend(detailBillCostOfLiving);
      const roomId = student?.student?.roomBuilding?.Room?._id;
      const billCostOfLivings = await axios.get(`${API}billCostOfLiving/roomFollow/${roomId}?page=1&limit=1/`);
      setLastBillCostOfLivings(billCostOfLivings.data?.billCostOfLivings);
      const lastBllCost = billCostOfLivings.data?.billCostOfLivings;
      //   if (lastBllCost && lastBllCost.length > 0) {
      //     lastBllCost[0]?.detailBillCostOfLiving.forEach((item, index) =>
      //       updateValueCostOfLiving(0, index, parseInt(item.amountUseOld)),
      //     );
      //   }
      return () => {
        setCostOfLivings(null);
        setLastBillCostOfLivings(null);
      };
    })();
  }, []);

  const updateValueCostOfLiving = (valueNew, index, valueOld) => {
    const costSendUpdated = costSend;
    if (costSendUpdated[index].amountUseOld === 0) {
      if (lastBillCostOfLivings && lastBillCostOfLivings.length > 0) {
        lastBillCostOfLivings[0]?.detailBillCostOfLiving.forEach(
          (item, index) => (costSendUpdated[index].amountUseOld = parseInt(item.amountUseOld)),
        );
      }
    }
    if (valueOld !== 0 && valueNew !== 0) {
      costSendUpdated[index].amountUseNew = valueNew;
      costSendUpdated[index].amountUseOld = valueOld;
    }
    if (valueOld !== 0) {
      costSendUpdated[index].amountUseOld = valueOld;
    }
    if (valueNew !== 0) {
      costSendUpdated[index].amountUseNew = valueNew;
    }
    setCostSend(costSendUpdated);

    console.log(costSend);
  };

  const handleChangeInput = (valueNew, index, valueOld) => {
    updateValueCostOfLiving(valueNew, index, valueOld);
  };

  const handleClickConfirm = async (index) => {
    console.log(costSend);
    const billCostOfLiving = {
      Room: lastBillCostOfLivings[0]?.Room?._id,
      statusBill: false,
      detailBillCostOfLiving: costSend,
    };
    const res = await axios.post(`${API}billCostOfLiving/create/`, billCostOfLiving, {
      headers: { token: `Bearer ${user?.accessToken}` },
    });
    if (res.data.success) {
      console.log('xong chuyển lại trang trước');
    }
  };

  return (
    <div className="create-cost-living ">
      <div className="cost-livings card-cost-living">
        <div className="box-title">
          <label className="cost-living-title">Chi tiết các chi phí</label>
        </div>
        <div className="detail-cost-living">
          {costOfLivings && costOfLivings.length > 0 ? (
            costOfLivings.map((costOfLiving, index) => (
              <ItemCostOfLiving
                key={costOfLiving._id}
                costOfLiving={costOfLiving}
                stateCost={index}
                changeValue={handleChangeInput}
              />
            ))
          ) : (
            <div className="empty-msg">
              <h6 className="message">Đang cập nhật</h6>
            </div>
          )}
        </div>
      </div>
      <div className="info-room-get-bill card-cost-living">
        <div className="box-title">
          <label className="bill-title">Thông tin bên nhận</label>
        </div>
        {lastBillCostOfLivings && lastBillCostOfLivings.length > 0 ? (
          <div className="amountUseOld">
            <span className="title-amount">Các chỉ só cũ</span>
            <div className="amountDetail">
              {lastBillCostOfLivings[0]?.detailBillCostOfLiving.map((item, index) => (
                <div className="amount">
                  <span className="amountUsePld">{item.nameCost?.nameCost}</span>

                  <span className="amountUsePld">{item?.amountUseOld}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="amountUseOld">
            {/* <span className="title-amount">Các chỉ só cũ</span>
            <div className="amountDetail">
              {costOfLivings && costOfLivings.length > 0
                ? costOfLivings.map((item, index) => (
                    <div className="amount">
                      <span className="amountUsePld">{item.nameCost}</span>

                      <input
                        type="number"
                        className="inputValueUseCost "
                        onChange={(e) => handleChangeInput(0, index, parseInt(e.target.value))}
                      />
                    </div>
                  ))
                : {}}
            </div> */}
          </div>
        )}
      </div>
      <button className="btn btn-" onClick={handleClickConfirm}>
        Click change
      </button>
    </div>
  );
}
export default NewBillCostOfLiving;
