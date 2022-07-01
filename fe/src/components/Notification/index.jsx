import React, { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationItem from "../NotificationItem/index";
import axios from "axios";
import { useSelector } from "react-redux";
import "./style.css";
function Notification() {
  const { socket } = useSelector((state) => state.socketIo);
  const currentUser = useSelector((state) => state.auth.user);
  const URI = process.env.REACT_APP_URI;
  const [notifications, setNotifications] = useState([]);
  const [countNotification, setCountNotifications] = useState(0);
  const [isShowMore, setIsShowMore] = useState(false);
  useEffect(() => {
    const getListNotification = async () => {
      try {
        const res = await axios.get(
          `${URI}/notification/${currentUser._id}?limit=3`
        );
        if (res.data.success) {
          const data = res.data.notifications.sort((no1, no2) => {
            return new Date(no2.createdAt) - new Date(no1.createdAt);
          });
          setNotifications(data);
          setCountNotifications(res.data.length);
          data.length < 3 ? setIsShowMore(false) : setIsShowMore(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getListNotification();
  }, [URI, currentUser]);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setCountNotifications(c=>c + 1);
    });
  }, [socket]);
  const handleShowMoreNotification = async () => {
    try {
      const res = await axios.get(`${URI}/notification/${currentUser._id}`);
      if (res.data.success) {
        const data = res.data.notifications.sort((no1, no2) => {
          return new Date(no2.createdAt) - new Date(no1.createdAt);
        });
        setNotifications(data);
        setCountNotifications(res.data.length);
        setIsShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteNotifi = (value, status) => {
    setNotifications(notifications.filter((item) => item._id !== value));
    status && setCountNotifications(countNotification - 1);
  };
  return (
    <div className="notification">
      <div className="notification_title">
        <div className="notification_icon">
          <NotificationsNoneIcon htmlColor="#409fff" />
          {countNotification !== 0 && (
            <div className="notification_quantity">{countNotification}</div>
          )}
        </div>
        <span>Thông báo </span>
      </div>
      <ul className="notification_list">
        {notifications[0] ? (
          notifications.map((item, index) => {
            return (
              <NotificationItem
                item={item}
                key={index}
                deleteNotifi={deleteNotifi}
              />
            );
          })
        ) : (
          <div className="no_notification">Không có thông báo</div>
        )}
      </ul>
      {isShowMore && (
        <div className="btn_show_more" onClick={handleShowMoreNotification}>
          Xem tất cả
        </div>
      )}
    </div>
  );
}

export default Notification;
