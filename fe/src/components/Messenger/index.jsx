import React,{useState,useEffect} from "react";
import "./style.css";
import axios from "axios"

import formatDistance from "date-fns/formatDistance";
import viLocale from "date-fns/locale/vi";
function Messenger({ own, page,messenger,lastMessenger }) {
  const timeMessenger = messenger.createdAt&&formatDistance(new Date(messenger.createdAt), new Date(), {
    locale: viLocale,
  });
 

  const URI = process.env.REACT_APP_URI
  const [user,setUser]=useState([])
  useEffect(() => {
    const getUser=async()=>{
      try {
          const res=await axios.get(`${URI}/user/${messenger.senderId}`)
        setUser(res.data.user)
      } catch (error) {
        console.log(error);
      }
    }
    getUser()
  }, [messenger.senderId,URI])

  return (
    <div className={own ? "messenger own" : "messenger"}>
      <div className="messenger_top">
        {!own && (
          <img
            src={user.avatar}
            alt=""
          />
        )}
        <p className={page ? "messenger_top_text_page" : "messenger_top_text"}>
          {messenger.text}
        </p>
      </div>
      <span className="messenger_time">
      {lastMessenger&&timeMessenger}
        
      </span>
    </div>
  );
}

export default Messenger;
