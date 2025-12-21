import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import VolunteerNeedsCard from "./VolunteerNeedsCard";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const VolunteerNeeds = ({ tabs }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    if (!tabs || tabs.length === 0 || !autoAdvance) return;

    const interval = setInterval(() => {
      setCurrentTab((prev) => {
        setDirection(1);
        return (prev + 1) % tabs.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [tabs, autoAdvance]);

  const handleTabChange = (index) => {
    setDirection(index > currentTab ? 1 : -1);
    setCurrentTab(index);
    setAutoAdvance(false);
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }
  const currentVolunteers = tabs[currentTab]?.volunteers || [];

  return (
    <div className="py-16 font-qs">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center">
          {tabs[currentTab]?.title || "Dự án đang chờ bạn"}
        </h2>
        <p className="w-2/3 mx-auto mt-4 text-center leading-relaxed text-gray-600">
          Hãy chọn hành trình khiến bạn muốn trao đi thời gian, sức lực và tấm lòng của mình.
        </p>
      </div>

      <div className="container mx-auto mt-16 overflow-hidden">
        <div
          key={currentTab}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-12 animate-slide-in"
          style={{
            animation: `slideIn${direction > 0 ? 'Right' : 'Left'} 1s ease-out`,
          }}
        >
          {currentVolunteers.map((volunteer) => (
            <VolunteerNeedsCard volunteer={volunteer} key={volunteer.id} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentTab === index
              ? "bg-deep-orange-500 w-8"
              : "bg-gray-400 hover:bg-gray-500"
              }`}
            aria-label={`Tab ${index + 1}`}
          />
        ))}
      </div>

      {/* See All Button */}
      <div>
        <Link
          to="/need-volunteer"
          className="flex items-center justify-center mt-6"
        >
          <Button size="lg" color="deep-orange" variant="gradient">
            Xem tất cả
          </Button>
        </Link>
      </div>
    </div>
  );
};

VolunteerNeeds.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      volunteers: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default VolunteerNeeds;
