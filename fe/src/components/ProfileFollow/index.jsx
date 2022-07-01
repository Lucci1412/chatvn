import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "./style.css";

function ProfileFollow({ userId }) {
  const URI = process.env.REACT_APP_URI;
  const [user, setUser] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const [follow, setFollow] = useState(currentUser.following.includes(userId));



  useEffect(() => {
    const getUser = async () => {
      try {
        const res = userId && (await axios.get(`${URI}/user/${userId}`));
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [userId, URI]);

  const handleFollow = async () => {
    try {
      const res = await axios.put(`${URI}/user/follow/${userId}`, {
        id: currentUser._id,
      });
      if (res.data.success) {
        setFollow(!follow);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
      <div className="profile_follow_item">
        <Link className="profile_follow_item_link" to={`/profile/${userId}`}>
          <img src={user && user.avatar} alt="" />
        </Link>
        <Link className="profile_follow_item_link" to={`/profile/${userId}`}>
          {" "}
          <span>{user && user.username}</span>
        </Link>
        {user && user._id !== currentUser._id && (
          <button onClick={handleFollow} className="submit_button">
            {follow ? "Đã theo dõi" : "Theo dõi"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileFollow;
