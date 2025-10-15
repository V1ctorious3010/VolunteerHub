//import logo from "../../images/Minimalist local charity logo with helping hands.svg";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import UseAuth from "./../Hook/UseAuth";

const Navbars = () => {
    const { user, logOut } = UseAuth();

    // Tạo state để theo dõi khi người dùng di chuột qua avatar
    const [hovered, setHovered] = useState(false);
    // Tạo state để quản lý trạng thái của checkbox (bật/tắt) cho theme switcher
    const [isChecked, setIsChecked] = useState(false);
    // Tạo state để quản lý theme hiện tại ('light' hoặc 'dark')
    const [theme, setTheme] = useState("light");

    // Hàm xử lý sự kiện khi người dùng thay đổi checkbox
    const handleCheckboxChange = (e) => {
        // Đảo ngược trạng thái của isChecked (từ true thành false và ngược lại)
        setIsChecked(!isChecked);
        // Nếu checkbox được check (bật)
        if (e.target.checked) {
            // Đặt theme thành 'dark'
            setTheme("dark");
        } else {
            // Nếu không, đặt theme thành 'light'
            setTheme("light");
        }
    };

    // useEffect sẽ chạy mỗi khi giá trị của state `theme` thay đổi
    useEffect(() => {
        // 1. Lưu giá trị theme hiện tại vào localStorage của trình duyệt
        localStorage.setItem("theme", theme);
        // 2. Lấy lại giá trị theme vừa lưu
        const localTheme = localStorage.getItem("theme");
        // 3. Gán giá trị đó vào thuộc tính 'data-theme' của thẻ <html>
        //    (Thư viện CSS như DaisyUI sẽ dựa vào thuộc tính này để đổi giao diện)
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]); // Mảng phụ thuộc, chỉ chạy lại khi `theme` thay đổi

    // Phần JSX trả về để render ra giao diện
    return (
        // Div bao ngoài cùng, sử dụng thư viện AOS để tạo hiệu ứng fade-down
        <div data-aos="fade-down"
            data-aos-anchor-placement="top-bottom"
            data-aos-easing="linear"
            data-aos-duration="1000" className="font-qs">
            {/* Container chính của navbar, sử dụng class của DaisyUI */}
            <div className="navbar bg-base-100">
                {/* Phần bên trái navbar: chứa menu mobile và logo */}
                <div className="w-1/2 justify-start md:justify-center">
                    {/* Dropdown menu cho mobile - chỉ hiện trên màn hình nhỏ (ẩn trên lg và lớn hơn) */}
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            {/* Icon Hamburger */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        {/* Nội dung của dropdown menu */}
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[111] p-2 shadow bg-base-100 rounded-box w-52">
                            <NavLink to="/"><a>Home</a></NavLink>
                            <NavLink to="/need-volunteer"><a>Need Volunteers</a></NavLink>
                            {/* Menu con */}
                            <NavLink>
                                <a>My Profile</a>
                                <ul className="p-2">
                                    <Link to='/add-volunteer-post'><a>Add Volunteer Post</a></Link>
                                    <Link to='/manage-my-post'><a>Manage My Post</a></Link>
                                </ul>
                            </NavLink>
                        </ul>
                    </div>
                    {/* Logo và tên trang web */}
                    <Link to="/" className="cursor-pointer inter flex items-center ">
                        <div>
                            {/* Tên trang web chỉ hiển thị trên màn hình vừa (md) trở lên */}
                            <h2 className="hidden md:flex font-bold text-xl md:text-2xl">
                                <span className="text-blue-500">Volunteer</span> Community
                            </h2>
                        </div>
                    </Link>
                </div>

                {/* Phần menu chính giữa - chỉ hiện trên màn hình lớn (lg) */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu gap-8 menu-horizontal px-1">
                        {/* Sử dụng NavLink để tự động thêm class active */}
                        <NavLink to="/" className={({ isActive }) => isActive ? "rounded-xl text-[#BE042F] font-semibold" : "font-bold"}>
                            <button className="px-8 py-3 text-lg">Home</button>
                        </NavLink>
                        <NavLink to="/need-volunteer" className={({ isActive }) => isActive ? "rounded-xl text-[#BE042F] font-semibold" : "font-bold"}>
                            <button className="px-8 py-3 text-xl">Need Volunteer</button>
                        </NavLink>
                        {/* Dropdown cho "My Profile" trên desktop */}
                        <div className="dropdown dropdown-end z-50">
                            <div tabIndex={0} role="button">
                                <button className="px-8 py-3 text-xl font-bold">My Profile</button>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><Link to="/add-volunteer-post">Add Volunteer Post</Link></li>
                                <li><Link to="/manage-my-post">Manage My Post</Link></li>
                            </ul>
                        </div>
                    </ul>
                </div>

                {/* Phần bên phải navbar: chứa theme switcher và thông tin đăng nhập */}
                <div className="navbar-end gap-4">
                    {/* Nút gạt để đổi theme */}
                    <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="sr-only" />
                        <span className={`slider flex h-7 w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? "bg-[#212b36]" : "bg-[#CCCCCE]"}`}>
                            <span className={`dot h-6 w-6 rounded-full bg-white duration-200 ${isChecked ? "translate-x-[28px]" : ""}`}></span>
                        </span>
                    </label>

                    {/* Logic hiển thị dựa trên trạng thái đăng nhập */}
                    <div className="md:navbar-end">
                        {
                            // Toán tử ba ngôi: Nếu user.email tồn tại (đã đăng nhập) thì...
                            user?.email ? (
                                // ...hiển thị khối div này
                                <div className="flex items-center gap-4">
                                    {/* Avatar người dùng */}
                                    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="w-10 relative rounded-full">
                                        <img className="rounded-full cursor-pointer transition hover:scale-95"
                                            src={user.photoURL ? user.photoURL : "link_anh_mac_dinh"} // Nếu có ảnh thì dùng, không thì dùng ảnh mặc định
                                            alt={user.displayName}
                                        />
                                        {/* Hiển thị tên người dùng khi di chuột qua avatar */}
                                        {hovered && (
                                            <div className="absolute -left-28 top-10 transition transform bg-opacity-70 p-2 text-sm font-bold rounded">
                                                <div className="font bold">{user.displayName}</div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Nút Logout */}
                                    <div className="flex font-bold">
                                        <button onClick={logOut} className="btn btn-sm hover:scale-125 transition btn-secondary">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                // ...ngược lại (chưa đăng nhập) thì hiển thị nút Log In
                                <Link to="/login" className="mr-4 md:mr-0 px-4 py-2 lg:px-6 lg:py-3 rounded-lg hover:scale-105 cursor-pointer transition text-white font-semibold lg:text-lg bg-orange-500 ">
                                    Log In
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbars;