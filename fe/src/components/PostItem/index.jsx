import React, { useEffect, useState } from "react";
import {
  BookmarkBorder,
  Bookmark,
  DeleteOutlineOutlined,
  EditOutlined,
  MoreHoriz,
  FavoriteBorder,
  Favorite,
  HideImageOutlined,
  FlagOutlined,
  CommentOutlined,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { messageFail, messageSuccess } from "../../actions/index";
import * as actions from "../../actions/post";
import ModalLoading from "../ModalLoading/index";
import BoxComment from "../BoxComment/index";
import PostEdit from "../PostEdit/index";
import formatDistance from "date-fns/formatDistance";
import viLocale from "date-fns/locale/vi";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import "./style.css";
function PostItem({ post, params }) {
  const timePost = formatDistance(new Date(post.createdAt), new Date(), {
    locale: viLocale,
  });
  const dispatch = useDispatch();
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const { socket } = useSelector((state) => state.socketIo);
  const { isModal } = useSelector((state) => state.post);
  const [isLike, setIsLike] = useState(post.like.includes(currentUser._id));
  const [countLike, setCountLike] = useState(post.like.length);
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [countComment, setCountComment] = useState(null);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [savePost, setSavePost] = useState(
    post.savePost.includes(currentUser._id)
  );
  const [report, setReport] = useState({
    content: "Bài viết sai sự thật",
    type: 1,
    reporter: currentUser._id,
    postId: post._id,
  });

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`${URI}/user/${post.userId}`);
      setUser(res.data.user);
    };
    getUser();
  }, [post.userId, URI]);
  useEffect(() => {
    setCountComment(comments.length);
  }, [comments]);

  const handleLike = async (value) => {
    try {
      const res = await axios.put(`${URI}/post/like/${post._id}`, {
        id: currentUser._id,
      });
      if (res.data.success && currentUser._id !== post.userId && !isLike) {
        const dataNotifi = {
          senderId: currentUser._id,
          receiverId: post.userId,
          postId: post._id,
          type: 1,
        };
        const result = await axios.post(`${URI}/notification`, dataNotifi);
        if (result.data.success) {
          socket?.emit("sendNotification", {
            senderId: currentUser._id,
            receiverId: post.userId,
            postId: post._id,
            type: 1,
            _id: result.data.newNotification._id,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLike(!isLike);
    setCountLike(isLike ? countLike - value : countLike + value);
  };
  const handleSave = async () => {
    try {
      await axios.put(`${URI}/post/save/${post._id}`, {
        id: currentUser._id,
      });
    } catch (error) {
      console.log(error);
    }
    setSavePost(!savePost);
  };
  const handleReport = async (value) => {
    const newReport = { ...report, content: value };
    try {
      const res = await axios.post(`${URI}/report`, newReport);
      if (res.data.success) {
        messageSuccess("Báo cáo bài viết thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    dispatch(actions.deletePostRequest());
    try {
      const res = await axios.delete(`${URI}/post/${post._id}`);
      if (res.data.success) {
        dispatch(actions.deletePostSuccess({ id: post._id }));
        messageSuccess(res.data.message);
      } else {
        messageFail(res.data.message);
      }
    } catch (error) {
      dispatch(actions.deletePostFail(error));
    }
  };
  useEffect(() => {
    const getListAllComment = async () => {
      try {
        const res = await axios.get(`${URI}/comment/${post._id}`);
        if (res.data.success) {
          setComments(res.data.comments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getListAllComment();
  }, [URI, post._id]);
  return (
    <div
      id={post._id}
      className={params ? "home_post_item_detail" : "home_post_item"}
    >
      <div className="post_item_wrapper">
        <div className="post_item_header">
          <div className="post_item_header_left">
            <Link to={`/profile/${post.userId}`}>
              <Avatar
               
                alt=""
                src={user && user.avatar}
              />
            </Link>
            <div className="post_item_header_left_main">
              <div className="post_item_header_left_name">{user.username}</div>
              <div className="post_item_header_left_date">{timePost}</div>
            </div>
          </div>
          <div className="post_item_header_right">
            <MoreHoriz htmlColor="grey" />
            <div className="post_item_setting">
              <ul className="post_item_setting_list">
                {post.userId === currentUser._id && (
                  <li
                    to="profile"
                    onClick={() => setShowEditPost(true)}
                    className="post_item_setting_item"
                  >
                    <EditOutlined />
                    <span className="post_item_setting_item_name">
                      Chỉnh sửa
                    </span>
                  </li>
                )}

                <li to="/save" className="post_item_setting_item">
                  <HideImageOutlined />
                  <span className="post_item_setting_item_name">
                    Ẩn bài viết
                  </span>
                </li>
                {currentUser._id !== post.userId && (
                  <li
                    to="setting"
                    className="post_item_setting_item post_item_report_active"
                  >
                    <FlagOutlined />
                    <span className="post_item_setting_item_name">
                      Báo cáo bài viết
                    </span>

                    <FormControl fullWidth className="form_report">
                      <InputLabel id="demo-simple-select-label">
                        Nội dung báo cáo
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={report.content}
                      >
                        <MenuItem
                          onClick={() => handleReport("Bài viết sai sự thật")}
                          value="Bài viết sai sự thật"
                        >
                          Bài viết sai sự thật
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleReport("Bài viết xúc phạm người khác")
                          }
                        >
                          Bài viết xúc phạm người khác
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleReport("Bài viết buôn bán hàng giả")
                          }
                        >
                          Bài viết buôn bán hàng giả
                        </MenuItem>
                        <MenuItem onClick={() => handleReport("Bài viết spam")}>
                          Bài viết spam
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </li>
                )}
                {(currentUser.isAdmin || currentUser._id === post.userId) && (
                  <>
                    <hr />
                    <li
                      onClick={handleDeletePost}
                      className="post_item_setting_item"
                    >
                      <DeleteOutlineOutlined />
                      <span className="post_item_setting_item_name">Xoá</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="post_item_main">
          <div className="post_item_content">
            <span>{post.content}</span>
          </div>
          {post.img && !params && (
            <Link to={`/post/${post._id}`}>
              <img src={post.img} alt="" className="post_item_main_img" />
            </Link>
          )}
        </div>
        <div className="post_item_footer">
          <div
            className={params ? "post_item_widget_detail" : "post_item_widget"}
          >
            <div
              onClick={() => handleLike(1)}
              className="post_item_widget_item"
            >
              {!isLike ? <FavoriteBorder /> : <Favorite htmlColor="#ed4956" />}
              <div className="post_item_widget_quantity">{`${countLike} thích`}</div>
            </div>
            <div
              className="post_item_widget_item  "
              onClick={() => setIsOpenComment(!isOpenComment)}
            >
              <CommentOutlined />
              <p className="post_item_widget_quantity">
                {countComment
                  ? `${countComment} bình luận `
                  : "Chưa có bình luận"}
              </p>
            </div>
            <div
              onClick={() => handleSave()}
              className="post_item_widget_item post_item_widget_item_save "
            >
              {!savePost ? (
                <BookmarkBorder />
              ) : (
                <Bookmark htmlColor="#2563eb" />
              )}
            </div>
          </div>
        </div>
        {(isOpenComment || params) && (
          <BoxComment
            comments={comments}
            postUserId={post.userId}
            postId={post._id}
            setUpCountComment={() => setCountComment(countComment + 1)}
            setDownCountComment={() => setCountComment(countComment - 1)}
          ></BoxComment>
        )}
      </div>
      {isModal && <ModalLoading />}
      {showEditPost && (
        <PostEdit closePostEdit={() => setShowEditPost(false)} result={post} />
      )}
    </div>
  );
}

export default PostItem;
