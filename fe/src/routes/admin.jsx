import DashBoardPage from "../pages/AdminPage/DashboardPage";
import UserPage from '../pages/AdminPage/UserPage'
import ReportPage from '../pages/AdminPage/ReportPage'
import PostPage from '../pages/AdminPage/PostPage'
export const adminRoutes = [
  { path: "/dashboard/", component: DashBoardPage },
  { path: "/dashboard/users", component: UserPage },
  { path: "/dashboard/posts", component: PostPage },
  { path: "/dashboard/reports", component: ReportPage },
];
