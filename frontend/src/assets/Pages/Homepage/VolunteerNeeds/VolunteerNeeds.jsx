import { useEffect, useState } from "react";
import VolunteerNeedsCard from "./VolunteerNeedsCard";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { getPosts } from "../../../../utils/localApi";
const VolunteerNeeds = () => {
  const [volunteers, setVolunteers] = useState([]);
  useEffect(() => {
    const load = async () => {
      const all = await getPosts();
      // map base posts to expected shape
      const mapped = all.map(p => ({
        id: p.id,
        thumbnail: p.thumbnail,
        postTitle: p.title || p.postTitle,
        category: p.category || 'General',
        deadline: p.date || p.deadline,
        description: p.description || '',
      }));
      setVolunteers(mapped);
    };
    load();
  }, []);
  // console.log(volunteers)
  return (
    <div

      className="py-16 font-qs"
    >
      <div data-aos="fade-left"
        data-aos-anchor-placement="top-bottom"
        data-aos-easing="linear"
        data-aos-duration="1000" className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center ">
          Volunteer Needs Now
        </h2>
        <p className="w-2/3 mx-auto mt-4 text-center leading-relaxed text-gray-600">
          Volunteer Needs Now is the pulse of our community engagement. This
          section highlights current opportunities where your time and skills
          can make an immediate impact.
        </p>
      </div>

      <div className=" container mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-12">
        {volunteers.map((volunteer) => (
          <VolunteerNeedsCard
            volunteer={volunteer}
            key={volunteer.id}
          ></VolunteerNeedsCard>
        ))}
      </div>
      <div>
        <Link
          to="/need-volunteer"
          className="flex items-center justify-center mt-8"
        >
          <Button size="lg" color="deep-orange" variant="gradient">
            See All
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VolunteerNeeds;
