import React, { useState, useEffect } from "react";
import { MoreHoriz } from "@mui/icons-material";
import { useSelector} from "react-redux";
import axios from "axios";
import "./style.css";
function Comment({ comment,deleteCallback,updateCallback }) {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState([]);
  const [data, setData] = useState(comment.text);
  const [openUpdate, setOpenUpdate] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${URI}/user/${comment.senderId}`);
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment.senderId, URI]);
  const handleDeleteComment = async () => {
    try {
      const res = await axios.delete(`${URI}/comment/${comment._id}`);
      if(res.data.success){
        deleteCallback(comment._id)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenUpdate=()=>{
    setOpenUpdate(true);
  }
  const handleSubmitUpdateComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${URI}/comment/${comment._id}`,{text:data});
      if(res.data.success){
        updateCallback(res.data.comment)
        setOpenUpdate(false)
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="comment">
      <img src={user && user.avatar} className="avatar" alt="" />
      <div className="comment_main">
        {!openUpdate && <div className="comment_content">{comment.text}</div>}
        {openUpdate && (
          <form className="comment_form" onSubmit={handleSubmitUpdateComment}>
            <input
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="comment_input_update"
            />
          </form>
        )}
        {(currentUser._id === user._id && !openUpdate) && (
          <div className="comment_content_icon">
            <MoreHoriz htmlColor="grey" />
            <div className="comment_widget">
              <span
                className="comment_widget_item"
                onClick={handleOpenUpdate}
              >
                Sửa bình luận
              </span>
              <span className="comment_widget_item" onClick={handleDeleteComment}>Xoá bình luận</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
