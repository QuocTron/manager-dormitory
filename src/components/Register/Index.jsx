import './register.scss';
import TableTemplate from '@trendmicro/react-table';
import Select from 'react-select';
import useRoomBuildingForm from '~/components/RoomBuilding/useRoomBuildingForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useReducer } from 'react';
import { getRoomBuildings } from '~/redux/apiRequest';
import BsTabs from './Tabs/BsTabs';

function Index() {
  const { state, onGenderSelect, onBuildingSelect, onRoomBuildingsSelect } = useRoomBuildingForm(false);
  const { genders, buildings, roomBuildings, selectedGender, selectedBuilding, selectedRoomBuilding } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const  initStateRoomBuilding={
  //     roomBuilding:"",
  //     roomBuildings:[],
  // }
  const roomBuilding = useSelector((state) => state.roomBuilding.roomBuilding?.roomBuilding);
  const roomBuildingsSelected = useSelector((state) => state.roomBuildings.roomBuildings?.roomBuildings);

  useEffect(() => {
    if (selectedBuilding) {
      getRoomBuildings(dispatch, selectedBuilding.value);
    }
  }, [selectedBuilding]);

  // const reducer = (state, action) =>{

  // }

  //const [stateRoomBuilding, dispatchAction] = useReducer(reducer,in)
  // useEffect(() => {
  //   if(roomBuilding?)
  //   getRoomBuildings(dispatch,roomBuilding?.);
  // },[roomBuilding])
  const columns = [
    {
      title: 'Event Type',
      dataKey: 'eventType',
    },
    {
      title: 'Affected Devices',
      dataKey: 'affectedDevices',
    },
    {
      title: 'Detections',
      dataKey: 'detections',
    },
  ];

  const rows = [
    { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
    { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
    { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
    { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
    { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
    { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 },
  ];
  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h2 className="title">TRANG ĐĂNG KÝ THÔNG TIN SINH VIÊN Ở KÝ TÚC XÁ</h2>
        </div>
        <div className="center">
          <form className="newStudentForm">
            <div className="select-room flex flex-row gap-5">
              <Select
                name="genderId"
                key={`genderId_${selectedGender}`}
                isDisabled={genders.length === 0}
                options={genders}
                onChange={(option) => onGenderSelect(option)}
                placeholder="-- Giới/Tính --"
                defaultValue={selectedGender}
              />

              <Select
                name="buildingId"
                key={`buildingId_${selectedBuilding?.value}`}
                isDisabled={buildings.length === 0}
                options={buildings}
                onChange={(option) => onBuildingSelect(option)}
                placeholder="-- Tầng --"
                defaultValue={selectedBuilding}
              />
              {/*
              <Select
                name="roomBuildingId"
                key={`roomBuildingId_${selectedRoomBuilding?.value}`}
                isDisabled={roomBuildings.length === 0}
                options={roomBuildings}
                placeholder="-- Phòng --"
                onChange={(option) => onRoomBuildingsSelect(dispatch, navigate, option)}
                defaultValue={selectedRoomBuilding}
              /> */}
            </div>
          </form>
        </div>
        {/* {selectedRoomBuilding?.value
          <div className="bottom">
        } */}
        {roomBuildingsSelected ? (
          <div className=" ">
            <BsTabs roomBuildings={roomBuildingsSelected} roomSelected={roomBuilding} />
          </div>
        ) : (
          <div className="bottom">
            <div className="price-table">
              <h2>THÔNG TIN DÀNH CHO SINH VIÊN ĐĂNG KÝ Ở KÝ TÚC XÁ</h2>
              <label>Các loại phòng ở: Tiền phòng ở (đơn vị tính: VNĐ)</label>
              <TableTemplate columns={columns} data={rows} width={800} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
