import React, { useEffect, useState } from "react";
import axios from "axios";
import formatDistance from "date-fns/formatDistance";
import viLocale from "date-fns/locale/vi";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { messageSuccess, messageFail } from "../../actions/index";
import { HashLink } from "react-router-hash-link";
import "./style.css";
function NotificationItem({ item, deleteNotifi }) {
  const [notification, setNotification] = useState("");
  const timeNotification = formatDistance(
    new Date(item.createdAt),
    new Date(),
    {
      locale: viLocale,
    }
  );
  const [user, setUser] = useState("");
  const URI = process.env.REACT_APP_URI;
  useEffect(() => {
    item && setNotification(item);
  }, [item]);
  useEffect(() => {
    const getUser = async () => {
      const res = item && (await axios.get(`${URI}/user/${item.senderId}`));
      setUser(res.data.user);
    };
    getUser();
  }, [item, URI]);
  const handleDeleteNotification = async () => {
    try {
      const res =
        notification &&
        (await axios.delete(`${URI}/notification/${notification._id}`));
      if (res.data.success) {
        deleteNotifi(notification._id, notification.status);
        messageSuccess(res.data.message);
      }
    } catch (error) {
      messageFail(error);
    }
  };
  const handleGotoPost = async () => {
    try {
      const res =
        notification &&
        (await axios.put(`${URI}/notification/${notification._id}`, {
          status: false,
        }));
      if (res.data.success) {
        setNotification((prev) => ({ ...prev, status: false }));
      }
    } catch (error) {
      messageFail(error);
    }
  };

  return (
    <div className="notification_item">
      <img alt="" className="avatar" src={user?.avatar} />
      <HashLink
        onClick={handleGotoPost}
        to={`/#${notification.postId}`}
        smooth
        className={
          notification.status ? "notification_info" : "notification_info_active"
        }
      >
        <p>
          <strong> {user.username}</strong> đã{" "}
          {`${
            notification.type === 1 ? "thả cảm xúc " : "bình luận"
          } về bài viết của bạn `}
        </p>
        <h6>{timeNotification}</h6>
      </HashLink>
      <div onClick={handleDeleteNotification} className="notification_delete">
        <DeleteOutlineIcon
          htmlColor="grey"
          className="notification_delete_icon"
        />
      </div>
    </div>
  );
}

export default NotificationItem;
