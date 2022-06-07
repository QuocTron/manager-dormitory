import styles from './home.scss';
import classNames from 'classnames/bind';
import Widget from '~/components/Layout/components/widget/Widget';
import Chart from '~/components/Layout/components/chart/Chart';
import Featured from '~/components/Layout/components/featured/Featured';

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('home')}>
      <div className={cx('container')}>
        <div className={cx('widgets')}>
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className={cx('charts')}>
          <Featured />
          <Chart />
        </div>
      </div>
    </div>
  );
}

export default Home;
