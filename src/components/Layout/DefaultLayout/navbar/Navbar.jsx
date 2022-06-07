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
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const cx = classNames.bind(styles);

function Navbar() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const { dispatch } = useContext(DarkModeContext);
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

  return (
    <div className={cx('navbar')}>
      <div className={cx('wrapper')}>
        <Tippy content={'Tìm Kiếm'} placement="bottom">
          <div className={cx('search')}>
            <input type="text" placeholder="Tìm kiếm..." className={cx('placeholder-text')} />
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
              <div className={cx('counter')}>26</div>
            </div>
          </Tippy>
          <Tippy content={'Thoát'} placement="bottom">
            <div className={cx('item')}>
              <LogoutOutlinedIcon className={cx('icon')} />
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
