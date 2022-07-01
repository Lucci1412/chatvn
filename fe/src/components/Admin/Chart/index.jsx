import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Chart() {
  const URI = process.env.REACT_APP_URI;
  const [data, setData] = useState([]);
  const [post, setPost] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const newData = [
      {
        _id: 1,
        month: "Tháng 1",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 2,
        month: "Tháng 2",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 3,
        month: "Tháng 3",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 4,
        month: "Tháng 4",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 5,
        month: "Tháng 5",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 6,
        month: "Tháng 6",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 7,
        month: "Tháng 7",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 8,
        month: "Tháng 8",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 9,
        month: "Tháng 9",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 10,
        month: "Tháng 10",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 11,
        month: "Tháng 11",
        newUsers: 0,
        newPosts: 0,
      },
      {
        _id: 12,
        month: "Tháng 12",
        newUsers: 0,
        newPosts: 0,
      },
    ];
    for (let itemA of newData) {
      for (let itemB of post) {
        if (itemA._id === itemB._id) {
          itemA.newPosts = itemB.newPosts;
        }
      }
      for (let itemC of user) {
        if (itemA._id === itemC._id) {
          itemA.newUsers = itemC.newUsers;
        }
      }
    }
    setData(newData);
  }, [post, user]);
  useEffect(() => {
    const getPostStats = async () => {
      const resultPost = await axios.get(`${URI}/post/stats/2022`);
      const resultUser = await axios.get(`${URI}/user/stats/2022`);
      setPost(resultPost.data.postStats);
      setUser(resultUser.data.userStats);
    };
    getPostStats();
  }, [URI]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={300}
        data={data && data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="newUsers"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="newPosts" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
