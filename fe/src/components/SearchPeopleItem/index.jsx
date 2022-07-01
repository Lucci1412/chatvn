import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import * as action from '../../actions/auth'
import axios from "axios";
import "./style.css";
function SearchPeopleItem({ user }) {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [follow, setFollow] = useState(
    currentUser.following.includes(user._id)
  );
  const handleFollow = async () => {
    try {
      const res = await axios.put(`${URI}/user/follow/${user._id}`, {
        id: currentUser._id,
      });
      if (res.data.success) {
        setFollow(!follow)
        dispatch(action.follow(res.data.follow))
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div to={`/profile/${user._id}`} className="search_people_item">
      <div className="search_people_item">
        <Link to={`/profile/${user._id}`} className="link ">
          <img src={user.avatar} alt="" className="avatar link " />
        </Link>
        <div className="search_people_item_info">
          <Link to={`/profile/${user._id}`} className="link">
            <h4>{user.username}</h4>
          </Link>
          {user?.following.length > 2 && (
            <span>{`${user?.following.length} người theo dõi`}</span>
          )}
        </div>
        <button onClick={handleFollow} className="submit_button">
          {follow ? "Đã theo dõi" : "Theo dõi"}
        </button>
      </div>
    </div>
  );
}

export default SearchPeopleItem;
