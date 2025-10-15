/**
 * VolunteerNeeds Component
 * 
 * Component hiển thị danh sách các cơ hội tình nguyện
 * Fetch data từ backend API và hiển thị dưới dạng grid
 * 
 * Features:
 * - Fetch volunteers data từ API
 * - Grid responsive layout (1/2/3 columns)
 * - AOS animations
 * - Link to "See All" page
 */

import { useEffect, useState } from "react";
import VolunteerNeedsCard from "./VolunteerNeedsCard"; // Card component cho từng volunteer
import axios from "axios"; // HTTP client để gọi API
import { Link } from "react-router-dom"; // Navigation link
import { Button } from "@material-tailwind/react"; // Material Tailwind button

/**
 * VolunteerNeeds Component
 * @returns {JSX.Element} Section hiển thị danh sách volunteer opportunities
 */
const VolunteerNeeds = () => {
  // State để lưu trữ danh sách volunteers từ API
  const [volunteers, setVolunteers] = useState([]);

  // useEffect - Fetch data khi component mount
  useEffect(() => {
    // Async function để fetch volunteers
    const fetchVolunteers = async () => {
      try {
        // Gọi API để lấy danh sách volunteers
        // VITE_API_URL được định nghĩa trong .env file
        const { data } = await axios(
          `${import.meta.env.VITE_API_URL}/volunteers`
        );

        // Cập nhật state với data nhận được
        setVolunteers(data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    // Gọi function fetch
    fetchVolunteers();
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  return (
    // Main container với padding
    <div className="py-16 font-qs">
      {/* Header Section với AOS animation */}
      <div
        data-aos="fade-left" // Animation từ phải sang trái
        data-aos-anchor-placement="top-bottom"
        data-aos-easing="linear"
        data-aos-duration="1000"
        className="container mx-auto"
      >
        {/* Section Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-center">
          Volunteer Needs Now
        </h2>

        {/* Section Description */}
        <p className="w-2/3 mx-auto mt-4 text-center leading-relaxed text-gray-600">
          Volunteer Needs Now is the pulse of our community engagement. This
          section highlights current opportunities where your time and skills
          can make an immediate impact.
        </p>
      </div>

      {/* Grid Container - Hiển thị danh sách cards */}
      {/* 
        Grid responsive:
        - Mobile (default): 1 column
        - Tablet (md): 2 columns
        - Desktop (lg): 3 columns
      */}
      <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-12">
        {/* Map qua mảng volunteers và render từng card */}
        {volunteers.map((volunteer) => (
          <VolunteerNeedsCard
            volunteer={volunteer} // Pass volunteer data to card
            key={volunteer._id}   // Unique key cho React list
          />
        ))}
      </div>

      {/* See All Button Section */}
      <div>
        <Link
          to="/need-volunteer" // Navigate đến trang full list
          className="flex items-center justify-center mt-8"
        >
          {/* Material Tailwind Button */}
          <Button size="lg" color="deep-orange" variant="gradient">
            See All
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VolunteerNeeds;
