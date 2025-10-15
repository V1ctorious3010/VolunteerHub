/**
 * Carousel Component
 * 
 * Component để render từng slide trong Banner carousel
 * Hiển thị một background image với overlay và text content
 * 
 * Props:
 * @param {string} image - URL của background image
 * @param {string} text - Tiêu đề chính của slide
 * @param {string} paragraph - Mô tả chi tiết của slide
 */

import PropTypes from "prop-types";

/**
 * Carousel Slide Component
 * @param {Object} props - Component props
 * @param {string} props.image - Background image URL
 * @param {string} props.text - Main heading text
 * @param {string} props.paragraph - Description paragraph
 * @returns {JSX.Element} Carousel slide với background và text overlay
 */
const Carousel = ({ image, text, paragraph }) => {
  return (
    // Container - Full width và height 80vh
    <div
      className='w-full font-qs bg-center bg-cover h-[80vh]'
      style={{
        backgroundImage: `url(${image})` // Set background image từ props
      }}
    >
      {/* Overlay - Dark overlay (70% opacity) để text dễ đọc hơn */}
      <div className='flex items-center justify-center w-full h-full bg-gray-900/70'>
        {/* Content Container - Căn giữa text */}
        <div className='text-center'>
          {/* Main Heading - Tiêu đề chính */}
          <h1 className='text-3xl font-semibold text-white lg:text-4xl'>
            {text}
          </h1>
          <br />

          {/* Description Paragraph - Mô tả chi tiết */}
          <h2 className="text-gray-200 lg:text-xl mx-auto px-4 md:w-2/3">
            {paragraph}
          </h2>
          <br />
        </div>
      </div>
    </div>
  );
};

// PropTypes Validation - Đảm bảo component nhận đúng props
Carousel.propTypes = {
  image: PropTypes.string.isRequired,     // Image URL - bắt buộc
  text: PropTypes.string.isRequired,      // Heading text - bắt buộc
  paragraph: PropTypes.string.isRequired, // Description - bắt buộc
};

export default Carousel;