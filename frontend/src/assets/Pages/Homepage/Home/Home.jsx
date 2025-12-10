import VolunteerNeeds from "../VolunteerNeeds/VolunteerNeeds";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { getPosts } from "../../../../utils/localApi";
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get posts count
        const posts = await getPosts();
        const postCount = posts?.length || 0;

        // Get events count (posts with category 'event' or all posts as events)
        const eventCount = posts?.filter(p => p.category === 'event')?.length || postCount;

        // Get users count
        let volunteerCount = 0;
        try {
          const users = await fetchAllUsers();
          volunteerCount = users?.length || 0;
        } catch {
          // If not admin or API fails, use a default
          volunteerCount = 50; // placeholder
        }

        setStats({
          posts: postCount,
          events: eventCount,
          volunteers: volunteerCount,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <motion.div style={{ scaleX: scrollProgress }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {/* Our Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Our Mission</h2>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600">
            "Volunteer Hub enables disadvantaged children and young adults in Vietnam
            to reach their full potential through receiving a quality education relevant to their needs"
          </p>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-300 mx-auto w-4/5" />

      {/* Our Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Events Column */}
            <div className="flex flex-col items-center p-8">
              <img src={eventIcon} alt="Events" className="w-16 h-16 mb-4" />
              <span className="text-lg font-semibold text-gray-700 mb-2">Events</span>
              <span className="text-4xl font-bold text-gray-800">{stats.events}</span>
            </div>

            {/* Posts Column */}
            <div className="flex flex-col items-center p-8">
              <img src={postIcon} alt="Posts" className="w-16 h-16 mb-4" />
              <span className="text-lg font-semibold text-gray-700 mb-2">Posts</span>
              <span className="text-4xl font-bold text-gray-800">{stats.posts}</span>
            </div>

            {/* Volunteers Column */}
            <div className="flex flex-col items-center p-8">
              <img src={volunteerIcon} alt="Volunteers" className="w-16 h-16 mb-4" />
              <span className="text-lg font-semibold text-gray-700 mb-2">Volunteers</span>
              <span className="text-4xl font-bold text-gray-800">{stats.volunteers}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-300 mx-auto w-4/5" />

      <VolunteerNeeds></VolunteerNeeds>
    </motion.div>
  );
};
Home.propTypes = {
  title: PropTypes.object.isRequired,
};
export default Home;
