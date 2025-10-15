/**
 * HomePage Component
 * 
 * Component chính cho trang chủ của ứng dụng VolunteerHub
 * Hiển thị Banner hero section và danh sách các nhu cầu tình nguyện
 * 
 * Features:
 * - Banner hero section với gradient animations
 * - Danh sách volunteer opportunities
 * - SEO optimization với React Helmet
 */

import Banner from "../Banner/Banner";
import VolunteerNeeds from "../VolunteerNeeds/VolunteerNeeds";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

/**
 * HomePage Component
 * @param {Object} props - Component props
 * @param {string} props.title - Tiêu đề trang hiển thị trên browser tab
 * @returns {JSX.Element} Trang chủ hoàn chỉnh
 */
const HomePage = ({ title }) => {
    return (
        <div>
            {/* Helmet - Quản lý document head cho SEO */}
            <Helmet>
                <title>{title}</title>
            </Helmet>

            {/* Banner Section - Hero section với auto-sliding */}
            <Banner />

            {/* Volunteer Needs Section - Danh sách cơ hội tình nguyện */}
            <VolunteerNeeds />
        </div>
    );
};

// PropTypes validation
HomePage.propTypes = {
    title: PropTypes.string.isRequired,
};

export default HomePage;
