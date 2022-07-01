import React, { useState, useEffect } from "react";
import Report from "../../../components/Admin/Report";
import axios from "axios";
import "./style.css";
function ReportPage() {
  const URI = process.env.REACT_APP_URI;
  const [reportUser, setReportUser] = useState([]);
  const [reportPost, setReportPost] = useState([]);
  useEffect(() => {
    const getReport = async () => {
      const resUser = await axios.get(`${URI}/report/${2}`);
      if (resUser.data.success) {
        setReportUser(resUser.data.reports);
      }
      const resPost = await axios.get(`${URI}/report/${1}`);
      if (resPost.data.success) {
        setReportPost(resPost.data.reports);
      }
    };
    getReport();
  }, [URI]);
const deleteReport=(value)=>{
  setReportPost(reportPost.filter(item=>item._id!==value));
  setReportUser(reportUser.filter(item=>item._id!==value));
}
  return (
    <div style={{ width: "90%", margin: "50px 5% 0 5% " }}>
      {reportUser.length !== 0 && (
        <h3 style={{ margin: "30px 0", fontSize: "25px" }}>Report User</h3>
      )}
      <div className="row">
        {reportUser &&
          reportUser.map((item) => {
            return <div key={item._id} className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <Report deleteReport={(id)=>deleteReport(id)} report={item} />;
            </div>;
          })}
      </div>

      {reportPost.length !== 0 && (
        <h3 style={{ margin: "30px 0", fontSize: "25px" }}> Report Post</h3>
      )}
      <div className="row">
        {reportPost &&
          reportPost.map((item) => {
            return <div key={item._id} className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <Report deleteReport={(id)=>deleteReport(id)} report={item} />;
            </div>;
          })}
      </div>
    </div>
  );
}

export default ReportPage;
