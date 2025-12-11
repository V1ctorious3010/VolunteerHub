import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { ScrollRestoration } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-10 font-qs px-4 bg-[#243a5a] text-white">
            <ScrollRestoration />
            <div className="container mx-auto py-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    {/* Left: Brand */}
                    <div className="flex-1 lg:flex-none lg:w-1/3">
                        <Link to="/" className="flex items-center gap-3">
                            <div>
                                <h2 className="font-bold text-xl md:text-2xl">GiveNow</h2>
                                <p className="text-sm text-gray-200 mt-1">Nền tảng gây quỹ cộng đồng trực tuyến tiện lợi, tin cậy và minh bạch.</p>
                            </div>
                        </Link>
                    </div>

                    {/* Middle: Links + Contact */}
                    <div className="flex-1 lg:w-1/3 grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="uppercase font-bold text-sm mb-2">Giới thiệu</h3>
                            <ul className="text-sm text-gray-200 space-y-1">
                                <li><a href="#" className="hover:underline">Giới thiệu</a></li>
                                <li><a href="#" className="hover:underline">Điều khoản và điều kiện</a></li>
                                <li><a href="#" className="hover:underline">Tin tức</a></li>
                                <li><a href="#" className="hover:underline">Báo chí</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="uppercase font-bold text-sm mb-2">Liên hệ</h3>
                            <ul className="text-sm text-gray-200 space-y-2">
                                <li className="flex items-center gap-2"><FaPhoneSquareAlt className="text-white" /> <span>Hotline: <span className="text-red-400 font-semibold">0915440555</span></span></li>
                                <li className="flex items-center gap-2"><MdEmail className="text-white" /> <span>Hotro@givenow.vn</span></li>
                                <li className="flex items-center gap-2"><IoLocationSharp className="text-white" /> <span>Số 09, ngõ 04, phố Duy Tân, Cầu Giấy, Hà Nội.</span></li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="mt-6 border-t border-white/10 pt-4 text-sm text-center text-gray-200">
                    © Givenow – All Rights Reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;