import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

const MainLayout = () => (
  <div>
    {/* Navbar */}
    <Navbar></Navbar>

    {/* Outlet */}
    <div className="min-h-[calc(100vh-363px)]">
      <ScrollRestoration></ScrollRestoration>
      <Outlet></Outlet>
    </div>

  </div>
);

export default MainLayout;
