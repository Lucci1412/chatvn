import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import { messageSuccess } from "../../../actions/index";

function User() {
  const currentUser = useSelector((state) => state.auth.user);
  const URI = process.env.REACT_APP_URI;
  const friendOnline = useSelector((state) => state.socketIo.listOnline);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getAllUser = async () => {
      try {
        const res =
          currentUser &&
          (await axios.get(`${URI}/user/allUser/${currentUser._id}`));
        if (res.data.success) {
          setUsers(
            res.data.users.map((item) => ({
              id: item._id,
              avatar: item.avatar,
              email: item.email,
              name: item.username,
              status: friendOnline.includes(item._id)? 'online':"offline",
              blockAccount: item.blockAccount,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllUser();
  }, [URI, currentUser ,friendOnline]);

  const handelBlockAccount = async (id) => {
    try {
      const res = await axios.put(`${URI}/user/block/${id}`);
      if (res.data.success) {
        const newData = {
          id: res.data.newUser._id,
          avatar: res.data.newUser.avatar,
          email: res.data.newUser.email,
          name: res.data.newUser.newUsername,
          status: friendOnline.includes(res.data.newUser._id)? 'online':"offline",
          blockAccount: res.data.newUser.blockAccount,
        };
      
        const dataEmail={
          "email":res.data.newUser.email,
          "content":res.data.newUser.blockAccount ?"Tài khoản của bạn đã bị khoá do vi phạm tiêu chuẩn cộng đồng":"Sau khi xem xét chúng tôi quyết định mở khoá cho tài khoản của bạn",
          "title":res.data.newUser.blockAccount ?'Khoá tài khoản':'Mở khoá tài khoản'
      }
        const result = await axios.post(`${URI}/email`,dataEmail)
        if(result.data.success){
          const filter = users.filter((item) => item.id !== id);
          setUsers([...filter, newData]);
          messageSuccess(res.data.message);
        }
       
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    { field: "id", headerName: "ID", width: 180 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (user) => {
        return <img src={user.formattedValue} className="avatar" alt="" />;
      },
    },
    { field: "email", headerName: "Email", width: 130 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "blockAccount",
      headerName: "Block Account",
      width: 130,
      renderCell: (user) => {
        return (
          <>
            {user.formattedValue ? (
              <Button
                onClick={() => handelBlockAccount(user.id)}
                variant="contained"
                color="warning"
              >
              unBlock
           
              </Button>
            ) : (
              <Button
                onClick={() => handelBlockAccount(user.id)}
                variant="contained"
                color="success"
              >

              block
            
              </Button>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div style={{ width: "90%", margin: "50px 5% 0 5% " }}>
      <div style={{ height: "calc(100vh - 120px)", width: "100%" }}>
        <DataGrid
          rows={users && users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  );
}

export default User;
