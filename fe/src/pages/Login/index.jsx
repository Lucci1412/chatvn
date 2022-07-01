import React from "react";

import LoginForm from '../../components/LoginForm/index';
import RegisterFrom from "../../components/RegisterFrom";
// import CircularProgress from '@mui/material/CircularProgress';

import "./styles.css";
function Login() {

  return (
    <div className='auth_page'>
      <div className="auth">
        <LoginForm/>
        <RegisterFrom/>
      </div>
    </div>
  );
}

export default Login;
