import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Homepage/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import AddVolunteerPost from "../Pages/AddVolunteerPost/AddVolunteerPost";
import ManageMyPost from "../Pages/ManageMyPost/ManageMyPost";
import PrivateRoutes from "./PrivateRoutes";
import PostDetails from "../Pages/PostDetails/PostDetails";
import BeAVolunteer from "../Pages/BeAVolunteer/BeAVolunteer";
import NeedVolunteer from "../Pages/NeedVolunteer/NeedVolunteer";
import UpdateMyPost from "../Pages/UpdateMyPost/UpdateMyPost";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement:<ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home title="VolunteerHub"></Home>,
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
        loader:() =>fetch(`${import.meta.env.VITE_API_URL}/need-volunteers`),
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
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/post/${params.id}`),
      },
      {
        path: "/update-my-post/:id",
        element: (
          <PrivateRoutes>
            <UpdateMyPost title="Update My Post"></UpdateMyPost>
          </PrivateRoutes>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/post/${params.id}`),
      },
      {
        path: "/be-a-volunteer/:id",
        element: (
          <PrivateRoutes>
            <BeAVolunteer title="Be A Volunteer"></BeAVolunteer>
          </PrivateRoutes>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/post/${params.id}`)
      },
    ],
  },
]);

export default router;
