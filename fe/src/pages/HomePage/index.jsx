import React, { useEffect } from "react";
import HomeShare from "../../components/HomeShare/index";
import PostList from "../../components/PostList/index";
import RightBar from "../../components/RightBar/index";
import SearchForm from "../../components/SearchForm/index";
import "./style.css";
function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  //  const clear= setTimeout(window.location.reload(), 1000);
    // return () => {
    //   // cancel the subscription
    //   clear
  // };
  }, []);
  return (
    <div className="home_page">
      <div className="home_page_feed">
        <div className="home_page_feed_wrapper">
          <div className="home_page_search">
            <SearchForm></SearchForm>
          </div>
          <HomeShare />
          <PostList />
        </div>
      </div>
      <RightBar />
    </div>
  );
}

export default HomePage;
