import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import "react-dropdown/style.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const role = user?.role;
  // ensure the app always uses light theme
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
                <a>Home</a>
              </NavLink>
              <NavLink to="/need-volunteer">
                <a>Need Volunteers</a>
              </NavLink>
              <NavLink>
                <a>My Profile</a>
                <ul className="p-2">
                  {role === 'organization' && (
                    <Link to='/add-volunteer-post'>
                      <a>Add Volunteer Post</a>
                    </Link>
                  )}
                  <Link to='/manage-my-post'>
                    <a>Manage My Post</a>
                  </Link>
                </ul>
              </NavLink>
            </ul>
          </div>
          <Link to="/" className="cursor-pointer inter flex items-center ">

            <div>
              <h2 className="hidden md:flex font-bold text-xl md:text-2xl">
                <span className="text-yellow-200">Volunteer Hub</span>
              </h2>
            </div>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu gap-8 menu-horizontal px-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "rounded-xl text-white font-semibold"
                  : "font-bold text-white"
              }
            >
              <button className="px-8 py-3 text-lg hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Home</button>
            </NavLink>
            <NavLink
              to="/need-volunteer"
              className={({ isActive }) =>
                isActive
                  ? "rounded-xl text-white font-semibold"
                  : "font-bold text-white"
              }
            >
              <button className="px-8 py-3 text-xl hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Need Volunteer</button>
            </NavLink>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                isActive
                  ? "rounded-xl text-white font-semibold"
                  : "font-bold text-white"
              }
            >
              <button className="px-8 py-3 text-xl hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Feed</button>
            </NavLink>
            <button className="font-bold ">
              <div className="dropdown dropdown-end z-50">
                <div tabIndex={0} role="button" className="">
                  <div>
                    <button className="px-8 py-3 text-xl text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-lg">Manage</button>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {!user ? (
                    <li>
                      <Link to="/login" className="justify-between">
                        Login to manage
                      </Link>
                    </li>
                  ) : (
                    <>
                      {(role === 'EVENT_ORGANIZER') && (
                        <li>
                          <Link to="/add-volunteer-post" className="justify-between">
                            Add Volunteer Post
                          </Link>
                        </li>
                      )}
                      {role === 'ADMIN' && (
                        <li>
                          <Link to="/manage-volunteers" className="justify-between text">
                            Manage Volunteers
                          </Link>
                        </li>
                      )}
                      {role === 'EVENT_ORGANIZER' && (
                        <li>
                          <Link to="/manage-my-post">Manage My Post</Link>
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
                <div
                  className="w-10 relative rounded-full"
                >
                  <div className=" font bold">{user.displayName}</div>
                </div>

                <div className="flex  font-bold">
                  <button
                    onClick={() => dispatch(logout())}
                    className="btn btn-sm hover:scale-110 hover:bg-black-600 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 lg:px-6 lg:py-3 rounded-lg hover:scale-105 hover:bg-yellow-400 transition-all duration-200 cursor-pointer text-white font-semibold lg:text-lg bg-yellow-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 lg:px-6 lg:py-3 rounded-lg hover:scale-105 hover:bg-green-600 transition-all duration-200 cursor-pointer text-white font-semibold lg:text-lg bg-green-500"
                >
                  Register
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
