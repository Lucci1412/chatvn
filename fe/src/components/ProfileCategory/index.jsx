import React, { useState, useEffect } from "react";
import PostList from "../PostList";
import ProfileFollow from "../ProfileFollow/index";
import CategorySavePost from "../CategorySavePost/index";
import { useSelector } from "react-redux";
import axios from "axios";
import "./style.css";
function ProfileCategory({ user, params }) {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [category, setCategory] = useState([]);
  const [savePost, setSavePost] = useState([]);
  const tabs = document.querySelectorAll(".profile_tab_item");
  const panes = document.querySelectorAll(".profile_pane_item");
  useEffect(() => {
    const getCategory = async () => {
      try {
        const res =
          params && (await axios.get(`${URI}/user/category/${params}`));
        if (res.data.success) {
          setCategory(res.data.category);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCategory();
  }, [params, URI]);
  useEffect(() => {
    params && setFollowing(user.following);
    params && setFollowers(user.followers);
  }, [params, user]);
  useEffect(() => {
    const getSavePost = async () => {
      try {
        const res =
          params && (await axios.get(`${URI}/post/savepost/${params}`));
        if (res.data.success) {
          setSavePost(res.data.savePost);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSavePost();
  }, [params, URI]);

  tabs.forEach((tab, index) => {
    const pane = panes[index];
    tab.onclick = function () {
      document
        .querySelector(".profile_tab_item_active")
        .classList.remove("profile_tab_item_active");
      document
        .querySelector(".profile_pane_item_active")
        .classList.remove("profile_pane_item_active");
      tab.classList.add("profile_tab_item_active");
      pane.classList.add("profile_pane_item_active");
    };
  });

  return (
    <div className="profile_category">
      <div className="profile_tab">
        <div className="profile_tab_item profile_tab_item_active">
          Bài viết
          <span>{category && category.postUser}</span>
        </div>
        <div className="profile_tab_item">
          Người theo dõi
          <span>{category && category.followers}</span>
        </div>
        <div className="profile_tab_item">
          Đang theo dõi
          <span>{category && category.following}</span>
        </div>
        {currentUser._id === params && (
          <div className="profile_tab_item">
            Đã lưu
            <span>{category && category.savePost}</span>
          </div>
        )}
      </div>
      <div className="profile_pane">
        <div className="profile_pane_item  profile_pane_item_active">
          <PostList params={params}></PostList>
        </div>
        <div className="profile_pane_item  ">
          <div className="profile_category_follow">
            <div className="row">
            {(followers&&followers[0]) ? (
                followers.map((user, index) => {
                  return (
                    <ProfileFollow userId={user} key={index}></ProfileFollow>
                  );
                })
              ) : (
                <div className="profile_category_empty">
                  Chưa có người theo dõi
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="profile_pane_item">
          <div className="profile_category_follow">
            <div className="row">
              {(following&&following[0]) ? (
                following.map((user, index) => {
                  return (
                    <ProfileFollow userId={user} key={index}></ProfileFollow>
                  );
                })
              ) : (
                <div className="profile_category_empty">
                  Chưa theo dõi người nào  
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="profile_pane_item  ">
          <div className="profile_category_save_post">
            {savePost.length===0 ? (
              <div className="profile_category_empty">
                Chưa có bài viết đã lưu
              </div>
            ) : (
              savePost.map((item, index) => {
                return (
                  <CategorySavePost key={index} post={item}></CategorySavePost>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCategory;
