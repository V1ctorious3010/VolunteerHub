import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
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
        toast.success("Đăng nhập thành công");
      } else {
        toast.error(action.payload || "Thông tin đăng nhập không hợp lệ");
      }
    } catch (err) {
      console.log(err);
      toast.error("Thông tin đăng nhập không hợp lệ");
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
      <div className="bg-white font-qs rounded-md px-5 container mx-auto">
        <div className="flex justify-center gap-5 py-16 lg:h-[80vh] ">


          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">

                <p className="mt-3 font-bold text-gray-800">
                  Đăng nhập vào tài khoản của bạn
                </p>
              </div>

              <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-800">
                      Địa chỉ email
                    </label>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Hãy nhập địa chỉ email"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label className="font-bold text-sm text-gray-700">
                        Mật khẩu
                      </label>

                    </div>
                    <div className="relative">
                      <input
                        placeholder="Hãy nhập mật khẩu"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
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
                      value={loading ? "Đang đăng nhập..." : " Đăng nhập"}
                      disabled={loading}
                    />
                  </div>
                </form>

                <p className="mt-6  text-center text-gray-800">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    Hãy đăng ký
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
