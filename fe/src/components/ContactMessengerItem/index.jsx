import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "./style.css";

function ContactMessengerItem({ userId }) {
  const URI = process.env.REACT_APP_URI;
  const friendOnline = useSelector((state) => state.socketIo.listOnline);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${URI}/user/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [userId, URI]);
  return (
    <>
      <NavLink
        
        to={`/messenger/${userId}`}
        className={({ isActive }) =>
          "contact_messenger_item" +
          (isActive ? " contact_messenger_item_active" : "")
        }
      >
        <img className="avatar" src={user && user.avatar} alt="avatar" />
        <div
          className={
            friendOnline.includes(userId)
              ? "contact_messenger_online"
              : "contact_messenger_offline"
          }
        ></div>
        <div className="contact_messenger_info">
          <span>{user && user.username}</span>
          <p>{friendOnline.includes(userId) ? "Online" : "Ofline"}</p>
        </div>
      </NavLink>
      <NavLink
        to={`/messenger/${userId}`}
        className={({ isActive }) =>
          "mobile_contact_messenger_item" +
          (isActive ? " contact_messenger_item_active" : "")
        }
      >
        <div className="mobile_contact_messenger_img">
          <img className="avatar" src={user && user.avatar} alt="avatar" />
          <div
            className={
              friendOnline.includes(userId)
                ? "mobile_contact_messenger_online"
                : "mobile_contact_messenger_offline"
            }
          ></div>
        </div>
        <div className="mobile_contact_messenger_info">
          <span>{user && user.username}</span>
        </div>
      </NavLink>
    </>
  );
}

export default ContactMessengerItem;
