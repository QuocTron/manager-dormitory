import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

//refresh
const refreshToken = async () => {
  const refreshToken = Cookies.get('refreshTokenStaff');
  try {
    const res = await axios.post(
      'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/staffDormitory/refresh/staff',
      {
        refreshTokenStaff: refreshToken,
      },
    );

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create({
    headers: {
      token: 'Bearer ' + user?.accessToken,
    },
  });
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      // giải mã

      const decodeToken = jwt_decode(user?.accessToken); // mã hóa accesstoken
      let accessToken = user?.accessToken;
      if (decodeToken.exp < date.getTime() / 1000) {
        // lấy thời gian ngay tại thười điểm chạy , .exp thời gian gia hạn token
        const data = await refreshToken(); //nhận accessToken và refreshToken mới

        // cập nhật lại accessToken
        const refreshUser = {
          ...user, // giữ lại tất cả thông tin của user
          accessToken: data.accessToken, // chỉ cập nhật lại accessToken
          refreshToken: data.refreshToken,
        };

        dispatch(stateSuccess(refreshUser));
        Cookies.set('refreshTokenStaff', data.refreshToken, {
          sameSite: 'strict',
          path: '/',
        });

        config.headers.token = 'Bearer ' + data.accessToken; // gắn lại token mới vào headers token
        accessToken = data.accessToken;
      }
      console.log(config);
      // config.headers['Content-Type'] = 'multipart/form-data';
      config.headers['alo'] = 'chu';
      console.log(config);
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstance;
};
