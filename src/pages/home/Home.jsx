import styles from './home.scss';
import classNames from 'classnames/bind';
import Widget from '~/components/Layout/components/widget/Widget';
import Chart from '~/components/Layout/components/chart/Chart';
import Featured from '~/components/Layout/components/featured/Featured';
import AllRegistrationForm from '../registrationFormStudent/AllRegistrationFormsStudent';

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('home')}>
      <div className={cx('container')}>
        <div className={cx('widgets')}>
          <Widget type="student" />
          <Widget type="registration" />
          <Widget type="room" />
          <Widget type="balance" />
        </div>
        <div className={cx('charts')}>
          <div className="registration">
            <div className="box-title">
              <span className="title">Các phiếu đăng ký đang chờ xác nhận</span>
            </div>
            <AllRegistrationForm statusRegistrations={'confirmed'} />
          </div>
          {/* <Featured />
          <Chart /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
