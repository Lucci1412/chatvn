import React, { useState } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import * as action from "../../actions/auth";
import { delay,messageFail } from "../../actions/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {TOKEN} from '../../constants/index';
import "./style.css";
function LoginFrom() {
  const PD = process.env.REACT_APP_PUBLIC_FOLDER;
  const URI = process.env.REACT_APP_URI;
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const onToggle = () => {
    const auth = document.querySelector(".auth");
    auth.classList.toggle("active");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(action.loginRequest());
    try {
      const res = await axios.post(`${URI}/auth/login`, loginForm);
      await delay(1000);
      if (res.data.success) {
        localStorage.setItem(TOKEN, res.data.accessToken);
        const {password,...info}=res.data.isUser
        dispatch(action.loginSuccess(info));
        navigate("/");
        
      } else {
        messageFail(res.data.message)
        dispatch(action.loginFail());
      }
    } catch (error) {
      dispatch(action.loginFail(error));
    }
  };
  return (
    <div className="user login">
      <div className="login_left">
        <img
          className="login_left_img"
          src={`${PD}/img/login.jpeg`}
          alt="img"
        />
      </div>
      <div className="auth_form">
        <form onSubmit={handleLogin}>
          <h2>Đăng Nhập</h2>
          <input
            type="email"
            name="email"
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            placeholder="Địa chỉ email"
          />
          <input
            type="password"
            require="true"
            name="password"
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            minLength="6"
            placeholder="Mật khẩu"
            autoComplete="current-password"
          />
          <button type="submit">
            {isLoading ? (
              <CircularProgress
                className="submit_login_icon"
                size="15px"
                color="inherit"
              />
            ) : (
              "Đăng nhập"
            )}
          </button>
          <p className="login_text">
            Chưa có tài khoản?{" "}
            <Link onClick={onToggle} to="#">
              Đăng kí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginFrom;
