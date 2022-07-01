import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RightBar from "../../components/RightBar/index";
import SearchPeopleItem from "../../components/SearchPeopleItem/index";
import PostList from "../../components/PostList/index";
import CircularProgress from "@mui/material/CircularProgress";
import { delay } from "../../actions/index";
import axios from "axios";
import "./style.css";
function SearchPage() {
  const { search } = useLocation();
  const URI = process.env.REACT_APP_URI;
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [noSearch, setNoSearch] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0)
}, []);
  useEffect(() => {
    const getDataSearch = async () => {
      const isKey = search.slice(0, 5);
      const keyword = search.slice(5, search.length);
      try {
        if (isKey === "?key=" && keyword.length > 0) {
          const res = await axios.get(`${URI}/user/search/${keyword}`);
          if (res.data.success) {
            await delay(500);
            const { resultsPost, resultsUser } = res.data;
            res.data.resultsUser.length < 10
              ? setShowMore(false)
              : setShowMore(true);
            setLoading(false);
            if (resultsUser.length === 0 && resultsPost.length === 0) {
              setNoSearch(true);
            } else {
              setNoSearch(false);
              setPost(resultsPost);
              setPeople(resultsUser);
            }
          }
        } else {
          console.log("false");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDataSearch();
  }, [search, URI]);
  return (
    <div className="search_page">
      <div className="search_page_container">
        {loading && (
          <div className="material_loading_wrapper">
            <CircularProgress className="material_loading" />
          </div>
        )}
        {noSearch ? (
          <div className="no_search_page">Không tìm thấy kết quả</div>
        ) : (
          <>
            {people.length > 0 && (
              <div className="search_page_list">
                <h3>Mọi người</h3>
                {people.map((user) => (
                  <SearchPeopleItem
                    user={user}
                    key={user._id}
                  ></SearchPeopleItem>
                ))}
                {showMore && <div className="btn_show_more">Xem thêm</div>}
              </div>
            )}
            <div className="search_page_list_post"></div>
            <PostList search={post}></PostList>
          </>
        )}
      </div>
      <RightBar></RightBar>
    </div>
  );
}

export default SearchPage;
