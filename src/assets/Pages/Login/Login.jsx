import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
import logo from "../../images/Minimalist local charity logo with helping hands.svg";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
const Login = ({ title }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  //Form Data:
  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const action = await dispatch(login({ email, password }));
      if (login.fulfilled.match(action)) {
        navigate(location?.state || "/");
        toast.success("You've been Logged In Successfully");
      } else {
        toast.error(action.payload || "Invalid credentials !");
      }
    } catch (err) {
      console.log(err);
      toast.error("Invalid credentials !");
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  if (user) return null;
  return (
    <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className="">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="bg-white font-qs dark:bg-gray-900 rounded-md px-5 container mx-auto">
        <div className="flex justify-center gap-5 py-16 lg:h-[80vh] ">


          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="flex justify-center mx-auto">
                  <img className="md:size-48 size-32 p-0" src={logo} alt="" />
                </div>

                <p className="mt-3 font-bold text-gray-800 dark:text-gray-300">
                  Log in to your account
                </p>
              </div>

              <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                      Email Address
                    </label>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email address"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label className="font-bold text-sm text-gray-700 dark:text-gray-200">
                        Password
                      </label>

                    </div>
                    <div className="relative">
                      <input
                        placeholder="Enter your password"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        {...register("password", { required: true })}
                      />
                      <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <FaEye className="absolute top-1/3 right-2 cursor-pointer" />
                        ) : (
                          <FaEyeSlash className="absolute top-1/3 right-2 cursor-pointer" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <input
                      className="w-full px-4 py-2 cursor-pointer font-bold tracking-wide text-white transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-gray-400 focus:outline-none focus:bg-gray-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                      type="submit"
                      value={loading ? "Logging in..." : " Log in"}
                      disabled={loading}
                    />
                  </div>
                </form>

                <p className="mt-6  text-center text-gray-800">
                  Don&#x27;t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    Register
                  </Link>
                  .
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Login.propTypes = {
  title: PropTypes.object.isRequired,
}
export default Login;
