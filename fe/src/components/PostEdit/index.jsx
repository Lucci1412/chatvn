import React, { useState, useEffect } from "react";
import { Image, Mood, Close } from "@mui/icons-material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import * as actions from "../../actions/post";
import { Picker } from "emoji-mart";

import ModalLoading from "../ModalLoading/index";
import "emoji-mart/css/emoji-mart.css";
import "./style.css";
function PostEdit({ result, closePostEdit }) {
  const URI = process.env.REACT_APP_URI;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showResultImg, setShowResultImg] = useState(
    result?.img ? true : false
  );
  const [rows, setRows] = useState(2);
  const [post, setPost] = useState({
    content: result.content,
    file: null,
  });
  useEffect(() => {
    if (showPicker) {
      setRows(24);
    } else {
      post.content.length > 60 ? setRows(6) : setRows(2);
    }
  }, [showPicker, post.content.length]);

  const handleEmoji = (emoji) => {
    setPost({ ...post, content: post.content + emoji.native });
  };
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (showResultImg) {
        const res = await axios.put(`${URI}/post/${result._id}`, {
          content: post.content,
          resultImg: "true",
        });
        if (res.data.success) {
          setIsLoading(false);
          setShowPicker(false);
          setPost({ content: "", file: null });
          dispatch(actions.updatePostSuccess(res.data.post));
          closePostEdit();
        }
      } else {
        if (post.file) {
          const data = new FormData();
          data.append("content", post.content);
          data.append("file", post.file);
          data.append("resultImg", false);
          const res = await axios.put(`${URI}/post/${result._id}`, data);
          if (res.data.success) {
            setIsLoading(false);
            setShowPicker(false);
            setPost({ content: "", file: null });
            dispatch(actions.updatePostSuccess(res.data.post));
            closePostEdit();
          }
        } else {
          const res = await axios.put(`${URI}/post/${result._id}`, {
            content: post.content,
            resultImg: "false",
          });
          if (res.data.success) {
            setIsLoading(false);
            setShowPicker(false);
            setPost({ content: "", file: null });
            dispatch(actions.updatePostSuccess(res.data.post));
            closePostEdit();
          }
        }
      }
    } catch (error) {
      dispatch(actions.updatePostFail(error));
    }
  };

  const handleCloseFile = () => {
    setPost({ ...post, file: null });
  };
  const handleClosePostEdit = () => {
    closePostEdit();
  };
  return (
    <div className="post_edit">
      <div className="post_edit_wrapper">
        <div onClick={handleClosePostEdit} className="post_edit_nav">
          <h4>Cập nhật bài viết</h4>
          <div className="post_edit_icon_close">
            <Close></Close>
          </div>
        </div>
        <form onSubmit={handleUpdatePost} className="home_share_form">
          <div className="home_share_container">
            <div className="home_share_wrapper">
              <textarea
                type="text"
                name="content"
                autoComplete="off"
                className="home_share_textarea"
                value={post.content}
                rows={rows}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
              />
              {showResultImg && result.img && (
                <div className="home_share_container_img">
                  <img src={result.img} alt="" />
                  <div className="home_share_img_icon">
                    <Close onClick={() => setShowResultImg(false)} />
                  </div>
                </div>
              )}
              {post.file && (
                <div className="home_share_container_img">
                  <img src={URL.createObjectURL(post.file)} alt="" />
                  <div className="home_share_img_icon">
                    <Close onClick={handleCloseFile} />
                  </div>
                </div>
              )}
              {showPicker && (
                <Picker className="picker_home_share" onClick={handleEmoji} />
              )}
            </div>
          </div>
          <hr />
        </form>
        <div className="home_share_widget post_edit_widget">
          <div className="home_share_widget_list">
            <label htmlFor="fileEdit" className="home_share_widget_item">
              <Image htmlColor="green" />
              <span>Ảnh</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="fileEdit"
                accept="image/*"
                onChange={(e) => setPost({ ...post, file: e.target.files[0] })}
              />
            </label>
            <div
              onClick={() => setShowPicker(!showPicker)}
              className="home_share_widget_item home_share_widget_item_mood "
            >
              <Mood htmlColor="yellow" />
              <span>Cảm xúc</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleUpdatePost}
          disabled={(((post?.content.trim().length===0)&&(post.file===null) &&(!showResultImg))||((post?.content===result?.content )&&showResultImg)) ? true:false}
          className="post_edit_button"
        >
          {isLoading ? (
            <CircularProgress
              className="submit_login_icon"
              size="15px"
              color="inherit"
            />
          ) : (
            "Cập nhật bài viết"
          )}
        </button>
      </div>
      {isLoading && <ModalLoading />}
    </div>
  );
}

export default PostEdit;
