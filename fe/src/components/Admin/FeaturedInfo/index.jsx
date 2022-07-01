import React, { useEffect, useState } from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import axios from "axios";
import "./style.css";

export default function FeaturedInfo() {
  const [post, setPost] = useState([]);
  const [user, setUser] = useState([]);
  const [report, setReport] = useState([]);
  const [arrowPost, setArrowPost] = useState(false);
  const [growPost, setGrowPost] = useState("");
  const [arrowUser, setArrowUser] = useState(false);
  const [growUser, setGrowUser] = useState("");
  const [arrowReport, setArrowReport] = useState(false);
  const [growReport, setGrowReport] = useState("");

  const URI = process.env.REACT_APP_URI;
  useEffect(() => {
    const getPostStats = async () => {
      const resultPost = await axios.get(`${URI}/post/stats/2022`);
      const resultUser = await axios.get(`${URI}/user/stats/2022`);
      const resultReport = await axios.get(`${URI}/report/stats/2022`);

      setPost(resultPost.data.postStats);
      setUser(resultUser.data.userStats);
      setReport(resultUser.data.reportStats);
      //post
      const a = resultPost.data.postStats.sort((a, b) => a._id - b._id);
      const monthPostCurrent = a[a.length - 1].newPosts;
      const monthPostPrev = a[a.length - 2].newPosts;
      monthPostCurrent < monthPostPrev
        ? setArrowPost(false)
        : setArrowPost(true);
      setGrowPost(
        (((monthPostCurrent - monthPostPrev) * 100) / monthPostPrev).toFixed(1)
      );

      //user
      const b = resultUser.data.userStats.sort((a, b) => a._id - b._id);
      const monthUserCurrent = b[b.length - 1].newUsers;
      const monthUserPrev = b[b.length - 2].newUsers;
      monthUserCurrent < monthUserPrev
        ? setArrowUser(false)
        : setArrowUser(true);
      setGrowUser(
        (((monthUserCurrent - monthUserPrev) * 100) / monthUserPrev).toFixed(1)
      );


//report
const c = resultReport.data.reportStats.sort((a, c) => a._id - c._id);
const monthReportCurrent = c[c.length - 1].newReports;
const monthReportPrev = c[c.length - 2].newReports;
monthReportCurrent < monthReportPrev
  ? setArrowReport(false)
  : setArrowReport(true);
setGrowReport(
  (((monthReportCurrent - monthReportPrev) * 100) / monthReportPrev).toFixed(1)
);


    };
    getPostStats();
  }, [URI]);
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Người dùng mới</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{user && user.length}</span>
          <span className="featuredMoneyRate">
            {arrowUser ? "+" : "-"}
            {`${growUser}%`}
            {arrowUser ? (
              <ArrowUpward className="featuredIcon" />
            ) : (
              <ArrowDownward className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">So với tháng trước</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Bài viết mới</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{post && post.length}</span>
          <span className="featuredMoneyRate">
            {arrowPost ? "+" : "-"}
            {`${growPost}%`}
            {arrowPost ? (
              <ArrowUpward className="featuredIcon" />
            ) : (
              <ArrowDownward className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">So với tháng trước</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Tổng vi phạm</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{report&&report.length}</span>
          <span className="featuredMoneyRate">
            {arrowReport ? "+" : "-"}
            {`${growReport}%`}
            {arrowReport ? (
              <ArrowUpward className="featuredIcon" />
            ) : (
              <ArrowDownward className="featuredIcon negative" />
            )}
          </span>
        </div>
        <span className="featuredSub">So với tháng trước</span>
      </div>
    </div>
  );
}
