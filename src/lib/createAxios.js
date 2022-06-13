import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

//refresh
const refreshToken = async () => {
  const refreshToken = Cookies.get('refreshTokenStaff');
  console.log('refreshtoken', refreshToken);
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
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      // giải mã
      console.log(config.headers['token']);
      const decodeToken = jwt_decode(user?.accessToken); // mã hóa accesstoken
      console.log(decodeToken.exp < date.getTime() / 1000);
      console.log(decodeToken.exp);
      console.log(date.getTime() / 1000);

      if (decodeToken.exp < date.getTime() / 1000) {
        console.log('Vô nè');
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
        console.log(data);
        console.log(Cookies.get('refreshTokenStaff'));

        config.headers['token'] = 'Bearer ' + data.accessToken; // gắn lại token mới vào headers token
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return newInstance;
};
