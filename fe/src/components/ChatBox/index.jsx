import React, { useState, useEffect, useRef } from "react";
import { Send } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import MoodIcon from "@mui/icons-material/Mood";
import Messenger from "../Messenger/index";
import { setNotifyMess } from "../../actions/auth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "./style.css";

function ChatBox({ userId }) {
  const { socket } = useSelector((state) => state.socketIo);
  const params = useParams().id;
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [listMessengers, setListMessengers] = useState([]);
  const [user, setUser] = useState([]);
  const [currentBoxChat, setCurrentBoxChat] = useState(null);
  const [messenger, setMessenger] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const scroll = useRef();
  const [arrivalMessenger, setArrivalMessenger] = useState(null);
  const { listOnline } = useSelector((state) => state.socketIo);
  const dispatch = useDispatch();
  // get user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = params
          ? await axios.get(`${URI}/user/${params}`)
          : await axios.get(`${URI}/user/${userId}`);
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [params, URI, userId]);

  useEffect(() => {
    socket?.on("getMessenger", (data) => {
      setArrivalMessenger({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);
  /*lấy box chat hiện tại */

  useEffect(() => {
    const getCurrentBoxChat = async () => {
      const res = await axios.get(
        `${URI}/boxMessenger/find/${params ? params : userId}/${
          currentUser._id
        }`
      );
      if (res.data.boxMessenger) {
        setCurrentBoxChat(res.data.boxMessenger);
      }
    };
    getCurrentBoxChat();
  }, [params, userId, URI, currentUser._id]);

  useEffect(() => {
    arrivalMessenger &&
      currentBoxChat?.members.includes(arrivalMessenger.senderId) &&
      setListMessengers((prev) => [...prev, arrivalMessenger]);
  }, [arrivalMessenger, currentBoxChat]);

  useEffect(() => {
    const getListMessenger = async () => {
      if (currentBoxChat) {
        const res = await axios.get(`${URI}/messenger/${currentBoxChat._id}`);
        if (res.data.messengers) {
          setListMessengers(res.data.messengers);
        } else {
          setListMessengers([]);
        }
      } else {
        setListMessengers([]);
      }
    };
    getListMessenger();
  }, [currentBoxChat, URI]);

  const handleSendMessenger = async (e) => {
    e.preventDefault();

    if (!currentBoxChat) {
      try {
        const result = await axios.post(`${URI}/boxMessenger`, {
          senderId: currentUser._id,
          userId: user._id,
        });
        if (result.data.success) {
          setCurrentBoxChat(result.data.newBoxMessenger);
          const data = {
            text: messenger,
            senderId: currentUser._id,
            boxMessengerId: result.data.newBoxMessenger._id,
          };

          socket.emit("sendMessenger", {
            senderId: currentUser._id,
            receiverId: user._id,
            text: messenger,
          });
          const res = await axios.post(`${URI}/messenger`, data);
          await axios.put(`${URI}/user/countNotifyMess/${user._id}/${1}`);
          await axios.put(`${URI}/user/countNotifyMess/${currentUser._id}/${0}`);
          setListMessengers([...listMessengers, res.data.newMessenger]);
          setMessenger("");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const data = {
        text: messenger,
        senderId: currentUser._id,
        boxMessengerId: currentBoxChat._id,
      };

      socket.emit("sendMessenger", {
        senderId: currentUser._id,
        receiverId: user._id,
        text: messenger,
      });
      const res = await axios.post(`${URI}/messenger`, data);
               await axios.put(`${URI}/user/countNotifyMess/${user._id}/${1}`);
      const a =await axios.put(`${URI}/user/countNotifyMess/${currentUser._id}/${0}`);
      if(a){
        dispatch(setNotifyMess(a.data.user))
      }

      setListMessengers([...listMessengers, res.data.newMessenger]);
      setMessenger("");
    }
  };
  const handleEmoji = (emoji) => {
    setMessenger((prev) => prev + emoji.native);
  };
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [listMessengers]);
  return (
    <div className="chat_box">
      <div className="chat_box_nav">
        <img src={user.avatar} className="avatar" alt="" />
        <div className="chat_box_nav_info">
          <h3>{user.username}</h3>
          <span>{listOnline.includes(user._id) ? "Online" : "Offline"}</span>
        </div>
        {!params && (
          <div className="chat_box_nav_icon">
            <CloseIcon />
          </div>
        )}
      </div>
      <div className="chat_box_content">
        {listMessengers ? (
          listMessengers.map((item, index) => {
            return (
              <div ref={scroll} key={index}>
                <Messenger
                  lastMessenger={
                    listMessengers.length - 1 === index ? true : false
                  }
                  messenger={item}
                  page={params}
                  own={item.senderId === currentUser._id ? true : false}
                />
              </div>
            );
          })
        ) : (
          <span className="box_chat_content_no_messenger">
            Hãy nhập nội dung để trò chuyện
          </span>
        )}

        {showPicker && <Picker onSelect={handleEmoji} />}
      </div>
      <form onSubmit={handleSendMessenger} className="chat_bot_bottom">
        <ImageIcon htmlColor="green" />
        <div className="chat_bot_bottom_main">
          <input
            onChange={(e) => setMessenger(e.target.value)}
            type="text"
            placeholder="Aa"
            value={messenger}
            name="messenger"
          />
          <MoodIcon
            onClick={() => setShowPicker(!showPicker)}
            className="MoodIcon"
            htmlColor="yellow"
          />
        </div>
        {messenger && (
          <div onClick={handleSendMessenger} className="chat_bot_bottom_send">
            <Send />
          </div>
        )}
      </form>
    </div>
  );
}

export default ChatBox;
