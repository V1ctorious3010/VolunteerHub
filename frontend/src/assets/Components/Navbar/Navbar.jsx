import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import { ROLE } from '../../../constants/roles';
import "react-dropdown/style.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const role = user?.role;
  // ensure the app always uses light theme
  console.log(user);
  useEffect(() => {
    try {
      document.querySelector("html").setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } catch (e) {
      // ignore if DOM not available
    }
  }, []);
  return (
    <div data-aos="fade-down"
      data-aos-anchor-placement="top-bottom"
      data-aos-easing="linear"
      data-aos-duration="1000" className="font-qs">
      <div className="navbar bg-blue-600">
        <div className="w-1/2 justify-start md:justify-center">
          <div className="dropdown">

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[111] p-2 shadow bg-base-100  rounded-box w-52"
            >
              <NavLink to="/" className="z-40">
                <a>Trang chủ</a>
              </NavLink>
              <NavLink to="/need-volunteer">
                <a>Dự án</a>
              </NavLink>
              <NavLink>
                <a>Hồ sơ</a>
                <ul className="p-2">
                  {role === ROLE.EVENT_ORGANIZER && (
                    <Link to='/add-volunteer-post'>
                      <a>Tạo sự kiện mới</a>
                    </Link>
                  )}
                  <Link to='/manage-my-post'>
                    <a>Quản lý sự kiện</a>
                  </Link>
                </ul>
              </NavLink>
            </ul>
          </div>
          <Link to="/" className="cursor-pointer inter flex items-center ">

            <div>
              <h2 className="hidden md:flex font-bold text-xl md:text-2xl">
                <span className="text-yellow-200">GiveNow</span>
              </h2>
            </div>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu gap-8 menu-horizontal px-1">
            <NavLink
              to="/"
              className={"font-bold text-white"
              }
            >
              <button className="px-8 py-3 text-xl hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Trang chủ</button>
            </NavLink>
            <NavLink
              to="/need-volunteer"
              className={"font-bold text-white"
              }
            >
              <button className="px-8 py-3 text-xl hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Dự án</button>
            </NavLink>
            <NavLink
              to="/feed"
              className={"font-bold text-white"
              }
            >
              <button className="px-8 py-3 text-xl hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Diễn đàn</button>
            </NavLink>
            <button className="font-bold ">
              <div className="dropdown dropdown-end z-50">
                <div tabIndex={0} role="button" className="">
                  <div>
                    <button className="px-8 py-3 text-xl text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Quản lý</button>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {!user ? (
                    <li>
                      <Link to="/login" className="justify-between">
                        Đăng nhập để vào trang
                      </Link>
                    </li>
                  ) : (
                    <>
                      {(role === ROLE.EVENT_ORGANIZER) && (
                        <li>
                          <Link to="/add-volunteer-post" className="justify-between">
                            Tạo mới sự kiện
                          </Link>
                        </li>
                      )}
                      {role === ROLE.ADMIN && (
                        <li>
                          <Link to="/manage-volunteers" className="justify-between text">
                            Quản lý người dùng
                          </Link>
                        </li>
                      )}
                      {role === ROLE.EVENT_ORGANIZER && (
                        <li>
                          <Link to="/manage-my-post">Quản lý sự kiện</Link>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </button>
          </ul>
        </div>
        <div className="navbar-end gap-4">
          <div className="w-12" />
          <div className="md:navbar-end">
            {user?.email ? (
              <div className="flex items-center gap-4">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name || 'avatar'} />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sm font-bold">{(user.name || user.email || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}</div>
                      )}
                    </div>
                  </label>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <NavLink to="/user-info">Trang cá nhân</NavLink>
                    </li>
                    <li>
                      <button onClick={() => dispatch(logout())}>Đăng xuất</button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 lg:px-6 lg:py-3 rounded-lg hover:scale-105 hover:bg-yellow-400 transition-all duration-200 cursor-pointer text-white font-semibold lg:text-lg bg-yellow-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 lg:px-6 lg:py-3 rounded-lg hover:scale-105 hover:bg-green-600 transition-all duration-200 cursor-pointer text-white font-semibold lg:text-lg bg-green-500"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
