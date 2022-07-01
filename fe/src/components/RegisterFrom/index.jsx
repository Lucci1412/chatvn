import React, { useState } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { delay, messageFail } from "../../actions/index";
import * as action from "../../actions/auth";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./style.css";
function RegisterFrom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const PD = process.env.REACT_APP_PUBLIC_FOLDER;
  const URI = process.env.REACT_APP_URI;
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const onToggle = () => {
    const auth = document.querySelector(".auth");
    auth.classList.toggle("active");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, username, password, rePassword } = registerForm;
   
    if (!username || !email || !password || !rePassword) {
      return messageFail("Vui lòng nhập đủ thông tin");
    }
    if (username.length>50) {
      return messageFail("Tên tài khoản không quá 50 kí tự");
    }
    if (password !== rePassword) {
      return messageFail("Mật khẩu nhập lại không chính xác");
    }

    try {
      const res = await axios.post(`${URI}/auth/register`, registerForm);
      dispatch(action.registerRequest());
      if (res.data.success) {
        await delay(1000);
        navigate("/");
        dispatch(action.registerSuccess(res.data));
      } else {
        messageFail(res.data.message);
      }
    } catch (error) {
      dispatch(action.loginFail(error));
    }
  };

  return (
    <div className="user signup">
      <div className="auth_form">
        <form onSubmit={handleRegister}>
          <h2>Đăng Kí</h2>
          <input
            require="true"
            type="text"
            minLength="6"
            name="userName"
            onChange={(e) =>
              setRegisterForm({ ...registerForm, username: e.target.value })
            }
            placeholder="Tên tài khoản"
          />
          <input
            require="true"
            autoComplete="current-email"
            placeholder="Địa chỉ email"
            name="email"
            onChange={(e) =>
              setRegisterForm({ ...registerForm, email: e.target.value })
            }
          />
          <input
            require="true"
            type="password"
            name="password"
            placeholder="Mật khẩu"
            minLength="6"
            onChange={(e) =>
              setRegisterForm({ ...registerForm, password: e.target.value })
            }
          />
          <input
            require="true"
            type="password"
            name="rePassword"
            placeholder="Nhập lại mật khẩu khẩu"
            autoComplete="current-password"
            onChange={(e) =>
              setRegisterForm({ ...registerForm, rePassword: e.target.value })
            }
          />
          <button type="submit">
            {isLoading ? (
              <CircularProgress
                className="submit_login_icon"
                size="15px"
                color="inherit"
              />
            ) : (
              "Đăng kí"
            )}
          </button>
          <p className="login_text">
            Đã có tài khoản?{" "}
            <Link onClick={onToggle} to="#">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
      <div className="login_left">
        <img
          className="login_left_img"
          src={`${PD}/img/register.jpeg`}
          alt="img"
        />
      </div>
    </div>
  );
}

export default RegisterFrom;
