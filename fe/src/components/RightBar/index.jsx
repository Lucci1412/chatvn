import React,{useState,useEffect} from "react";
import ContactMessengerList from "../ContactMessengerList";
import Notification from "../Notification/index"
import SearchForm from '../SearchForm/index'
import {useSelector} from 'react-redux'
import axios from "axios";
import "./style.css";
function RightBar() {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [listMess, setListMess] = useState([]);
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
  return (
    <div className="right_bar">
      {/* right bar notifiation */}
      <SearchForm/>
      <Notification />
      {/* Right bar list friend */}
      <div className="right_bar_contact">
        <h4 className="right_bar_contact_title">Người liên hệ </h4>
        <ContactMessengerList listMess={listMess}/>
        </div>
    </div>
  );
}
export default RightBar;
