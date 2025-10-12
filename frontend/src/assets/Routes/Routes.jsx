import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import AuthExample from "../../examples/AuthExample";
// import Home from "../Pages/Homepage/Home/Home";
// import Login from "../Pages/Login/Login";
// import Register from "../Pages/Register/Register";
// import ErrorPage from "../Pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        // errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <AuthExample />,
            },
            // {
            //     path: "/login",
            //     element: <Login title="Login" />,
            // },
            // {
            //     path: "/register",
            //     element: <Register title="Register" />,
            // },
        ],
    },
]);

export default router;