import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import './style.css'
function NoChatBox() {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [listMess, setListMess] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0)
}, []);
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
  }, [currentUser, URI]);
  useEffect(() => {
    listMess[0]&&navigate(`/messenger/${listMess[0]}`)
  },[listMess,navigate])
  return (
    <div className='no_chat_box_page'>
      {(!listMess[0])&&<span>Không có cuộc trò chuyện nào </span>}
      <Link to='/' className=' submit_button no_chat_box_page_link '> Quay về trang chủ</Link>
    </div>
  );
}

export default NoChatBox;
