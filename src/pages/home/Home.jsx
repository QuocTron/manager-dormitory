import styles from './home.scss';
import classNames from 'classnames/bind';
import Widget from '~/components/Layout/components/widget/Widget';
import AllRegistrationForm from '../registrationFormStudent/AllRegistrationFormsStudent';
import { ToastContainer } from 'react-toastify';
const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('home')}>
      <ToastContainer />
      <div className={cx('container')}>
        <div className={cx('widgets')}>
          <Widget type="student" />
          <Widget type="registration" />
          <Widget type="room" />
          <Widget type="room-empty" />
        </div>
        <div className={cx('charts')}>
          <div className="registration">
            <div className="box-title">
              <span className="title">Các phiếu đánh giá đang chờ xác nhận</span>
            </div>
            <AllRegistrationForm statusRegistrations={'confirming'} />
          </div>
          {/* <Featured />
          <Chart /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
