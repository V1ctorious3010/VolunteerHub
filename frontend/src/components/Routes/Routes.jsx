import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import HomePage from "../Pages/HomePage/HomePage";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
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
        ],
    },
]);

export default router;