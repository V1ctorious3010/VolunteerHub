import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../images/logo.svg';
import { logout } from '../../../features/auth/authSlice';
import { ROLE } from '../../../constants/roles';
import "react-dropdown/style.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const role = user?.role;
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const res = dispatch(logout());
      if (res && typeof res.then === 'function') {
        await res;
      }
      window.location.replace('/');
    } catch (e) {
      console.error('Logout failed', e);
      window.location.replace('/');
    }
  };
  useEffect(() => {
    try {
      document.querySelector("html").setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } catch (e) {
      // ignore if DOM not available
    }
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div data-aos="fade-down"
      data-aos-anchor-placement="top-bottom"
      data-aos-easing="linear"
      data-aos-duration="1000" className="font-qs">
      <div className="navbar bg-blue-600">
        <div className="w-1/2 justify-start md:justify-center flex items-center">
          {/* Mobile menu toggle */}
          <button
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden mr-2 p-2 text-white hover:bg-white/10 rounded-md"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          {/* Mobile menu overlay */}
          {mobileOpen && (
            <div className="absolute top-14 left-2 right-2 bg-white shadow-md rounded-md z-50 p-4 lg:hidden">
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link>
                </li>
                <li>
                  <Link to="/need-volunteer" onClick={() => setMobileOpen(false)}>Dự án</Link>
                </li>
                <li>
                  <Link to="/feed" onClick={() => setMobileOpen(false)}>Diễn đàn</Link>
                </li>
                {user && user.role !== ROLE.VOLUNTEER && (
                  <>
                    {(role === ROLE.EVENT_ORGANIZER) && (
                      <li>
                        <Link to="/add-volunteer-post" onClick={() => setMobileOpen(false)}>Tạo mới sự kiện</Link>
                      </li>
                    )}
                    {(role === ROLE.EVENT_ORGANIZER) && (
                      <li>
                        <Link to="/manage-event-list" onClick={() => setMobileOpen(false)}>Quản lý sự kiện</Link>
                      </li>
                    )}
                    {role === ROLE.ADMIN && (
                      <li>
                        <Link to="/manage-volunteers" onClick={() => setMobileOpen(false)}>Quản lý người dùng</Link>
                      </li>
                    )}
                    {role === ROLE.ADMIN && (
                      <li>
                        <Link to="/manage-admin-events" onClick={() => setMobileOpen(false)}>Quản lý sự kiện</Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          )}

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
                  {role === ROLE.EVENT_ORGANIZER && (
                    <Link to='/manage-event-list'>
                      <a>Quản lý sự kiện</a>
                    </Link>
                  )}
                </ul>
              </NavLink>
            </ul>
          </div>
          <Link to="/" className="cursor-pointer inter flex items-center ">
            <div className="flex items-center gap-2">
              <img src={logo} alt="goodhand logo" className="w-8 h-8" />
              <h2 className="hidden md:flex font-bold text-xl md:text-2xl">
                <span className="text-[#5ce7ff]">GoodHands</span>
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
            {user && user.role !== ROLE.VOLUNTEER && (
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
                    {(role === ROLE.EVENT_ORGANIZER) && (
                      <li>
                        <Link to="/add-volunteer-post" className="justify-between">
                          Tạo mới sự kiện
                        </Link>
                      </li>
                    )}
                    {(role === ROLE.EVENT_ORGANIZER) && (
                      <li>
                        <Link to="/manage-event-list" className="justify-between">
                          Quản lý sự kiện
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
                    {role === ROLE.ADMIN && (
                      <li>
                        <Link to="/manage-admin-events" className="justify-between text">
                          Quản lý sự kiện
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </button>
            )}
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
                      {(user?.avatarUrl || user?.avatar) ? (
                        <img src={user.avatarUrl || user.avatar} alt={user.name || 'avatar'} />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sm font-bold">{(user.name || user.email || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}</div>
                      )}
                    </div>
                  </label>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <NavLink to="/user-info">Trang cá nhân</NavLink>
                    </li>
                    {role === ROLE.VOLUNTEER && (
                      <li>
                        <Link to="/my-volunteer-requests" className="justify-between text">
                          Lịch sử tham gia
                        </Link>
                      </li>
                    )}
                    <li>
                      <button onClick={handleLogout}>Đăng xuất</button>
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
