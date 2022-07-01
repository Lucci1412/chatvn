import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector} from "react-redux";
import {Link} from "react-router-dom"
import "./style.css";
function CategorySavePost({ post }) {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState([]);
  const [savePost, setSavePost]=useState(post.savePost.includes(currentUser._id))
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${URI}/user/${post.userId}`);
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [post, URI]);
  const handleSavePost = async () => {
    try {
      await axios.put(`${URI}/post/save/${post._id}`, {
        id: currentUser._id,
      });
    } catch (error) {
      console.log(error);
    }
    setSavePost(!savePost);
  };
  return (
    <div className="category_save_post_item">
      <img src={post.img} alt="" />
      <div className="category_save_post_main">
        <Link className="category_save_post_main_link" to={`/post/${post._id}`}> <h3>{post.content}</h3></Link>
        <span>
          Bài viết đã lưu từ
          <h3>{user.username}</h3>
        </span>
        <button className="submit_button" onClick={handleSavePost}>{savePost?'Đã lưu':"Lưu bài viết"}</button>
      </div>
    </div>
  );
}

export default CategorySavePost;
