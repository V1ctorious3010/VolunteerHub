import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Homepage/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import AddVolunteerPost from "../Pages/AddVolunteerPost/AddVolunteerPost";
import ManageMyPost from "../Pages/ManageMyPost/ManageMyPost";
import ManageVolunteers from "../Pages/ManageVolunteers/ManageVolunteers";
import PrivateRoutes from "./PrivateRoutes";
import PostDetails from "../Pages/PostDetails/PostDetails";
import BeAVolunteer from "../Pages/BeAVolunteer/BeAVolunteer";
import NeedVolunteer from "../Pages/NeedVolunteer/NeedVolunteer";
import Feed from "../Pages/Feed/Feed";
import UpdateMyPost from "../Pages/UpdateMyPost/UpdateMyPost";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home title="VolunteerHub"></Home>,
      },
      {
        path: "/feed",
        element: <Feed title="Feed"></Feed>,
      },
      {
        path: "/login",
        element: <Login title="Login"></Login>,
      },
      {
        path: "/register",
        element: <Register title="Register"></Register>,
      },
      {
        path: "/need-volunteer",
        element: <NeedVolunteer title="Need Volunteers"></NeedVolunteer>,
        loader: async () => {
          const res = await fetch('/api/posts.json');
          return res.ok ? res.json() : [];
        },
      },
      {
        path: "/add-volunteer-post",
        element: (
          <PrivateRoutes>
            <AddVolunteerPost title="Add Volunteer Post"></AddVolunteerPost>
          </PrivateRoutes>
        ),
      },
      {
        path: "/manage-my-post",
        element: (
          <PrivateRoutes>
            <ManageMyPost ></ManageMyPost>
          </PrivateRoutes>
        ),
      },
      {
        path: "/post-details/:id",
        element: (
          <PrivateRoutes>
            <PostDetails title='Post Details'></PostDetails>
          </PrivateRoutes>
        ),
        loader: async ({ params }) => {
          const res = await fetch('/api/posts.json');
          const arr = res.ok ? await res.json() : [];
          return arr.find(p => String(p.id) === String(params.id)) || null;
        },
      },
      {
        path: "/update-my-post/:id",
        element: (
          <PrivateRoutes>
            <UpdateMyPost title="Update My Post"></UpdateMyPost>
          </PrivateRoutes>
        ),
        loader: async ({ params }) => {
          const res = await fetch('/api/posts.json');
          const arr = res.ok ? await res.json() : [];
          return arr.find(p => String(p.id) === String(params.id)) || null;
        },
      },
      {
        path: "/be-a-volunteer/:id",
        element: (
          <PrivateRoutes>
            <BeAVolunteer title="Be A Volunteer"></BeAVolunteer>
          </PrivateRoutes>
        ),
        loader: async ({ params }) => {
          const res = await fetch('/api/posts.json');
          const arr = res.ok ? await res.json() : [];
          return arr.find(p => String(p.id) === String(params.id)) || null;
        }
      },
      {
        path: "/manage-volunteers",
        element: (
          <PrivateRoutes>
            <ManageVolunteers title="Manage Volunteers"></ManageVolunteers>
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

export default router;
