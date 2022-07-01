import React,{useState} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios'
import './style.css'
function ConnectPeople({friend}) {
  const URI = process.env.REACT_APP_URI;
  const currentUser = useSelector((state) => state.auth.user);
  const [follow,setFollow]=useState(currentUser.following.includes(friend._id))
  const handleFollow=async ()=>{
    try {
      const res=await axios.put(`${URI}/user/follow/${friend._id}`,{id:currentUser._id})
      if(res.data.success){
        setFollow(!follow)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="connect_people_item">
            <img src={friend&&friend.avatar} className="avatar" alt="" />
            <div className="connect_people_info">
                <h4>{friend&&friend.username}</h4>
                <div className="connect_people_info_widget">
                  <span> {`Người theo dõi ${friend&&friend.followers.length}`}</span>
                </div>
            </div>
            <button className="submit_button connect_people_item_button" onClick={handleFollow}>{follow? 'Đã theo dõi':'Theo dõi'}</button>
        </div>
  )
}

export default ConnectPeople