import React, { useEffect,useState } from "react";
import ContactMessengerItem from "../ContactMessengerItem/index";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import "./style.css";
function ContactMessengerList({ listMess }) {
  const [listMessengers,setListMessengers]=useState([])
  useEffect(() => {
    
      setListMessengers([...listMess])
  }, [listMess]);
  return (
    <>
      <ul className="contact_messenger_list">
        {listMessengers[0] ? (
          listMessengers.map((userId, index) => {
            return <ContactMessengerItem key={index} userId={userId} />;
          })
        ) : (
          <div className="list_mess_empty">
            {" "}
            Chưa có liên hệ nào <MoodBadIcon />{" "}
          </div>
        )}
      </ul>
      <ul className="contact_messenger_list_mobile">
        <div className="contact_messenger_list_mobile_wrapper">
          {listMessengers[0] ? (
            listMessengers.map((userId, index) => {
              return <ContactMessengerItem key={index} userId={userId} />;
            })
          ) : (
            <div className="list_mess_empty">
              {" "}
              Chưa có liên hệ nào <MoodBadIcon />{" "}
            </div>
          )}
        </div>
      </ul>
    </>
  );
}

export default ContactMessengerList;
