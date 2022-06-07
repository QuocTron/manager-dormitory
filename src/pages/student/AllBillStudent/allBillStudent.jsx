import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Moment from 'moment';
import './allBillStudentStyle.css';
import { useNavigate } from 'react-router-dom';
import ItemFeeInvoice from './feeInvoices/itemFeeInvoices';
import ItemCostOfLiving from './billCostOfLiving/itemBillCostOfLiving';
import ItemViolationRecord from './violation/itemViolations';
const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
function AllBillStudent() {
  const [billCostLivings, setBillCostLivings] = useState(null);
  const [feeInvoices, setFeeInvoices] = useState(null);
  const [billViolations, setBillViolations] = useState(null);
  let date = new Date();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);

  const student = useSelector((state) => state.studentDetail.studentDetail.dataStudent);
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleCreateNew = () => {
    navigate(`/admin/room/cost-of-living/`);
  };
  const handleCreateNewViolation = () => {
    navigate('/admin/student/violation/');
  };
  useEffect(() => {
    (async function () {
      if (student && student.success) {
        const studentId = student?.student?._id;
        const feeInvoicesData = await axios.get(`${API}feeInvoice/student/${studentId}?page=1&limit=1/`, {
          headers: { token: `Bearer ${user?.accessToken}` },
        });
        setFeeInvoices(feeInvoicesData.data?.feeInvoices);
        const roomId = student?.student?.roomBuilding?.Room?._id;
        const billCostOfLivings = await axios.get(`${API}billCostOfLiving/roomFollow/${roomId}?page=1&limit=1/`, {
          headers: { token: `Bearer ${user?.accessToken}` },
        });
        setBillCostLivings(billCostOfLivings.data?.billCostOfLivings);
        const billViolations = await axios.get(`${API}violationRecord/violation/student/${studentId}?page=1&limit=1/`, {
          headers: { token: `Bearer ${user?.accessToken}` },
        });
        setBillViolations(billViolations.data?.violationRecords);
      }
    })();
  }, []);
  return (
    <div className="all-bill-student">
      <div className="invoices card-bill">
        <div className="box-title">
          <label className="bill-title">Phiếu thu tiền thuê KTX</label>
        </div>
        {feeInvoices && feeInvoices.length > 0 ? (
          feeInvoices.map((feeInvoice) => <ItemFeeInvoice key={feeInvoice._id} feeInvoice={feeInvoice} />)
        ) : (
          <div className="empty-msg">
            <h6 className="message">Bạn chưa có hóa đơn nào</h6>
          </div>
        )}
      </div>
      <div className="bill-cost-livings card-bill">
        <div className="box-title">
          <label className="bill-title">Phiếu hóa đơn điện nước</label>
        </div>
        {billCostLivings && billCostLivings.length > 0 ? (
          billCostLivings.map((billCostOfLiving) => (
            <ItemCostOfLiving key={billCostOfLiving._id} costOfLiving={billCostOfLiving} />
          ))
        ) : (
          <div className="empty-msg">
            <h6 className="message">Bạn chưa có hóa đơn nào</h6>
          </div>
        )}
        <div className="detailBtnCreate">
          <button className="btn-show-all" onClick={handleCreateNew}>
            Tạo mới{' '}
          </button>
        </div>
      </div>
      <div className="bill-violation card-bill">
        <div className="box-title">
          <label className="bill-title">Biên bản vi phạm</label>
        </div>
        {billViolations && billViolations.length > 0 ? (
          billViolations.map((violation) => <ItemViolationRecord key={violation._id} violation={violation} />)
        ) : (
          <div className="empty-msg">
            <h6 className="message">Bạn không có biên bản nào</h6>
          </div>
        )}
        <div className="detailBtnCreate">
          <button className="btn-show-all" onClick={handleCreateNewViolation}>
            Tạo mới{' '}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllBillStudent;
