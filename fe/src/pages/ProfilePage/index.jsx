import React,{useEffect, useState} from 'react'
import ProfileCategory from '../../components/ProfileCategory'
import ProfileInfo from '../../components/ProfileInfo'
import { useParams} from "react-router-dom";
import axios from 'axios'
import './style.css'
function ProfilePage() {
  const URI = process.env.REACT_APP_URI
  const params = useParams().id;
  const [user,setUser] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0)
}, []);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res =await axios.get(`${URI}/user/${params}`)
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [params, URI]);
  
  return (
    <div className="profile_page">
      <ProfileInfo user={user} params={params}/>
      <ProfileCategory user={user} params={params}/>
    </div>
  )
}

export default ProfilePage