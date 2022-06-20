import './widget.scss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createAxios } from '../../../../lib/createAxios.js';
import { loginSuccess } from '~/redux/authSlice';
import axios from 'axios';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function Widget({ type }) {
  let data;
  const user = useSelector((state) => state.auth.login?.currentUser);

  const dispatch = useDispatch();
  const [amountStudent, setAmountStudent] = useState(0);
  const [amountRegistration, setAmountRegistration] = useState(0);
  const [amountRoom, setAmountRoom] = useState(0);
  const [amountRoomEmpty, setAmountRoomEmpty] = useState(0);

  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  //gán tạm
  const amount = 100;
  // const diff = 20;

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosJWT.get(`${API}student/all-students`, {
          headers: { token: `Bearer ${user?.accessToken}` },
        });
        console.log(res?.data.students);
        const student = res?.data.students.filter(
          (student) => student.roomBuilding.Room != null && student.roomBuilding.Bed != null,
        );
        setAmountStudent(student.length);
      } catch (error) {}
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${API}registrationAtDormitory/registration-follow-status/?search=confirming&page=1`,
        );

        console.log(res?.data?.registrations);
        const registrationAmount = res.data?.registrations;

        setAmountRegistration(registrationAmount.length);
      } catch (error) {}
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}roomBuilding/`);

        console.log(res?.data?.roomBuildings);
        const roomBuildingAmount = res.data?.roomBuildings;
        const roomBuildingEmpty = roomBuildingAmount.filter(
          (room) => room.amountBed != null && room.amountBed.includes((student) => student == null),
        );
        setAmountRoom(roomBuildingAmount.length);
      } catch (error) {}
    })();
  }, []);

  switch (type) {
    case 'student':
      data = {
        title: 'TỔNG SỐ SINH VIÊN ĐANG Ở',
        isMoney: false,
        link: 'See all users',
        amount: amountStudent,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: 'crimson',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
            }}
          />
        ),
      };
      break;
    case 'registration':
      data = {
        title: 'PHIẾU ĐĂNG KÝ CHƯA XÁC NHẬN',
        isMoney: false,
        amount: amountRegistration,
        link: 'View all orders',
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: 'rgba(218, 165, 32, 0.2)',
              color: 'goldenrod',
            }}
          />
        ),
      };
      break;
    case 'room':
      data = {
        title: 'TỔNG SỐ PHÒNG',
        isMoney: false,
        amount: amountRoom,
        link: 'View net earnings',
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: 'rgba(0, 128, 0, 0.2)', color: 'green' }}
          />
        ),
      };
      break;
    case 'balance':
      data = {
        title: 'BALANCE',
        isMoney: true,
        link: 'See details',
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: 'rgba(128, 0, 128, 0.2)',
              color: 'purple',
            }}
          />
        ),
      };
      break;
    default:
      break;
  }
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && '$'} {data?.amount}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {/* {diff} % */}
        </div>
        {data.icon}
      </div>
    </div>
  );
}

export default Widget;
