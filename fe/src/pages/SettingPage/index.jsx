import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { messageSuccess,messageFail } from "../../actions/index";
import * as actions from "../../actions/user";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

import "./style.css";
function SettingPage() {
  const URI = process.env.REACT_APP_URI;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user);
  const [info, setInfo] = useState({
    username: user.username,
    hobby: user.hobby,
    password: user.password,
    birthday: user.birthday,
  });
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0)
}, []);
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${URI}/user/info/${user._id}`, info);
      if (res.data.success) {
        // window.reload();
        messageSuccess(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateAvatar = async () => {
    
    dispatch(actions.updateAvatarRequest());
    if (avatar) {
      const data = new FormData();
      data.append("avatar", avatar);
      try {
        const res = await axios.post(`${URI}/user/avatar/${user._id}`, data);
        if (res.data.success) {
          setAvatar(null);
          dispatch(actions.updateAvatarSuccess());
          messageSuccess(res.data.message);
        }
      } catch (error) {
        dispatch(actions.updateAvatarFail(error));
        console.log(error);
      }
    }
    else{
      messageFail('Vui lòng chọn ảnh đại diện');
      dispatch(actions.updateAvatarFail());
    }
  };

  return (
    <div className="setting_page">
      <div className="setting_info">
        <form onSubmit={handleUpdateInfo} className="setting_form">
          <div className="setting_info_item">
            <span>Tên tài khoản</span>
            <input
              type="text"
              value={info.username}
              name="username"
              onChange={(e) => setInfo({ ...info, username: e.target.value })}
              placeholder={user.username}
            />
          </div>
          <div className="setting_info_item">
            <span>Ngày sinh</span>
            <input
              type="text"
              value={info.birthday}
              name="birthday"
              onChange={(e) => setInfo({ ...info, birthday: e.target.value })}
              placeholder={user.birthday}
            />
          </div>
          <div className="setting_info_item">
            <span>Sở thích</span>
            <input
              type="text"
              value={info.hobby}
              name="hobby"
              onChange={(e) => setInfo({ ...info, hobby: e.target.value })}
              placeholder={user.hobby}
            />
          </div>
          <div className="setting_info_item">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={info.password}
              name="password"
              onChange={(e) => setInfo({ ...info, password: e.target.value })}
              placeholder="Vui lòng nhập mật khẩu mới "
            />
          </div>
          <input type="submit" className="submit_button" value="Cập nhật" />
        </form>
      </div>
      <div className="setting_avatar">
        <div className="setting_form">
          <span>Cập nhật ảnh đại diện</span>
          <hr />
          <div className="setting_avatar_main">
            <img className="avatar" src={user.avatar} alt="" />
            <div className="setting_avatar_input">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
              <button
                onClick={handleUpdateAvatar}
                className="submit_button"
              >
                {isLoading ? (
                  <CircularProgress
                    className="submit_login_icon"
                    size="15px"
                    color="inherit"
                    
                  />
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
