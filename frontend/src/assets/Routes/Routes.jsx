import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Homepage/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import AddVolunteerPost from "../Pages/AddVolunteerPost/AddVolunteerPost";
import MyVolunteerRequest from "../Pages/MyVolunteerRequest/MyVolunteerRequest";
import ManageVolunteerPost from "../Pages/ManageVolunteerPost/ManageVolunteerPost";
import ManageVolunteers from "../Pages/ManageVolunteers/ManageVolunteers";
import PrivateRoutes from "./PrivateRoutes";
import PostDetails from "../Pages/PostDetails/PostDetails";
import UserInfo from "../Pages/UserInfo/UserInfo";
import BeAVolunteer from "../Pages/BeAVolunteer/BeAVolunteer";
import NeedVolunteer from "../Pages/NeedVolunteer/NeedVolunteer";
import Feed from "../Pages/Feed/Feed";
import UpdateMyPost from "../Pages/UpdateMyPost/UpdateMyPost";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import EvOrgPost from "../Pages/EvOrgPost/EvOrgPost";
import EvOrgTabs from "../Pages/EvOrgPost/EvOrgTabs";
import EventFeed from "../Pages/EventFeed/EventFeed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home title="GoodHands"></Home>,
      },
      {
        path: "/feed",
        element: (
          <PrivateRoutes>
            <Feed title="Diễn đàn"></Feed>
          </PrivateRoutes>
        ),
      },
      {
        path: "/login",
        element: <Login title="Đăng nhập"></Login>,
      },
      {
        path: "/register",
        element: <Register title="Đăng ký"></Register>,
      },
      {
        path: "/need-volunteer",
        element: <NeedVolunteer title="Cần tình nguyện viên"></NeedVolunteer>,
        loader: async () => {
          const { default: api } = await import('../../utils/apiClient');
          const res = await api.get('/events?keyword=&location=&start=&page=0&sortBy=');
          return res || [];
        },
      },
      {
        path: "/add-volunteer-post",
        element: (
          <PrivateRoutes>
            <AddVolunteerPost title="Tạo sự kiện"></AddVolunteerPost>
          </PrivateRoutes>
        ),
      },
      {
        path: "/my-volunteer-requests",
        element: (
          <PrivateRoutes>
            <MyVolunteerRequest title="Đăng ký yêu cầu"></MyVolunteerRequest>
          </PrivateRoutes>
        ),
      },
      {
        path: "/manage-admin-events",
        element: (
          <PrivateRoutes>
            <ManageVolunteerPost title="Quản lý sự kiện"></ManageVolunteerPost>
          </PrivateRoutes>
        ),
      },
      {
        path: "/manage-event-list",
        element: (
          <PrivateRoutes>
            <EvOrgPost title="Quản lý sự kiện"></EvOrgPost>
          </PrivateRoutes>
        ),
      },
      {
        path: "/manage-event-list/tabs",
        element: (
          <PrivateRoutes>
            <EvOrgTabs title="Quản lý sự kiện"></EvOrgTabs>
          </PrivateRoutes>
        ),
      },
      {
        path: "/post-details/:id",
        element: (
          <PrivateRoutes>
            <PostDetails title='Chi tiết bài viết'></PostDetails>
          </PrivateRoutes>
        ),
        loader: async ({ params }) => {
          const { default: api } = await import('../../utils/apiClient');
          const res = await api.get(`/events/${params.id}`);
          return res?.data || null;
        },
      },
      {
        path: "/event-feed/:eventId",
        element: (
          <PrivateRoutes>
            <EventFeed title="Trang sự kiện"></EventFeed>
          </PrivateRoutes>
        ),
      },
      {
        path: "/update-my-post/:id",
        element: (
          <PrivateRoutes>
            <UpdateMyPost title="Cập nhật bài viết"></UpdateMyPost>
          </PrivateRoutes>
        ),
        loader: async ({ params }) => {
          const { default: api } = await import('../../utils/apiClient');
          const res = await api.get(`/events/${params.id}`);
          return res?.data || null;
        },
      },
      {
        path: "/be-a-volunteer/:id",
        element: (
          <PrivateRoutes>
            <BeAVolunteer title="Đăng ký tham gia"></BeAVolunteer>
          </PrivateRoutes>
        ),
        loader: async ({ params }) => {
          const { default: api } = await import('../../utils/apiClient');
          const res = await api.get(`/events/${params.id}`);
          return res?.data || null;
        }
      },
      {
        path: "/manage-volunteers",
        element: (
          <PrivateRoutes>
            <ManageVolunteers title="Quản lý người dùng"></ManageVolunteers>
          </PrivateRoutes>
        ),
      },
      {
        path: "/user-info",
        element: (
          <PrivateRoutes>
            <UserInfo title="Thông tin người dùng"></UserInfo>
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

export default router;
