import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const MainLayout = () => (
  <div>
    <Navbar></Navbar>

    <div className="min-h-[calc(100vh-363px)]">
      <ScrollRestoration></ScrollRestoration>
      <Outlet></Outlet>
    </div>

    <Footer></Footer>
  </div>
);

export default MainLayout;
