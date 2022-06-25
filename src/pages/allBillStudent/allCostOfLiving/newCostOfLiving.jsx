import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import ItemCostOfLiving from './itemCostLiving/itemCostLiving';
import { showToastError, showToastSuccess } from '../../../lib/showToastMessage.js';
import 'react-toastify/dist/ReactToastify.css';
import './newCostLivingStyle.css';
import { createAxios } from '../../../lib/createAxios.js';
import { loginSuccess } from '../../../redux/authSlice.js';

function NewBillCostOfLiving() {
  const [costOfLivings, setCostOfLivings] = useState(null);
  const [lastBillCostOfLivings, setLastBillCostOfLivings] = useState(null);
  const [costSend, setCostSend] = useState(null);
  const [room, setRoom] = useState(null);
  const [notePayment, setNotePayment] = useState(null);
  const [billCostOfLivingEdit, setBillCostOfLivingEdit] = useState(null);

  const dispatch = useDispatch();
  const nameStateNew = 'amountUseNew';
  const nameStateOld = 'amountUseOld';
  const { id_room } = useParams();
  const { id_bill } = useParams();
  const navigate = useNavigate();

  const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
  const user = useSelector((state) => state.auth.login?.currentUser);

  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  useEffect(() => {
    (async function () {
      try {
        if (!id_bill) {
          const costOfLivings = await axiosJWT.get(`${API}costOfLiving/`);

          setCostOfLivings(costOfLivings.data?.costOfLivings);
          const detailBillCostOfLiving = costOfLivings.data?.costOfLivings?.map((item, index) => {
            return {
              nameCost: item._id,
              [nameStateOld]: 0,
              [nameStateNew]: 0,
            };
          });
          setCostSend(detailBillCostOfLiving);
          const billCostOfLivings = await axios.get(`${API}billCostOfLiving/roomFollow/${id_room}?page=1&limit=1/`);
          setLastBillCostOfLivings(billCostOfLivings.data?.billCostOfLivings);
        }

        const room = await axios.get(`${API}roomBuilding/${id_room}`);
        if (room?.data.success) setRoom(room.data.roomBuilding);
      } catch (error) {
        showToastError(error.response.data.message, 10000);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (id_bill) {
        try {
          const res = await axios.get(`${API}billCostOfLiving/bill/${id_bill}`);
          setBillCostOfLivingEdit(res?.data?.billCostOfLiving);
          const detailBillCostOfLiving = res?.data?.billCostOfLiving?.detailBillCostOfLiving.map((item, index) => {
            return {
              nameCost: item.nameCost._id,
              [nameStateOld]: item.amountUseOld,
              [nameStateNew]: item.amountUseNew,
            };
          });
          setCostSend(detailBillCostOfLiving);
          console.log(detailBillCostOfLiving);
        } catch (error) {
          showToastError(error.response.data.message, 10000);
        }
      }
    })();
  }, []);
  const quantityOfMemberInRoom = room?.amountBed?.filter((item) => item.student != null).length;
  const amountBed = room?.amountBed?.length;

  const updateValueCostOfLiving = (valueNew, index, valueOld) => {
    const costSendUpdated = costSend;
    if (costSendUpdated[index].amountUseOld === 0) {
      if (lastBillCostOfLivings && lastBillCostOfLivings.length > 0) {
        lastBillCostOfLivings[0]?.detailBillCostOfLiving.forEach(
          (item, index) => (costSendUpdated[index].amountUseOld = parseInt(item.amountUseNew)),
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
  };

  const handleChangeInput = (valueNew, index, valueOld) => {
    updateValueCostOfLiving(valueNew * 1, index, valueOld * 1);
  };
  const handleChangeValueNotePayment = (value) => {
    setNotePayment(value);
  };

  const handleClickConfirm = async (index) => {
    //! check value input
    const valueUseNew = costSend.filter((item) => item.amountUseNew && item.amountUseOld);
    if (!valueUseNew.length) {
      showToastError('Bạn chưa nhập chỉ số dùng', 10000);
      return;
    }
    const valueInputValidate = costSend.filter((item) => item.amountUseNew < item.amountUseOld);
    if (valueInputValidate.length) {
      // nếu có
      showToastError('Chỉ số mới không hợp lệ', 10000);
      return;
    }

    const billCostOfLiving = {
      Room: id_room,
      statusBill: false,
      detailBillCostOfLiving: costSend,
      notePayment: notePayment,
    };
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/billCostOfLiving/create/`, billCostOfLiving, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      if (res.data.success) {
        showToastSuccess(res.data.message, 5000);
        setTimeout(() => navigate(`/admin/room/${id_room}`), 6000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        showToastError(error.response.data.message, 10000);
      }
    }
  };
  const handleEditBill = async () => {
    try {
      const valueUseNew = costSend.filter((item) => item.amountUseNew && item.amountUseOld);
      if (!valueUseNew.length) {
        showToastError('Bạn chưa nhập chỉ số dùng', 10000);
        return;
      }
      const valueInputValidate = costSend.filter((item) => item.amountUseNew < item.amountUseOld);
      if (valueInputValidate.length) {
        // nếu có
        showToastError('Chỉ số mới không hợp lệ', 10000);
        return;
      }
      const billCostOfLiving = {
        detailBillCostOfLiving: costSend,
      };
      if (notePayment) billCostOfLiving.notePayment = notePayment;
      console.log(billCostOfLiving);
      const res = await axiosJWT.put(
        `${API}billCostOfLiving/update/${id_bill}`,
        { detailBillCostOfLiving: costSend },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess(res.data.message, 5000);
      // setTimeout(() => navigate(`/admin/room/${id_room}`), 6000);
    } catch (error) {
      console.log(error);
      showToastError(error.response.data.message, 10000);
    }
  };
  return (
    <div className="create-cost-living ">
      <div className="box-title-create-cost-living">
        <span className="title-create-cost-living">
          Tạo hóa đơn điện nước cho <span className="title-name-room">{room?.name}</span>
        </span>
      </div>
      <div className="container-bill-cost-of-living">
        <div className="cost-livings card-cost-living">
          <div className="box-title">
            <label className="cost-living-title">Chi tiết các chi phí</label>
          </div>
          <div className="detail-cost-living">
            {billCostOfLivingEdit ? (
              billCostOfLivingEdit.detailBillCostOfLiving.map((item, index) => (
                <ItemCostOfLiving
                  key={item._id}
                  billCostOfLiving={item}
                  stateCost={index}
                  onChangValue={handleChangeInput}
                />
              ))
            ) : costOfLivings && costOfLivings.length > 0 ? (
              costOfLivings.map((costOfLiving, index) => (
                <ItemCostOfLiving
                  key={costOfLiving._id}
                  costOfLiving={costOfLiving}
                  stateCost={index}
                  onChangValue={handleChangeInput}
                />
              ))
            ) : (
              <div className="empty-msg">
                <h6 className="message">Đang cập nhật...</h6>
              </div>
            )}
          </div>
        </div>
        <div className="info-room-get-bill card-cost-living">
          <div className="box-title">
            <label className="bill-title">Thông tin phòng</label>
          </div>
          <div className="box-container-info-cost-living">
            <div className="box-detail-last-bill-cost-living">
              {billCostOfLivingEdit ? (
                <div className="amountUseOld">
                  <div className="box-title">
                    <span className="title">Chỉ số cũ</span>
                  </div>
                  <div className="amountDetail">
                    <div className="header-title">
                      <span className="title">Tên dịch vụ</span>
                      <span className="title">Chỉ số sử dụng cũ</span>
                    </div>
                    {billCostOfLivingEdit?.detailBillCostOfLiving.map((item, index) => (
                      <div className="oldUse itemKey">
                        <div className="amountUseBillLast nameCost itemValue">{item.nameCost?.nameCost}</div>

                        <span className="amountUseBillLast quantityUseLast itemValue">{item?.amountUseOld}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : lastBillCostOfLivings && lastBillCostOfLivings?.length > 0 ? (
                <div className="amountUseOld">
                  <div className="box-title">
                    <span className="title">Chỉ số cũ</span>
                  </div>
                  <div className="amountDetail">
                    <div className="header-title">
                      <span className="title">Tên dịch vụ</span>
                      <span className="title">Chỉ số sử dụng cũ</span>
                    </div>
                    {lastBillCostOfLivings[0]?.detailBillCostOfLiving.map((item, index) => (
                      <div className="oldUse itemKey">
                        <div className="amountUseBillLast nameCost itemValue">{item.nameCost?.nameCost}</div>

                        <span className="amountUseBillLast quantityUseLast itemValue">{item?.amountUseNew}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="amountUseOld">
                  <div className="box-title">
                    <span className="title">Chỉ số cũ</span>
                  </div>
                  <div className="amountDetail">
                    <div className="header-title">
                      <span className="title">Tên dịch vụ</span>
                      <span className="title">Chỉ số sử dụng cũ</span>
                    </div>
                    {costOfLivings && costOfLivings.length > 0 ? (
                      costOfLivings.map((item, index) => (
                        <div className="oldUse itemKey">
                          <div className="amountUseBillLast nameCost itemValue">{item.nameCost}</div>

                          <input
                            type="number"
                            className="inputValueUseCostOld itemValue"
                            onChange={(e) => handleChangeInput(0, index, parseInt(e.target.value))}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="empty-msg">
                        <h6 className="message">Đang cập nhật...</h6>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="box-info-room">
              <div className="box-title">
                <span className="title">Thông tin nhận</span>
              </div>
              <div className="detail-form">
                <span className="itemKey">Tên phòng</span>
                <span className="itemValue">{room?.name}</span>
              </div>
              <div className="detail-form">
                <span className="itemKey">Tầng</span>
                <span className="itemValue">{room?.building?.name}</span>
              </div>
              <div className="detail-form">
                <span className="itemKey">Giá thuê</span>
                <span className="itemValue">{room?.priceRoom && formatNumber(room?.priceRoom)}</span>
              </div>
              <div className="detail-form">
                <span className="itemKey">Số người ở trong phòng</span>
                <span className="itemValue">{quantityOfMemberInRoom && quantityOfMemberInRoom + '/' + amountBed}</span>
              </div>
            </div>
          </div>
          <div className="box-note-payment">
            <label className="title-note-label">Ghi chú:</label>
            <textarea
              className="textarea-note-payment"
              placeholder={'Ghi chú....'}
              onChange={(e) => handleChangeValueNotePayment(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="box-btn-confirm">
        {billCostOfLivingEdit ? (
          <button className="btn btn-confirm" onClick={handleEditBill}>
            Sửa
          </button>
        ) : (
          <button className="btn btn-confirm" onClick={handleClickConfirm}>
            Xác nhận
          </button>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
export default NewBillCostOfLiving;
