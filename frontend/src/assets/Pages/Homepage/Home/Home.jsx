import VolunteerNeeds from "../VolunteerNeeds/VolunteerNeeds";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { getEvents, getStatistics, getRecentActivityEvents, getFeaturedEvents } from "../../../../utils/localApi";
import { fetchAllUsers } from "../../../../features/auth/authSlice";

// Import icons
import eventIcon from "../../../images/event.svg";
import postIcon from "../../../images/post.svg";
import volunteerIcon from "../../../images/volunteer.svg";

const Home = ({ title }) => {
  const { scrollProgress } = useScroll();

  // State for impact stats
  const [stats, setStats] = useState({
    posts: 0,
    events: 0,
    volunteers: 0,
  });

  // State for tabs data
  const [tabs, setTabs] = useState([
    { title: "Sự kiện mới công bố", volunteers: [] },
    { title: "Sự kiện hoạt động gần đây", volunteers: [] },
    { title: "Sự kiện thu hút", volunteers: [] },
  ]);

  // State for interactive process
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Prefer statistics endpoint if available
        const statsResp = await getStatistics();
        setStats({
          posts: statsResp.totalPosts || 0,
          events: statsResp.totalEvents || 0,
          volunteers: statsResp.totalVolunteers || 0,
        });
        console.log(statsResp);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadAllTabs = async () => {
      try {
        // Fetch all 3 APIs in parallel
        const [newlyApproved, recentActivity, featured] = await Promise.all([
          getEvents({ sortBy: "approvedAt,desc", page: 0 }),
          getRecentActivityEvents(0, 3),
          getFeaturedEvents(0, 3),
        ]);

        const mapEvents = (events) =>
          (Array.isArray(events) ? events : events?.content || []).map((e) => ({
            id: e.id,
            thumbnail: e.thumbnail,
            title: e.title,
            category: e.category || "General",
            startTime: e.startTime || e.deadline,
            description: e.description || "",
            status: e.status || e.statusName || e.eventStatus || "",
          }));

        setTabs([
          { title: "Sự kiện mới công bố", volunteers: mapEvents(newlyApproved).slice(0, 3) },
          { title: "Sự kiện hoạt động gần đây", volunteers: mapEvents(recentActivity).slice(0, 3) },
          { title: "Sự kiện nhiều lượt tương tác nhất", volunteers: mapEvents(featured).slice(0, 3) },
        ]);
      } catch (error) {
        console.error("Failed to load tabs:", error);
      }
    };
    loadAllTabs();
  }, []);

  return (
    <motion.div style={{ scaleX: scrollProgress }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {/* Hero Section with Background Image */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">Nền tảng cộng đồng thiện nguyện trực tuyến</h2>
          <p className="text-lg md:text-2xl leading-relaxed text-white font-medium drop-shadow-md bg-black/20 rounded-lg p-6 backdrop-blur-sm">
            "GoodHands tạo cầu nối giữa tình nguyện viên và các cơ hội tình nguyện phù hợp tại Việt Nam, giúp mọi người phát huy tối đa khả năng đóng góp của mình cho xã hội."
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Quy trình tham gia
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Chỉ với 4 bước đơn giản, bạn đã có thể bắt đầu hành trình thiện nguyện
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200 z-0"></div>
            
            {/* Step 1 */}
            <div 
              className="relative text-center cursor-pointer"
              onMouseEnter={() => setActiveStep(1)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="relative z-10">
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 min-h-[320px] flex flex-col ${
                  activeStep === 1 ? 'border-blue-500 shadow-xl' : 'border-gray-200'
                }`}>
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Đăng ký</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    Tạo tài khoản và hoàn thiện hồ sơ cá nhân của bạn
                  </p>
                  <div className="h-8 mt-4">
                    {activeStep === 1 && (
                      <div className="text-blue-600 text-sm font-semibold animate-fade-in">
                        ✨ Miễn phí và nhanh chóng
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              className="relative text-center cursor-pointer"
              onMouseEnter={() => setActiveStep(2)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="relative z-10">
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 min-h-[320px] flex flex-col ${
                  activeStep === 2 ? 'border-green-500 shadow-xl' : 'border-gray-200'
                }`}>
                  <div className="bg-gradient-to-br from-green-400 to-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Khám phá</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    Tìm kiếm sự kiện tình nguyện phù hợp với bạn
                  </p>
                  <div className="h-8 mt-4">
                    {activeStep === 2 && (
                      <div className="text-green-600 text-sm font-semibold animate-fade-in">
                        🔍 Hàng trăm sự kiện đa dạng
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className="relative text-center cursor-pointer"
              onMouseEnter={() => setActiveStep(3)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="relative z-10">
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 min-h-[320px] flex flex-col ${
                  activeStep === 3 ? 'border-purple-500 shadow-xl' : 'border-gray-200'
                }`}>
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Đăng ký tham gia</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    Gửi đơn và chờ xác nhận từ ban tổ chức
                  </p>
                  <div className="h-8 mt-4">
                    {activeStep === 3 && (
                      <div className="text-purple-600 text-sm font-semibold animate-fade-in">
                        📝 Quy trình đơn giản
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div 
              className="relative text-center cursor-pointer"
              onMouseEnter={() => setActiveStep(4)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="relative z-10">
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 min-h-[320px] flex flex-col ${
                  activeStep === 4 ? 'border-orange-500 shadow-xl' : 'border-gray-200'
                }`}>
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Lan tỏa</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    Tham gia và chia sẻ khoảnh khắc ý nghĩa
                  </p>
                  <div className="h-8 mt-4">
                    {activeStep === 4 && (
                      <div className="text-orange-600 text-sm font-semibold animate-fade-in">
                        💖 Tạo impact thật sự
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-300 mx-auto w-4/5" />

      <VolunteerNeeds tabs={tabs} />

      {/* Divider */}
      <hr className="border-gray-300 mx-auto w-4/5" />

      {/* Statistics Section - Moved to End */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Những con số biết nói
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Cộng đồng GoodHands đang lớn mạnh mỗi ngày
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Events Column */}
            <motion.div 
              className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <img src={eventIcon} alt="Events" className="w-12 h-12" />
              </div>
              <span className="text-lg font-semibold text-gray-700 mb-2">Dự án</span>
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {stats.events}
              </span>
            </motion.div>

            {/* Posts Column */}
            <motion.div 
              className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="bg-gradient-to-br from-green-100 to-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <img src={postIcon} alt="Posts" className="w-12 h-12" />
              </div>
              <span className="text-lg font-semibold text-gray-700 mb-2">Bài viết</span>
              <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                {stats.posts}
              </span>
            </motion.div>

            {/* Volunteers Column */}
            <motion.div 
              className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <img src={volunteerIcon} alt="Volunteers" className="w-12 h-12" />
              </div>
              <span className="text-lg font-semibold text-gray-700 mb-2">Tình nguyện viên</span>
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {stats.volunteers}
              </span>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
Home.propTypes = {
  title: PropTypes.object.isRequired,
};
export default Home;
