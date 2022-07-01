import React, { useState, useEffect } from "react";
import Comment from "../Comment/index";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import axios from "axios";
import "./style.css";
function BoxComment({
  postUserId,
  comments,
  postId,
  setUpCountComment,
  setDownCountComment,
}) {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const { socket } = useSelector((state) => state.socketIo);
  const [listComments, setListComments] = useState([]);
  const [data, setData] = useState({
    senderId: currentUser._id,
    text: "",
    postId: postId,
  });
  useEffect(() => {
    setListComments(comments);
  }, [comments]);

  const handleSendComment = async () => {
    try {
      if (data.text) {
        const res = await axios.post(`${URI}/comment`, data);
        if (res.data.success) {
          setListComments([...listComments, res.data.newComment]);
          setData({ senderId: currentUser._id, text: "", postId: postId });
          setUpCountComment();
          if (postUserId !== currentUser._id) {
            const dataNotifi = {
              senderId: currentUser._id,
              receiverId: postUserId,
              postId: postId,
              type: 2,
            };
            const result = await axios.post(`${URI}/notification`, dataNotifi);
            if (result.data.success) {
              socket?.emit("sendNotification", {
                senderId: currentUser._id,
                receiverId: postUserId,
                postId: postId,
                type: 2,
                _id:result.data.newNotification._id
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = (id) => {
    const newList = [...listComments].filter((item) => item._id !== id);
    if (newList[0]) {
      setListComments(newList);
      setDownCountComment();
    } else {
      setListComments([]);
    }
  };
  const updateComment = (data) => {
    const newList = [
      data,
      ...listComments.filter((item) => item._id !== data._id),
    ];
    setListComments(newList);
  };

  return (
    <div className="box_comment">
      <div className="box_comment_send">
        <img src={currentUser.avatar} className="avatar" alt="" />
        <div className="box_comment_send_main">
          <input
            value={data.text}
            type="text"
            placeholder="Viết bình luận"
            onChange={(e) => setData({ ...data, text: e.target.value })}
          />
          <SendIcon
            onClick={handleSendComment}
            className="box_comment_send_icon"
          />
        </div>
      </div>
      {listComments &&
        listComments.map((item, index) => {
          return (
            <Comment
              key={index}
              comment={item}
              deleteCallback={deleteComment}
              updateCallback={updateComment}
            />
          );
        })}
    </div>
  );
}

export default BoxComment;
