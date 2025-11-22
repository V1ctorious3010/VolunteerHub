import { Link, useNavigation } from "react-router-dom";
import VolunteerNeedsCard from "../Homepage/VolunteerNeeds/VolunteerNeedsCard";
import { useEffect, useState } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { getPosts } from "../../../utils/localApi";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import LoadingGif from "../../Components/Loader/LoadingGif";

const NeedVolunteer = ({ title }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const getData = async () => {
      const all = await getPosts();
      // normalize posts
      let mapped = all.map(p => ({
        thumbnail: p.thumbnail,
        id: p.id,
        postTitle: p.title || p.postTitle,
        orgName: p.owner?.name || p.orgName || '',
        category: p.category || 'General',
        deadline: p.date || p.deadline,
        location: p.location || '',
        noOfVolunteer: p.slots || p.noOfVolunteer || 0,
        description: p.description || '',
      }));
      // apply search
      if (search) {
        mapped = mapped.filter(m => m.postTitle?.toLowerCase().includes(search.toLowerCase()));
      }
      if (category) {
        mapped = mapped.filter(m => m.category === category);
      }
      if (sort === 'asc') {
        mapped.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      } else if (sort === 'desc') {
        mapped.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      }
      setVolunteers(mapped);
    };
    getData();
  }, [search, category, sort]);
  const [view, setView] = useState("module");

  const [gridView, setGridView] = useState(true);
  const [tableView, setTableView] = useState(false);

  const handleChange = (event, nextView) => {
    // Prevent deselecting both when clicking the active toggle
    if (nextView === null) return;
    setView(nextView);
    if (nextView === "module") {
      setGridView(true);
      setTableView(false);
    } else if (nextView === "list") {
      setGridView(false);
      setTableView(true);
    }
  };

  const handleSearch = () => {
    console.log("searching text is", searchText);
    setSearch(searchText);
  };

  const handleGrid = (e) => {
    setTableView(!e);
    setGridView(e);
  };
  const handleTable = (e) => {
    setTableView(e);
    setGridView(!e);
    console.log(tableView);
  };
  const navigation = useNavigation();
  if (navigation.state === "loading") return <LoadingGif />;
  return (
    <div className="py-16 font-qs">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        data-aos="fade-left"
        data-aos-anchor-placement="top-bottom"
        data-aos-easing="linear"
        data-aos-duration="1500"
        className="container mx-auto mb-6"
      >
        <h2 className="text-2xl md:text-5xl font-bold text-center ">
          Join Our Community: Volunteer Opportunities
        </h2>
        <p className="w-2/3 mx-auto md:text-lg mt-4 text-center leading-relaxed ">
          Discover meaningful ways to contribute to our mission. Explore diverse
          volunteer roles and make a difference in your community. Join us in
          creating positive change today.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between container mx-auto">
        <div
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="flex container mx-auto justify-center my-8 md:justify-start aos-init aos-animate"
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            aria-label="view"
            className="bg-gray-200"
          >
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div>
            <select
              name="category"
              id="category"
              className="border p-3 input input-bordered rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Social Service">Social Service</option>
              <option value="Animal Welfare">Animal Welfare</option>
              <option value="Environment">Environment</option>
              <option value="Food Security">Food Security</option>
            </select>
          </div>
          <div>
            <select
              name="deadlineSort"
              id="deadlineSort"
              className="border p-3 input input-bordered rounded-md"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">No Sorting</option>
              <option value="asc">Deadline: Earliest First</option>
              <option value="desc">Deadline: Latest First</option>
            </select>
          </div>
        </div>
        <div
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="flex container mx-auto justify-center my-8 md:justify-end aos-init aos-animate"
        >
          <div className="flex p-1  border rounded-lg    focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
            <input
              className="px-6 py-2 border-none text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
              type="text"
              name="search"
              placeholder="Enter the Post Title"
              aria-label="Enter the Post Title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              type="button"
              className="inline-block rounded-lg bg-warning px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-warning-3 transition duration-150 ease-in-out hover:bg-warning-accent-300 hover:shadow-warning-2 focus:bg-warning-accent-300 focus:shadow-warning-2 focus:outline-none focus:ring-0 active:bg-warning-600 active:shadow-warning-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {volunteers.length === 0 && showLoader ? (
        <LoadingGif></LoadingGif>
      ) : (
        <div>
          <div className={gridView ? "block" : "hidden"}>
            <div className=" container mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-y-12">
              {volunteers.map((volunteer) => (
                <VolunteerNeedsCard
                  volunteer={volunteer}
                  key={volunteer.id}
                ></VolunteerNeedsCard>
              ))}
            </div>
          </div>
          <div className={!tableView ? "hidden" : "block"}>
            <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className="container mx-auto mt-16">
              <div className="hidden md:block">
                <div className="overflow-x-auto ">
                  <table className="table border-collapse border border-gray-400">
                    {/* head */}
                    <thead>
                      <tr className="text-white raleway text-base bg-[#DE00DF]">
                        <th></th>
                        <th>Post Title</th>
                        <th>Posted By</th>
                        <th>Category </th>
                        <th>Deadline </th>
                        <th>Location</th>
                        <th>Volunteer Needed</th>
                        <th>View Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {volunteers.map((post, idx) => (
                        <tr className="border border-gray-300" key={post.id}>
                          <th className="font-semibold">{idx + 1}</th>
                          <td className="font-semibold">{post.postTitle}</td>
                          <td className="font-semibold">
                            {post.orgName}
                          </td>
                          <td className="font-semibold">{post.category}</td>
                          <td className="font-semibold">{post.deadline}</td>
                          <td className="font-semibold">{post.location}</td>
                          <td className="font-semibold text-center">
                            {post.noOfVolunteer}
                          </td>
                          <td>
                            <Link to={`/post-details/${post.id}`}>
                              <Button color="green">View Details</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Small  */}
              <div>
                <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className=" md:hidden">
                  <div className="overflow-x-auto ">
                    <table className="table border-collapse border border-gray-400">
                      {/* head */}
                      <thead>
                        <tr className="text-white raleway text-base bg-[#DE00DF]">
                          <th>Post Title </th>
                          <th>Deadline</th>
                          <th>View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        {volunteers.map((post) => (
                          <tr className="border border-gray-300" key={post.id}>
                            <td>{post.postTitle}</td>
                            <td>{post.deadline}</td>
                            <td>
                              <Link to={`/post-details/${post.id}`}>
                                <Button color="green">View Details</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
NeedVolunteer.propTypes = {
  title: PropTypes.string.isRequired,
};
export default NeedVolunteer;
