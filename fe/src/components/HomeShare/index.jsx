import React, { useState,useEffect} from "react";
import { VideoCall, Image, Mood, Close } from "@mui/icons-material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/post";
import { delay } from "../../actions/index.jsx";
import ModalLoading from "../ModalLoading/index";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import Avatar from '@mui/material/Avatar';
import "./style.css";
function HomeShare() {
  const URI = process.env.REACT_APP_URI;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isLoading, isModal } = useSelector((state) => state.post);
  const [showPicker,setShowPicker]=useState(false)
  const [rows,setRows] =useState(2)
  const [post, setPost] = useState({
    content: "",
    file: null,
  });
  useEffect(() => {
    if(showPicker){
      setRows(24)
    }
    else{
      (post.content.length>60) ? setRows(6):setRows(2)
    }

  },[showPicker,post.content.length])
  const handleEmoji = ( emoji) => {
    setPost({ ...post, content: post.content +emoji.native })
  };
  const handleCreatePost = async (e) => {
    e.preventDefault();
    dispatch(actions.createPostRequest());
    if (post.file) {
      const data = new FormData();
      data.append("content", post.content);
      data.append("userId", user._id);
      data.append("file", post.file);
      try {
        const res = await axios.post(`${URI}/post`, data);
        if (res.data.success) {
          setShowPicker(false)
          setPost({ content: "", file: null });
          dispatch(actions.createPostSuccess(res.data.newPost));
        }
      } catch (error) {
        dispatch(actions.createPostFail(error));
      }
    } else {
      try {
        const res = await axios.post(`${URI}/post`, {
          userId: user._id,
          content: post.content,
        });
        if (res.data.success) {
          delay(1000);
          setShowPicker(false)
          setPost({ content: "", file: null });
          dispatch(actions.createPostSuccess(res.data.newPost));
        }
      } catch (error) {
        dispatch(actions.createPostFail(error));
      }
    }
  };

  const handleCloseFile = () => {
    setPost({ ...post, file: null });
  };

  return (
    <div className="home_share">
      <div className="home_share_nav"  style={{ padding: "10px" }}>
      <Avatar alt="" src={user && user.avatar} />
      </div>
      <form className="home_share_form">
        <div className="home_share_container">
          <div className="home_share_wrapper">
            <textarea
              type="text"
              name="content"
              autoComplete="off"
              className="home_share_textarea"
              placeholder="Bạn đang nghĩ gì ..."
              value={post.content}
              rows={rows}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
            {post.file && (
              <div className="home_share_container_img">
                <img src={URL.createObjectURL(post.file)} alt="" />
                <div className="home_share_img_icon">
                  <Close onClick={handleCloseFile} />
                </div>
              </div>
            )}
          {showPicker&& <Picker className="picker_home_share" onClick={handleEmoji}/>}
          </div>
        </div>
        <hr />
        <div className="home_share_widget">
          <div className="home_share_widget_list">
            <label htmlFor="file" className="home_share_widget_item">
              <Image htmlColor="green" />
              <span>Ảnh</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => setPost({ ...post, file: e.target.files[0] })}
              />
            </label>
            <div className="home_share_widget_item home_share_widget_item_video">
              <VideoCall htmlColor="red" />
              <span>Video</span>
            </div>
            <div onClick={()=>setShowPicker(!showPicker)} className="home_share_widget_item home_share_widget_item_mood ">
              <Mood htmlColor="yellow" />
              <span>Cảm xúc</span>
            </div>
          </div>
          <button
            onClick={handleCreatePost}
            disabled={!post.file && !post.content ? true : false}
            className="submit_button home_share_button"
          >
            {isLoading ? (
              <CircularProgress
                className="submit_login_icon"
                size="15px"
                color="inherit"
              />
            ) : (
              "Đăng"
            )}
          </button>
        </div>
      </form>
      {isModal && <ModalLoading />}
    </div>
  );
}

export default HomeShare;
