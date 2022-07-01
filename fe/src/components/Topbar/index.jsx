import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  MessageOutlined,
  ExploreOutlined,
  AccountCircleOutlined,
  Close,
  List,
  AccountBox,
  Settings,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../actions/auth";
import { TOKEN } from "../../constants/index";
import { io } from "socket.io-client";
import axios from "axios";
import { getSocket } from "../../actions/index";
import Avatar from '@mui/material/Avatar';
import "./style.css";
function Topbar() {
  const URI = process.env.REACT_APP_URI;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [countNotification, setCountNotification] = useState(
    user.countNotifyMess
  );
  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);
  useEffect(() => {
    setCountNotification(user.countNotifyMess);
  }, [user.countNotifyMess]);
  useEffect(() => {
    socket?.on("getMessenger", (data) => {
      data && setCountNotification(countNotification + 1);
    });
  }, [socket, countNotification]);

  useEffect(() => {
    socket?.emit("newUser", user._id);
    socket?.on("getOnlineUser", (onlineUsers) => {
      dispatch(getSocket({ socket, onlineUsers }));
    });
  }, [socket, user._id, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    dispatch(setAuth({ isAuth: false, user: null }));
    navigate("/login");
    // window.location.reload();
  };
  const handleOpenMobileTopbar = () => {
    document
      .querySelector(".mobile_top_bar")
      .classList.add("mobile_top_bar_active");
  };
  const handleCloseMobileTopbar = () => {
    document
      .querySelector(".mobile_top_bar_active")
      .classList.remove("mobile_top_bar_active");
  };
  const handleGoto = (value) => {
    document
      .querySelector(".mobile_top_bar")
      .classList.remove("mobile_top_bar_active");
    navigate(`${value}`);
  };

  const handleResetCount = async () => {
    try {
      setCountNotification(0);
      await axios.put(`${URI}/user/countNotifyMess/${user._id}/${0}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="top_bar">
      <div className="top_bar_logo">ChatVN</div>
      <div className="top_bar_list">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "top_bar_link" + (isActive ? " top_bar_link_active" : "")
          }
        >
          <HomeOutlined className="top_bar_link_icon" />
          <span>Trang chủ</span>
        </NavLink>
        <NavLink
          to={`/messenger`}
          onClick={handleResetCount}
          className={({ isActive }) =>
            "top_bar_link" + (isActive ? " top_bar_link_active" : "")
          }
        >
          <div className="top_bar_link_icon_wrapper">
            <MessageOutlined className="top_bar_link_icon" />
            {countNotification !== 0 && (
              <div className="notification_messenger_quantity">
                {countNotification}
              </div>
            )}
          </div>
          <span>Tin nhắn</span>
        </NavLink>
        <NavLink
          to={`/profile/${user._id}`}
          className={({ isActive }) =>
            "top_bar_link" + (isActive ? " top_bar_link_active" : "")
          }
        >
          <AccountCircleOutlined className="top_bar_link_icon" />
          <span>Cá nhân</span>
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            "top_bar_link" + (isActive ? " top_bar_link_active" : "")
          }
        >
          <ExploreOutlined className="top_bar_link_icon" />
          <span>Khám phá</span>
        </NavLink>
        <div className="top_bar_link top_bar_link_list">
          <List
            className="top_bar_link_icon"
            onClick={handleOpenMobileTopbar}
          />
          {/* mobile */}
          <div className="mobile_top_bar">
            <div className="mobile_top_bar_info">
              <img src={user.avatar} alt="" className="avatar" />
              <h4>{user.username}</h4>
              <div className="mobile_top_bar_info_icon">
                <Close onClick={handleCloseMobileTopbar} />
              </div>
            </div>
            <div className="mobile_top_bar_list">
              <div
                onClick={() => handleGoto`/profile/${user._id}`()}
                className="mobile_top_bar_link"
              >
                <AccountBox />
                <p>Hồ sơ cá nhân</p>
              </div>
              <div
                onClick={() => handleGoto(`setting`)}
                className="mobile_top_bar_link"
              >
                <Settings />
                <p>Cài đặt</p>
              </div>
              <li className="mobile_top_bar_link">
                <Logout />
                <p onClick={handleLogout}>Đăng xuất</p>
              </li>
            </div>
          </div>
        </div>
      </div>
      <div className="top_bar_account">
      <Avatar alt="" src={user&&user.avatar} />
        <span>{user.username}</span>
        <div className="top_bar_setting">
          <ul className="top_bar_setting_list">
            {user.isAdmin && (
              <Link to={`/dashboard/`} className="top_bar_setting_item">
                <AdminPanelSettings />
                <span className="top_bar_setting_item_name">Admin</span>
              </Link>
            )}
            <Link to={`/profile/${user._id}`} className="top_bar_setting_item">
              <AccountBox />
              <span className="top_bar_setting_item_name">Hồ sơ cá nhân</span>
            </Link>
            <Link to="setting" className="top_bar_setting_item">
              <Settings />
              <span className="top_bar_setting_item_name">Cài đặt</span>
            </Link>
            <hr />
            <li className="top_bar_setting_item">
              <Logout />
              <span
                className="top_bar_setting_item_name"
                onClick={handleLogout}
              >
                Đăng xuất
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
