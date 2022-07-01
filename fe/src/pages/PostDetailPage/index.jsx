import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import PostItem from "../../components/PostItem";
import axios from "axios";
import "./style.css";
function PostDetailPage() {
  const URI = process.env.REACT_APP_URI;
  const navigate = useNavigate();
  const params = useParams().id;
  const [post, setPost] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0)
}, []);
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`${URI}/post/${params}`);
        if (res.data.success) {
          setPost(res.data.post);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [params, URI]);
  return (
    <div className="post_detail_page">
      <div className="post_detail_img">
        <img src={post && post.img} alt="" />
        <div onClick={() => navigate(-1)} className="post_detail_img_icon">
          <Close />
        </div>
      </div>

      <div className="post_detail">
        {post && <PostItem post={post} params={params}></PostItem>}
      </div>
     
    </div>
  );
}

export default PostDetailPage;
