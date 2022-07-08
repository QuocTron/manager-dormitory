import styles from './navbar.scss';
import classNames from 'classnames/bind';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { DarkModeContext } from '~/context/darkModeContext';
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { logoutUser } from '~/redux/apiRequest';
import { loginSuccess } from '~/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '~/lib/createAxios';
import { showToastError, showToastSuccess } from '../../../../lib/showToastMessage.js';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';
function Navbar() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const { dispatch } = useContext(DarkModeContext);
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  // const userMenu = [
  //   {
  //     icon: <PersonOutlinedIcon className={cx('icon')} />,
  //     title: user?.nameStaff,
  //     to: '/@hoaa',
  //   },
  //   {
  //     icon: <LogoutOutlinedIcon className={cx('icon')} />,
  //     title: 'Đăng Xuất',
  //     to: '/admin/login',
  //     separate: true,
  //   },
  // ];

  const [registration, setRegistrations] = useState();

  const dispatchs = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const allRegistrationConfirming = await axios.get(
        `${API}registrationAtDormitory/registration-follow-status/?search=confirming&page=1&limit=0`,
      );
      setRegistrations(allRegistrationConfirming.data.registrations);
    })();
  }, []);
  const handleLogout = () => {
    const refreshToken = Cookies.get('refreshTokenStaff');

    logoutUser(dispatchs, navigate, user?.accessToken, axiosJWT, refreshToken);
    showToastSuccess();
  };
  return (
    <div className={cx('navbar')}>
      <div className={cx('wrapper')}>
        <Tippy content={'Tìm Kiếm'} placement="bottom">
          <div className={cx('search')}>
            {/* <input type="text" placeholder="Tìm kiếm..." className={cx('placeholder-text')} /> */}
            <SearchOutlinedIcon />
          </div>
        </Tippy>
        <div className={cx('items')}>
          <div className={cx('item')}>
            <LanguageOutlinedIcon className={cx('icon')} />
            English
          </div>
          <div className={cx('item')}>
            <DarkModeOutlinedIcon className={cx('icon')} onClick={() => dispatch({ type: 'TOGGLE' })} />
          </div>
          <div className={cx('item')}>
            <FullscreenOutlinedIcon className={cx('icon')} />
          </div>
          <Tippy content={'Thông Báo'} placement="bottom">
            <div className={cx('item')}>
              <NotificationsNoneOutlinedIcon className={cx('icon')} />
              <div className={cx('counter')}>{registration?.length}</div>
            </div>
          </Tippy>
          <Tippy content={'Thoát'} placement="bottom">
            <div className={cx('item')}>
              <LogoutOutlinedIcon className={cx('icon')} onClick={handleLogout} />
            </div>
          </Tippy>
          <div className={cx('itemAvatar')}>
            <img src={user?.avatar} alt="" className={cx('avatar')} />
            <span className="nameLogin">{user?.nameStaff}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
