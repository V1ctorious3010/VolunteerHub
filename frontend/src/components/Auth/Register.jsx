import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import UseAuth from "../Hook/UseAuth";
import axios from "axios";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
const Register = ({ title }) => {
  const { user, registerAccount, updateUserProfile } = UseAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    const { name, email, photo, password } = data;

    if (password.length < 6) {
      toast.error("Your Password Length must be at least 6 character");
      return;
    } else if (!/[A-Z]/.test(password)) {
      toast.error(
        "Your Password Must have an Uppercase letter in the password"
      );
      return;
    } else if (!/[a-z]/.test(password)) {
      toast.error(
        "Your Password Must have an Lowercase letter in the password"
      );
      return;
    }
    try {
      const result = await registerAccount(email, password);
      console.log(result);
      await updateUserProfile(name, email, photo);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(data);
      toast.success("Account created Successfully");
      navigate(location?.state || "/");
    } catch (err) {
      console.log(err);
      toast.error("Email Already In use !");
    }
  };
  if (user) return;
  return (
    <div data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500" className="">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section className="bg-white font-qs container mx-auto rounded-md ">
        <div className="flex justify-center px-4 py-12 lg:h-[90vh]  ">

          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div className="w-full">
              <h1 className="text-4xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                Create Your Own Account for Free.
              </h1>

              <p className="mt-4 text-gray-800 dark:text-gray-400">
                Let’s get you all set up so you can verify your personal account
                and begin setting up your profile.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4 mt-8"
              >
                <div>
                  <label className="block mb-2 font-semibold  text-gray-800 dark:text-gray-200">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Enter your name"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                    Email address
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Enter your email address"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                    Photo URL
                  </label>
                  <input
                    {...register("photo", { required: true })}
                    type="url"
                    placeholder="Enter your photo url"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                    Password
                  </label>
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
                <p className="text-center text-gray-800">
                  Already have an account ?{" "}
                  <Link
                    to="/login"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    Login
                  </Link>
                  .
                </p>
                <input
                  className=" w-full px-6 py-3  font-semibold tracking-wide cursor-pointer text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                  value="Register"
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
  title: PropTypes.object.isRequired,
}
export default Register;
