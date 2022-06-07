import './login.scss';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import loginImg from '~/assets/images/login-admin.png';
import { useState } from 'react';
import { loginUser } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty';
const FormItem = Form.Item;

function Login() {
  const [CCCD, setUsername] = useState('');
  const [passwordStaff, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationMsg, setValidationMsg] = useState('');
  const user = useSelector((state) => state.auth.login?.error);

  const onChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value);
  };
  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };
  const validateAll = () => {
    const msg = {};
    if (isEmpty(CCCD)) {
      msg.CCCD = 'Vui lòng nhập tài khoản đăng nhập';
    }
    if (isEmpty(passwordStaff)) {
      msg.passwordStaff = 'Vui lòng nhập mật khẩu đăng nhập';
    }
    setValidationMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    else return true;
  };

  const handleLogin = (e) => {
    e.preventDefault(); //Submit -> không load lại trang
    const isValid = validateAll();
    if (!isValid) return;
    const user = {
      CCCD: CCCD,
      passwordStaff: passwordStaff,
    };
    loginUser(user, dispatch, navigate);
  };

  return (
    <div className="lContainer">
      <div className="lItem">
        <div className="loginImage">
          <img src={loginImg} width="300" style={{ position: 'relative' }} alt="login" />
        </div>
        <div className="loginForm">
          <h2>Đăng Nhập Admin</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <FormItem>
              <Input
                prefix={<UserOutlined style={{ color: 'black' }} />}
                placeholder="Nhập vào tài khoản"
                onChange={onChangeUsername}
              />
              <p className="text-validate">{validationMsg.CCCD}</p>
            </FormItem>
            <FormItem>
              <Input
                prefix={<LockOutlined style={{ color: 'black' }} />}
                type="password"
                placeholder="Nhập vào mật khẩu"
                onChange={onChangePassword}
              />
              <p className="text-validate">{validationMsg.passwordStaff}</p>
            </FormItem>
            <FormItem>
              <Checkbox>Ghi nhớ tài khoản</Checkbox>
              <hr></hr>
              <button type="submit" value="Submit" className="login-form-button">
                Đăng Nhập
              </button>
            </FormItem>
          </form>
        </div>
      </div>
      <div className="footer">
        <span className="footerLink">@Student Dormitory Admin</span>
      </div>
    </div>
  );
}

export default Login;
