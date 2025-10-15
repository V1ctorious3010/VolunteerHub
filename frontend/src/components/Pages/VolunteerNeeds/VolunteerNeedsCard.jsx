/**
 * VolunteerNeedsCard Component
 * 
 * Component card hiển thị thông tin chi tiết của một volunteer opportunity
 * Sử dụng Material Tailwind components
 * 
 * Props:
 * @param {Object} volunteer - Object chứa thông tin volunteer opportunity
 * @param {string} volunteer._id - ID của volunteer post
 * @param {string} volunteer.thumbnail - URL ảnh thumbnail
 * @param {string} volunteer.post_title - Tiêu đề bài post
 * @param {string} volunteer.category - Danh mục (Healthcare, Education, etc.)
 * @param {string} volunteer.deadline - Deadline để apply
 * @param {string} volunteer.description - Mô tả ngắn về opportunity
 */

/* eslint-disable react/prop-types */
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react"; // Material Tailwind components
import { Link } from "react-router-dom"; // React Router link

/**
 * VolunteerNeedsCard Component
 * @param {Object} props - Component props
 * @param {Object} props.volunteer - Volunteer opportunity data
 * @returns {JSX.Element} Card hiển thị volunteer opportunity
 */
const VolunteerNeedsCard = ({ volunteer }) => {
  // Destructure các properties từ volunteer object
  const {
    _id,          // ID của volunteer post
    thumbnail,    // URL ảnh thumbnail
    post_title,   // Tiêu đề bài post
    category,     // Danh mục
    deadline,     // Deadline
    description   // Mô tả
  } = volunteer;

  return (
    // Container với AOS animation - fade down khi scroll
    <div
      data-aos="fade-down"
      data-aos-anchor-placement="top-bottom"
      data-aos-easing="linear"
      data-aos-duration="1000"
      className="mx-auto"
    >
      {/* Material Tailwind Card - Max width 24rem */}
      <Card className="max-w-[24rem] overflow-hidden">

        {/* Card Header - Chứa thumbnail image */}
        <CardHeader
          floated={false}     // Không có shadow
          shadow={false}      // Không có shadow effect
          color="transparent" // Background trong suốt
          className="m-0 rounded-none"
        >
          {/* Thumbnail Image - Fixed height 60 (240px) */}
          <img
            className="w-full h-60"
            src={thumbnail}
            alt={post_title} // Alt text cho accessibility
          />
        </CardHeader>

        {/* Card Body - Chứa thông tin chi tiết */}
        <CardBody>
          {/* Post Title - Fixed height để alignment */}
          <Typography className="h-16" variant="h4" color="blue-gray">
            {post_title}
          </Typography>

          {/* Category - Hiển thị với màu xanh lá */}
          <Typography className="mt-2" variant="h5" color="blue-gray">
            <span className="text-green-500">{category}</span>
          </Typography>

          {/* Description - Fixed height 16 để alignment */}
          <Typography variant="h6" color="gray" className="mt-3 h-16 font-normal">
            {description}
          </Typography>
        </CardBody>

        {/* Card Footer - Chứa action button và deadline */}
        <CardFooter className="flex items-center gap-8 justify-between">
          {/* View Details Button */}
          <div className="flex items-center -space-x-3">
            <Link to={`/post-details/${_id}`}>
              <Button color="green">View Details</Button>
            </Link>
          </div>

          {/* Deadline Display */}
          <div>
            <h2 className="font-qs font-bold">
              Deadline: {deadline}
            </h2>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VolunteerNeedsCard;
