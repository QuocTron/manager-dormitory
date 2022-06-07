import './itemInfoGuardian.scss';
function ItemInfoGuardian({ guardian }) {
  console.log(guardian);
  return (
    <div className="right-2">
      <div className="content-right">
        <div className="box-title">
          <label className="bill-title">Thông Tin Thân Nhân</label>
        </div>
        <div className="detailItem">
          <span className="itemKey">Họ Tên Thân Nhân:</span>
          <span className="itemValue">{guardian?.nameGuardian}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">CCCD Thân Nhân:</span>
          <span className="itemValue">{guardian?.CCCDGuardian}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">Giới Tính:</span>
          <span className="itemValue">{guardian?.gender}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">Số Điện Thoại:</span>
          <span className="itemValue">{guardian?.numberPhone}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">Địa Chỉ:</span>
          <span className="itemValue">{guardian?.address}</span>
        </div>
      </div>
    </div>
  );
}
export default ItemInfoGuardian;
