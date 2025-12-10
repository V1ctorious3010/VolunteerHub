import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../../features/auth/authSlice";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

const Register = ({ title }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { name, email, password, role } = data;
    // Basic password rules
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password needs an uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password needs a lowercase letter");
      return;
    }
    try {
      const action = await dispatch(registerUser({ name, email, role, password }));
      if (registerUser.fulfilled.match(action)) {
        toast.success("Account created Successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(action.payload || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed due to an unexpected error.");
    }
  };

  if (user) return null;

  return (
    <div data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500" className="">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section className="bg-white font-qs container mx-auto rounded-md ">
        <div className="flex justify-center px-4 py-12 lg:h-[90vh]  ">
          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div className="w-full">
              <h1 className="text-4xl font-semibold tracking-wider text-gray-800 capitalize">
                Create Your Own Account.
              </h1>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mt-8">
                <div>
                  <label className="block mb-2 font-semibold  text-gray-800">Name</label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Enter your name"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Email address</label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Enter your email address"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="text-gray-800 font-semibold" htmlFor="role">Role</label>
                  <select
                    {...register("role")}
                    name="role"
                    id="role"
                    className="border p-2 rounded-md"
                  >
                    <option value="VOLUNTEER">Volunteer</option>
                    <option value="EVENT_ORGANIZER">Event Organizer</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Password</label>
                  <div className="relative">
                    <input
                      placeholder="Enter your password"
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
                <p className="text-center text-gray-800">
                  Already have an account ?{" "}
                  <Link to="/login" className="text-blue-500 focus:outline-none focus:underline hover:underline">
                    Login
                  </Link>
                  .
                </p>
                <input
                  className=" w-full px-6 py-3  font-semibold tracking-wide cursor-pointer text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                  type="submit"
                  value={loading ? "Registering..." : "Register"}
                  disabled={loading}
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Register.propTypes = {
  title: PropTypes.any,
};

export default Register;
