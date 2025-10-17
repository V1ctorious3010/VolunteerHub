import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import HomePage from "../Pages/Home/HomePage/HomePage";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import NeedVolunteer from "../Pages/NeedVolunteer/NeedVolunteer";
// import ErrorPage from "../Pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        // errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage title="VolunteerCommunity"></HomePage>,
            },
            {
                path: "/login",
                element: <Login title="Login" />,
            },
            {
                path: "/register",
                element: <Register title="Register" />,
            },
            {
                path: "/need-volunteer",
                element: <NeedVolunteer title="Need Volunteers"></NeedVolunteer>,
                loader: () => fetch(`${import.meta.env.VITE_API_URL}/need-volunteers`),
            },
        ],
    },
]);

export default router;