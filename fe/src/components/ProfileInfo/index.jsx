import React, { useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as action from '../../actions/auth'
import axios from "axios";

import "./style.css";
function ProfileInfo({ user, params }) {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const URI = process.env.REACT_APP_URI;
  const navigate = useNavigate();

  const [follow, setFollow] = useState(
    currentUser.following.includes(params)
  );

  const handleFollow = async () => {
    try {
      const res = await axios.put(`${URI}/user/follow/${params}`, {
        id: currentUser._id,
      });
      if (res.data.success) {
        setFollow(!follow);
        dispatch(action.follow(res.data.follow))
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoToMessenger = async () => {
    
    navigate(`/messenger/${user._id}`);
  };
  return (
    <div className="profile_info">
      <img className="avatar" src={user.avatar} alt="" />
      <div className="profile_info_right">
        <h3>{user.username}</h3>
        <span className="profile_info_id">{`ID:${user._id}`}</span>
        {user.birthday && (
          <span className="profile_info_birthday">{user.birthday}</span>
        )}
        <span className="profile_info_hobby">{`Sở thích: ${
          user.hobby ? user.hobby : " Chưa cập nhật"
        }`}</span>
        <span className="profile_info_contact">{`Liên hệ: ${
          user.contact ? user.contact : " Chưa cập nhật"
        }`}</span>
        <div className="profile_info_flex_button">
          {params !== currentUser._id && (
            <div
              onClick={handleGoToMessenger}
              className="profile_info_right_button"
            >
              Nhắn tin
            </div>
          )}
          {params === currentUser._id ? (
            <Link to="/setting" className="profile_info_right_button">
              Cập nhật
            </Link>
          ) : (
            <button onClick={handleFollow} className="submit_button ">
              {follow ? "Đã theo dõi" : "Theo dõi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
