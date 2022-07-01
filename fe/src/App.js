import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'
import Layout from "./layout/index"
import Feed from './pages/HomePage/index'
import SettingPage from './pages/SettingPage/index'
import ProfilePage from './pages/ProfilePage/index';
import MessengerPage from './pages/MessengerPage'
import NotFoundPage from './pages/NotFoundPage/index'
import SearchPage from './pages/SearchPage/index.jsx'
import Login from './pages/Login/index'
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios'
import { setAuthToken } from './utils/setAuth'
import { TOKEN } from './constants/index'
import * as actions from './actions/auth'
import PostDetailPage from './pages/PostDetailPage';

import NoChatBoxPage from './pages/NoChatBoxPage'
import AdminLayOut from './layout/adminLayout';
import {adminRoutes} from './routes/admin.jsx'
import './App.css';
function App() {
  const URI = process.env.REACT_APP_URI;
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()



  useEffect(() => {
    const checkUser = async () => {
      if (localStorage[TOKEN]) {
        setAuthToken(localStorage[TOKEN])
      }
      try {
        dispatch(actions.setAuth({ isAuth: true }))
        const response = await axios.get(`${URI}/auth`);
        if (response.data.success) {
          dispatch(actions.setAuth({ isAuth: false, user: response.data.user }))
        }
      } catch (error) {
        localStorage.removeItem(TOKEN)
        setAuthToken(null)
        dispatch(actions.setAuth({ isAuth: false, user: null }))
      }
    }
    checkUser();
  }, [dispatch, URI])



  return (
    <div className="app">
      <Router >
        <Routes>
          <Route path='/login' element={!user ? <Login></Login> : <Navigate to="/" />}></Route>
          <Route path='/post/:id' element={user && <PostDetailPage></PostDetailPage>}></Route>
          <Route path='/' element={user && <Layout />} >
          <Route path="/search" element={user && <SearchPage />} />
            <Route path="/messenger" element={user && <NoChatBoxPage />} />
            <Route path="/messenger/:id" element={user && <MessengerPage />} />
            <Route path="/profile/:id" element={user && <ProfilePage />} />
            <Route path="/setting" element={user && <SettingPage />} />
            <Route path="/" element={(user && <Feed />) || <Navigate to="/login" />}></Route>
          </Route>
          { user?.isAdmin && adminRoutes.map((route, index) => {
            const Page = route.component
            const Layout = route.layout === null ? Fragment : AdminLayOut
            return <Route key={index} path={route.path} element={<Layout><Page/></Layout> }></Route>
          })}
          <Route path='/*' element={<NotFoundPage />}></Route>
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
