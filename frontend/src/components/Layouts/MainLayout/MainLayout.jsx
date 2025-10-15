import { Outlet } from "react-router-dom";
import Navbar from "../../NavBars/NavBars";

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-[calc(100vh-200px)]">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;