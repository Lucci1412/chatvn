import React from "react";
import Navbar from "../components/Admin/Navbar/index";
import Sidebar from "../components/Admin/Sidebar/index";
import './style.css'
function AdminLayOut({ children }) {
  return (
    <div className="admin_layout">
      <Sidebar />
      <div className='admin_container'>
        <Navbar/>
        {children}
        </div>
    </div>
  );
}

export default AdminLayOut;
