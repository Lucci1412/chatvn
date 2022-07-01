import React from 'react'
import {ChatBubbleOutlineOutlined,SearchOutlined,LanguageOutlined,NotificationsNoneOutlined} from "@mui/icons-material";
import Avatar from '@mui/material/Avatar';
import {useSelector} from 'react-redux'
import './style.css'
const Navbar = () => {
  const {user}= useSelector((state) => state.auth);
  
  return (
    <div className="navbar">
      <div className="navbar_wrapper">
        <div className="navbar_search">
          <input type="text" placeholder="Tìm kiếm..." />
          <SearchOutlined />
        </div>
        <div className="navbar_items">
          <div className="navbar_item">
            <LanguageOutlined className="navbar_icon" />
            Eng
          </div>
          
          <div className="navbar_item">
            <NotificationsNoneOutlined className="navbar_icon" />
            <div className="navbar_counter">1</div>
          </div>
          <div className="navbar_item">
            <ChatBubbleOutlineOutlined className="navbar_icon" />
            <div className="navbar_counter">2</div>
          </div>
          <div className="navbar_item">
          <Avatar alt="" src={user&& user.avatar} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;