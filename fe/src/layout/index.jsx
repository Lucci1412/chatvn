import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar/index";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";

import "./style.css";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  

  return (
    <div className="layout">
      <Container className='layout_container'>
        {user && <Topbar   />}
        <Outlet />
      </Container>
    </div>
  );
}

export default Layout;
