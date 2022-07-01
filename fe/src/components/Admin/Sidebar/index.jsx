import {
  AccountCircleOutlined,
  NotificationsNone,
  ExitToApp,
  SettingsApplications,
  PostAdd,
  Report,
  Dashboard,
  PersonOutline,
} from "@mui/icons-material";
import {TOKEN} from '../../../constants'
import {setAuth} from '../../../actions/auth'
import { NavLink } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import './style.css'
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    dispatch(setAuth({ isAuth: false, user: null }));
    navigate("/login");

  };
  return (
    <div className="sidebar">
      <NavLink to="/" className="sidebar_logo">
        <span>CHATVN</span>
      </NavLink>

      <ul>
        <NavLink
          to="/dashboard/"
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
        >
          <Dashboard className="sidebar_icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
          to="/dashboard/users"
        >
          <PersonOutline className="sidebar_icon" />
          <span>Users</span>
        </NavLink>
        {/* <NavLink 
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
          n=
          to="/dashboard/posts"
        >
          <PostAdd className="sidebar_icon" />
          <span>Posts</span>
        </NavLink> */}
        <NavLink
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
          to="/dashboard/reports"
        >
          <Report className="sidebar_icon" />
          <span>Reports</span>
        </NavLink>
       
        <NavLink
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
          to="/dashboard/notifications"
        >
          <NotificationsNone className="sidebar_icon" />
          <span>Notifications</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
          to="/dashboard/setting"
        >
          <SettingsApplications className="sidebar_icon" />
          <span>Settings</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? "sidebar_active" : "sidebar_link"
          }
          to="/dashboard/profile"
        >
          <AccountCircleOutlined className="sidebar_icon" />
          <span>Profile</span>
        </NavLink>
        <li
        onClick={handleLogout}
          className="sidebar_link"
        >
          <ExitToApp className="sidebar_icon" />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
