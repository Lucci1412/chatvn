import React, { useEffect, useState } from "react";
import ContactMessengerList from "../../components/ContactMessengerList/index";
import ChatBox from "../../components/ChatBox/index";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./style.css";
function MessengerPage() {
  const params = useParams().id;
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [listMess, setListMess] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getListMess = async () => {
      try {
        const res = await axios.get(
          `${URI}/boxMessenger/find/${currentUser._id}`
        );
        if (res.data.success) {
          const b = res.data.listBoxMessenger.map((item) => {
            return item.members.find((id) => id !== currentUser._id);
          });
          setListMess(b);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getListMess();
  }, [currentUser, URI, params]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${URI}/user/${params}`);
        if (res.data.user) {
          setUser(res.data.user)
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [params, URI]);

  return (
    <div className="messenger_page">
      <div className="messenger_page_left">
        <div className="messenger_page_name">{currentUser.username}</div>
        <ContactMessengerList
          listMess={listMess}
          userParams={user? user._id : false}
        />
      </div>
      <div className="messenger_page_right">
        {(user?._id) ? (
          <>
            <div className="messenger_page_right_list_mess">
            <ContactMessengerList listMess={listMess} />
          </div>
            <ChatBox />
          </>
        ) : (
          <span className="mess_page_no_chat">
            Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
          </span>
        )}
      </div>
    </div>
  );
}

export default MessengerPage;
