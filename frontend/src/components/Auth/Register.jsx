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
  const { user, registerAccount } = UseAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // MỚI
  const { register, handleSubmit, watch } = useForm(); // THAY ĐỔI: Thêm watch để theo dõi giá trị
  const navigate = useNavigate();
  const location = useLocation();

  // MỚI: Theo dõi giá trị của trường 'role' để hiển thị các trường của tổ chức một cách có điều kiện
  const role = watch("role");

  const onSubmit = async (data) => {
    // THAY ĐỔI: Lấy tất cả các trường từ data
    const { name, email, password, confirmPassword, role, organizationName, phoneNumber, address, website } = data;

    // --- Validation ---
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) { // MỚI: Kiểm tra mật khẩu trùng khớp
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Gọi registerAccount với email và password
      const result = await registerAccount(email, password, name);
      console.log('Register result:', result);

      // THAY ĐỔI: Tạo đối tượng người dùng đầy đủ để gửi lên backend
      const userData = {
        email: result?.user?.email || email,
        fullName: name, // Đổi 'name' thành 'fullName' cho rõ ràng
        role: role,
        phoneNumber: phoneNumber,
        // Chỉ thêm các trường của tổ chức nếu vai trò là ORGANIZATION
        ...(role === 'ORGANIZATION' && {
          organizationName: organizationName,
          address: address,
          website: website,
        })
      };

      // Giả sử bạn có một endpoint để lưu thông tin người dùng vào database
      // await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);

      // JWT call (giữ nguyên nếu logic này vẫn đúng)
      const { data: jwtData } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        { email: result?.user?.email || email },
        { withCredentials: true }
      );
      console.log('JWT response:', jwtData);

      toast.success("Tạo tài khoản thành công!");
      navigate(location?.state || "/");
    } catch (err) {
      console.log('Register error:', err);
      toast.error(err?.message || "Email đã được sử dụng!");
    }
  };

  if (user) return null; // Trả về null để không render gì cả nếu đã đăng nhập

  return (
    <div data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500" className="">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section className="bg-white font-qs  mx-auto rounded-md ">
        <div className="flex justify-center px-4 py-12 lg:h-auto">
          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div className="w-full">
              <h1 className="text-4xl font-semibold tracking-wider text-gray-800 capitalize">
                Đăng ký tài khoản mới
              </h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4 mt-8"
              >
                {/* --- Các trường chung --- */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Họ và Tên</label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Nhập họ và tên của bạn"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Địa chỉ Email</label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                {/* MỚI: Trường chọn vai trò */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Bạn là?</label>
                  <select
                    {...register("role", { required: true })}
                    className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="VOLUNTEER">Tình nguyện viên</option>
                    <option value="ORGANIZATION">Tổ chức</option>
                    <option value="MANAGER">Quản lý</option>
                  </select>
                </div>

                {/* MỚI: Trường số điện thoại */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Số điện thoại</label>
                  <input
                    type="tel"
                    {...register("phoneNumber", { required: true })}
                    placeholder="Nhập số điện thoại"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                {/* --- Các trường chỉ dành cho TỔ CHỨC --- */}
                {role === 'ORGANIZATION' && (
                  <>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-800">Tên Tổ chức</label>
                      <input
                        type="text"
                        {...register("organizationName", { required: role === 'ORGANIZATION' })}
                        placeholder="Nhập tên đầy đủ của tổ chức"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-800">Địa chỉ</label>
                      <input
                        type="text"
                        {...register("address", { required: role === 'ORGANIZATION' })}
                        placeholder="Nhập địa chỉ của tổ chức"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-800">Website (Tùy chọn)</label>
                      <input
                        type="url"
                        {...register("website")}
                        placeholder="https://example.com"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                  </>
                )}


                {/* --- Mật khẩu --- */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Mật khẩu</label>
                  <div className="relative">
                    <input
                      placeholder="Nhập mật khẩu"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: true })}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                      {showPassword ? (
                        <FaEye className="absolute top-1/2 -translate-y-1/2 right-3" />
                      ) : (
                        <FaEyeSlash className="absolute top-1/2 -translate-y-1/2 right-3" />
                      )}
                    </span>
                  </div>
                </div>

                {/* MỚI: Trường xác nhận mật khẩu */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Xác nhận Mật khẩu</label>
                  <div className="relative">
                    <input
                      placeholder="Nhập lại mật khẩu"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-opacity-40"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", { required: true })}
                    />
                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer">
                      {showConfirmPassword ? (
                        <FaEye className="absolute top-1/2 -translate-y-1/2 right-3" />
                      ) : (
                        <FaEyeSlash className="absolute top-1/2 -translate-y-1/2 right-3" />
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-center text-gray-800">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    Đăng nhập
                  </Link>
                  .
                </p>

                <input
                  className="w-full px-6 py-3 font-semibold tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                  value="Đăng ký"
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
  title: PropTypes.string.isRequired, // Sửa lại: title thường là string
};

export default Register;