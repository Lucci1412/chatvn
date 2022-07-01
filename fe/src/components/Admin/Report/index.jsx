import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { messageSuccess } from "../../../actions";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import formatDistance from "date-fns/formatDistance";
import viLocale from "date-fns/locale/vi";
import axios from "axios";
import {Link} from 'react-router-dom'
import "./style.css";
function Report({ report ,deleteReport}) {
    const timeReport = formatDistance(new Date(report.createdAt), new Date(), {
        locale: viLocale,
      });
  const [user, setUser] = useState();
  const URI = process.env.REACT_APP_URI;
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`${URI}/user/${report.reporter}`);
      setUser(res.data.user);
    };
    getUser();
  }, [report.reporter, URI]);
  const handleDeleteReport = async () => {
    try {
      const result = await axios.delete(`${URI}/report/${report._id}`);
      
      if (result.data.success) {
        deleteReport(report._id)
        messageSuccess("Xoá báo cáo thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardHeader
            avatar={<Avatar alt="Remy Sharp" src={user && user.avatar} />}
            title={user&&user.username}
            subheader={timeReport}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {report.content}
            </Typography>
            <Typography variant="body2" color="text.secondary"></Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          {report.type === 1 ? (
            <Link style={{ textDecoration: "none"
        }} to={`/post/${report.postId}`}><Button variant="contained">Xem bài viết</Button></Link>
          ) : (
            <Button variant="contained">Xem tài khoản</Button>
          )}
          <Button onClick={handleDeleteReport} variant="contained">
            Xoá báo cáo
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Report;
