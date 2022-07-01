import React, { useEffect, useState } from "react";
import PostItem from "../PostItem/index";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/post";
import CircularProgress from "@mui/material/CircularProgress";
import { delay } from "../../actions/index";
import "./style.css";
function PostList({ params, search }) {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const URI = process.env.REACT_APP_URI;
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        if (search) {
          await delay(500);
          setLoading(false);
          dispatch(actions.getPosts(search));
        } else {
          const res = params
            ? await axios.get(`${URI}/post/profile/${params}`)
            : await axios.get(`${URI}/post/timeline/${user._id}`);

          const data = res.data.posts.sort((post1, post2) => {
            return new Date(post2.createdAt) - new Date(post1.createdAt);
          });
          await delay(500);
          setLoading(false);
          dispatch(actions.getPosts(data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllPosts();
  }, [params, user, dispatch, URI, search]);
  return (
    <>
      {loading ? (
        <div className="material_loading_wrapper post_list_loading ">
          <CircularProgress className="material_loading" />
        </div>
      ) : (
        <div className="home_post_list">
          {posts &&
            posts.map((post) => <PostItem key={post._id} post={post} />)}
        </div>
      )}
    </>
  );
}

export default PostList;
