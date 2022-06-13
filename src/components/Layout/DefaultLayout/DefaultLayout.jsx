import styles from './default.scss';
import classNames from 'classnames/bind';
import Navbar from './navbar/Navbar';
import Sidebar from './sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { loginSuccess } from '~/redux/authSlice';
import { getListStaff } from '~/redux/apiRequest';
import Cookies from 'js-cookie';

import { createAxios } from '../../../lib/createAxios';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const user = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshToken = Cookies.get('refreshTokenStaff');
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  // const refreshToken = async () => {
  //   try {
  //     const res = await axios.post('https://nqt-server-dormitory-manager.herokuapp.com/api/v1/staffDormitory/refresh', {
  //       refreshTokenStaff: Cookies.get('refreshTokenStaff'),
  //     });

  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     let date = new Date();
  //     const decodedToken = jwt_decode(user?.accessToken);
  //     if (decodedToken.exp < date.getTime() / 1000) {
  //       const data = await refreshToken();
  //       const refreshUser = {
  //         ...user,
  //         accessToken: data.accessToken,
  //         refreshToken: data.refreshToken,
  //       };
  //       dispatch(loginSuccess(refreshUser));
  //       console.log('refresh toke: ' + data.accessToken);
  //       config.headers['token'] = 'Bearer ' + data.accessToken; // gắn lại token mới vào headers token
  //       Cookies.set('refreshTokenStaff', data.refreshToken, {
  //         sameSite: 'strict',
  //         path: '/',
  //       });
  //     }
  //     return config;
  //   },
  //   (err) => {
  //     return Promise.reject(err);
  //   },
  // );
  useEffect(() => {
    if (!refreshToken || !user) {
      navigate('/admin/login');
    }
    if (user?.accessToken) {
      getListStaff(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);
  getListStaff(user?.accessToken, dispatch, axiosJWT);
  return (
    <div className={cx('wrapper')}>
      <Sidebar />
      <div className={cx('container')}>
        <Navbar />
        <div className={cx('content')}>{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
