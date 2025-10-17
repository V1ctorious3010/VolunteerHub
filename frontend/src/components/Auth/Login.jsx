// Import các thư viện cần thiết
import { Link, useLocation, useNavigate } from "react-router-dom"; // React Router cho navigation
import toast from "react-hot-toast"; // Thư viện hiển thị thông báo
import { useEffect, useState } from "react"; // React hooks
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icon hiển thị/ẩn password
import { useForm } from "react-hook-form"; // Thư viện quản lý form
import { Helmet } from "react-helmet"; // Quản lý document head (title, meta tags)
import PropTypes from "prop-types"; // Kiểm tra kiểu dữ liệu props
import UseAuth from '../Hook/UseAuth';
// Component Login nhận props title để set title trang
const Login = ({ title }) => {
    // Destructure các hàm authentication từ custom hook
    const { user, logIn } = UseAuth();

    // State để toggle hiển thị/ẩn password
    const [showPassword, setShowPassword] = useState(false);

    // React Hook Form để quản lý form validation và submit
    const { register, handleSubmit } = useForm();

    // Hook để navigate giữa các trang
    const navigate = useNavigate();
    const location = useLocation();

    // Hàm xử lý submit form đăng nhập bằng email/password
    const onSubmit = async (data) => {
        // Destructure email và password từ form data
        const { email, password } = data;

        try {
            // Thực hiện đăng nhập thông qua Firebase Auth
            const result = await logIn(email, password);
            console.log(result);

            // Redirect về trang trước đó hoặc trang chủ
            navigate(location?.state || "/");

            // Hiển thị thông báo thành công
            toast.success("You've been Logged In Successfully");
        } catch (err) {
            // Xử lý lỗi đăng nhập
            console.log(err);
            toast.error("Invalid credentials!"); // Thông báo lỗi credentials không hợp lệ
        }
    };
    // useEffect để kiểm tra nếu user đã đăng nhập thì redirect về trang chủ
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [navigate, user]); // Dependencies: chạy lại khi navigate hoặc user thay đổi

    // Nếu user đã đăng nhập, không render component login
    if (user) return;
    return (
        // Container chính với animation AOS (Animate On Scroll)
        <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className="">
            {/* Helmet để set title của trang */}
            <Helmet>
                <title>{title}</title>
            </Helmet>

            {/* Container chính với responsive design */}
            <div className="bg-white font-qs dark:bg-gray-900 rounded-md px-5 container mx-auto">
                {/* Layout flex cho desktop - chia làm 2 phần: hình nền và form */}
                <div className="flex justify-center gap-5 py-16 lg:h-[80vh] ">

                    {/* Phần bên phải: Form đăng nhập */}
                    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                        <div className="flex-1">
                            {/* Header của form */}
                            <div className="text-center">
                                {/* Logo */}
                                <div className="flex justify-center mx-auto">
                                    {/* <img className="md:size-48 size-32 p-0" src={logo} alt="" /> */}
                                </div>

                                {/* Title form */}
                                <p className="mt-3 font-bold text-gray-800 dark:text-gray-300">
                                    Log in to your account
                                </p>
                            </div>

                            {/* Container form */}
                            <div className="mt-8">
                                {/* Form đăng nhập với React Hook Form */}
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Input Email */}
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                                            Email Address
                                        </label>
                                        <input
                                            {...register("email", { required: true })} // Register input với validation required
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email address"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>

                                    {/* Input Password với toggle show/hide */}
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-2">
                                            <label className="font-bold text-sm text-gray-700 dark:text-gray-200">
                                                Password
                                            </label>
                                            {/* Link quên mật khẩu */}
                                            <a
                                                href="#"
                                                className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                                            >
                                                Forgot password?
                                            </a>
                                        </div>

                                        {/* Container relative để đặt icon bên trong input */}
                                        <div className="relative">
                                            <input
                                                placeholder="Enter your password"
                                                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                                type={showPassword ? "text" : "password"} // Toggle type dựa vào state
                                                name="password"
                                                {...register("password", { required: true })} // Register với validation
                                            />
                                            {/* Icon toggle show/hide password */}
                                            <span onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? (
                                                    <FaEye className="absolute top-1/3 right-2 cursor-pointer" />
                                                ) : (
                                                    <FaEyeSlash className="absolute top-1/3 right-2 cursor-pointer" />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <div className="mt-6">
                                        <input
                                            className="w-full px-4 py-2 cursor-pointer font-bold tracking-wide text-white transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-gray-400 focus:outline-none focus:bg-gray-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                            type="submit"
                                            value=" Log in"
                                        />
                                    </div>
                                </form>

                                {/* Link đến trang đăng ký */}
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
// PropTypes để validate kiểu dữ liệu của props
Login.propTypes = {
    title: PropTypes.string.isRequired, // title phải là string và bắt buộc
}

export default Login;
