import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import ItemContentViolation from './itemContentViolation/itemContentViolation';
import { ToastContainer } from 'react-toastify';
import { createAxios } from '../../../lib/createAxios.js';
import { loginSuccess } from '~/redux/authSlice';
import './newFeeViolationStyle.css';
import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { ConsoleSqlOutlined } from '@ant-design/icons';

function NewBillCostOfLiving() {
  const [rulesDormitory, setRulesDormitory] = useState(null);
  const [contentRuleViolation, setContentRuleViolation] = useState(null);

  // const [rules, setRulesDormitory] = useState(null);
  const { id_violation } = useParams();
  const dispatch = useDispatch();
  const [stateConfirm, setStateConfirm] = useState(() => (id_violation ? true : false));

  const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const { id_student } = useParams();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      if (!id_violation) {
        try {
          const violations = await axios.get(`${API}ruleDormitory/`);

          // setRulesDormitory(violations.data?.allRules);
          const detailRulesDormitory = violations.data?.allRules?.map((item, index) => {
            return {
              id: item._id,
              nameRule: item.nameRule,
              monetaryFine: item.monetaryFine,
              isChecked: false,
              isConfirm: false,
            };
          });
          setRulesDormitory(detailRulesDormitory);
        } catch (error) {
          showToastError(error.response.data.message, 10000);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (id_violation) {
        try {
          const violationRecord = await axios.get(`${API}violationRecord/violation/${id_violation}`);
          const violations = await axios.get(`${API}ruleDormitory/`);
          console.log(violations);
          // setRulesDormitory(violations.data?.allRules);
          const detailRulesDormitory = violations.data?.allRules?.map((item, index) => {
            return {
              id: item._id,
              nameRule: item.nameRule,
              monetaryFine: item.monetaryFine,
              isChecked: violationRecord.data?.violationRecord?.contentViolation.some(
                (itemViolation) => itemViolation.itemViolation._id === item._id,
              ),
              isConfirm: violationRecord.data?.violationRecord?.contentViolation.some(
                (itemViolation) => itemViolation.itemViolation._id === item._id,
              ),
            };
          });
          setRulesDormitory(detailRulesDormitory);
          const contentsViolation = violationRecord.data?.violationRecord?.contentViolation.map((item) => ({
            itemViolation: item.itemViolation._id,
            amountViolation: item.amountViolation,
          }));
          setContentRuleViolation(contentsViolation);
        } catch (error) {
          showToastError(error.response.data.message, 10000);
        }
      }
    })();
  }, []);
  const handleConfirmPenalizedRule = async () => {
    try {
      var formData = new FormData();
      formData.append('CCCD', '123123');
      const res = await axiosJWT.post(`${API}violationRecord/create/`, formData, {
        headers: {
          Accept: 'multipart/form-data',
        },
      });
      showToastSuccess(res.data.message, 5000);
      setTimeout(() => {
        navigate(`/admin/student/${id_student}?status=all-bill`);
      }, 1000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  const updateValueCostOfLiving = (id, amountViolation, overcome) => {
    let rule = contentRuleViolation.find((item) => item.itemViolation === id);
    if (amountViolation > 1) {
      rule = { ...rule, amountViolation };
    }
    if (overcome) {
      rule = { ...rule, overcome };
    }
    const contentUpdate = contentRuleViolation.map((item) => {
      if (item.itemViolation === id) {
        item = rule;
      }
      return item;
    });
    setContentRuleViolation(contentUpdate);
  };

  const handleChangeInput = (id, amountViolation, overcome) => {
    updateValueCostOfLiving(id, amountViolation, overcome);
  };

  const handleChangeCheckBox = (id, value) => {
    const rule = rulesDormitory.find((item) => item.id === id);
    rule.isChecked = value;
    const ruleUpdated = rulesDormitory.map((item) => {
      if (item.id === rule.id) {
        item = rule;
      }
      return item;
    });
    setRulesDormitory(ruleUpdated);
  };

  const handleConfirmContentViolation = () => {
    const ruleUpdated = rulesDormitory.map((item) => {
      if (item.isChecked) {
        item.isConfirm = true;
      }
      return item;
    });
    // lấy ra mảng chỉ toàn cái phần tử confirm
    const violationIsConfirm = ruleUpdated.filter((item) => {
      return item.isConfirm === true;
    });
    if (violationIsConfirm.length !== 0) {
      const violationContentViolation = violationIsConfirm.map((item) => {
        return {
          itemViolation: item.id,
          amountViolation: 1,
          overcome: '',
        };
      });
      setContentRuleViolation(violationContentViolation);
      setStateConfirm(true);
      setRulesDormitory(ruleUpdated);
    } else {
      showToastError('Vui lòng chọn nội dung vi phạm', 10000);
    }
  };

  const handleEditViolationRecord = async () => {
    try {
      const res = await axiosJWT.put(
        `${API}violationRecord/update/${id_violation}`,
        {
          contentViolation: contentRuleViolation,
        },
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      showToastSuccess(res.data.message, 5000);
      setTimeout(() => {
        navigate(`/admin/student/${id_student}?status=all-bill`);
      }, 1000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleClickCancelChecked = (index) => {
    const ruleUpdated = rulesDormitory.map((item) => {
      item.isConfirm = false;
      return item;
    });
    setContentRuleViolation(null);
    setStateConfirm(false);
    setRulesDormitory(ruleUpdated);
  };

  return (
    <div className="create-violation">
      <ToastContainer />
      <div className="left">
        <div className="violations card-violation">
          <div className="box-title">
            <label className="violation-title">Các luật ở KTX</label>
          </div>
          <div className="detail-violation">
            {rulesDormitory && rulesDormitory.length > 0 ? (
              <div className="all-rules">
                {rulesDormitory?.map((rule, index) => (
                  <div className="item-rule">
                    <FormControlLabel
                      value={rule.id}
                      control={
                        <Checkbox
                          disabled={rule.isConfirm}
                          checked={rule.isChecked}
                          onChange={(e) => handleChangeCheckBox(e.target.value, e.target.checked)}
                          color="error"
                        />
                      }
                      label={rule.nameRule}
                      labelPlacement="end"
                    />
                    xử phạt <label className="monetaryFine-rule">{formatNumber(rule.monetaryFine)}</label>
                  </div>
                ))}
                <div className="box-btn-confirm">
                  {!stateConfirm ? (
                    <button type="button" className="btn-violation btn-success" onClick={handleConfirmContentViolation}>
                      Xác nhận
                    </button>
                  ) : (
                    <button type="button" className="btn-violation btn-error" onClick={handleClickCancelChecked}>
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-msg">
                <h6 className="message">Đang cập nhật...</h6>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="right">
        <div className="info-student-violation card-violation">
          <div className="box-title">
            <label className="violation-title">Thông tin sinh viên bị phạt</label>
          </div>
          <div className="info-student-violation">
            <div className="info-primary-student">
              <div className="info-specifically-student">
                <div className="detail-form-student">
                  <span className="key-title">Họ tên sinh viên</span>
                  <span className="key-value">{student?.student?.nameStudent}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Căn cước công dân</span>
                  <span className="key-value">{student?.student?.CCCD}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Phòng</span>
                  <span className="key-value">{student?.student?.roomBuilding?.Room?.name}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Giờng</span>
                  <span className="key-value">{student?.student?.roomBuilding?.Bed}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Email</span>
                  <span className="key-value">{student?.student?.email}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Số điện thoại</span>
                  <span className="key-value">{student?.student?.numberPhone}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Giới tính</span>
                  <span className="key-value">{student?.student?.gender}</span>
                </div>
                <div className="detail-form-student">
                  <span className="key-title">Quê quán</span>
                  <span className="key-value">{student?.student?.province}</span>
                </div>
              </div>

              <div className="detail-form-student">
                <img className="image-avatar-student" src={student?.student?.avatar} alt={''} />
              </div>
            </div>
          </div>
        </div>
        <div className="detail-content-violation card-violation">
          <div className="content-rule-violation">
            <div className="box-title">
              <label className="violation-title">Nội dung xử phạt</label>
            </div>

            {stateConfirm && (
              <div className="container-rules-violation">
                <div className="content-rules-violation">
                  {rulesDormitory?.map(
                    (rule) =>
                      rule.isConfirm && (
                        <ItemContentViolation onChangeValue={handleChangeInput} idRule={rule.id} ruleViolation={rule} />
                      ),
                  )}
                </div>
                <div className="box-btn-penalize">
                  {id_violation ? (
                    <button className="btn btn-penalize" onClick={handleEditViolationRecord}>
                      Xác định chỉnh sửa
                    </button>
                  ) : (
                    <button className="btn btn-penalize" onClick={handleConfirmPenalizedRule}>
                      Xác định xử phạt
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <button className="btn btn-" onClick={handleClickConfirm}>
        Click change
      </button> */}
    </div>
  );
}
export default NewBillCostOfLiving;
