import { Link, useNavigation } from "react-router-dom";
import VolunteerNeedsCard from "../Homepage/VolunteerNeeds/VolunteerNeedsCard";
import { useEffect, useState } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Button, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { getEvents, getRecentActivityEvents, getFeaturedEvents } from "../../../utils/localApi";
import { Helmet } from "react-helmet";
import { truncateChars } from '../../../utils/textUtils';
import PropTypes from "prop-types";

const NeedVolunteer = ({ title }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
      let page;
      if (sort === 'recent') {
        page = await getRecentActivityEvents(pageNumber, 9, search || '', category || '');
      } else if (sort === 'featured') {
        page = await getFeaturedEvents(pageNumber, 9, search || '', category || '');
      } else {
        let sortBy = '';
        if (sort === 'asc') sortBy = 'startTime,ASC';
        else if (sort === 'desc') sortBy = 'startTime,DESC';
        else if (sort === 'newly') sortBy = 'approvedAt,desc';

        page = await getEvents({ keyword: search || '', category: category || '', location: '', start: '', page: pageNumber, sortBy });
      }
      const events = Array.isArray(page?.content) ? page.content : [];
      const mapped = events.map(e => ({
        thumbnail: e.thumbnail,
        id: e.id,
        title: e.title,
        orgName: e.orgName || e.orgEmail || '',
        category: e.category || 'General',
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location || '',
        noOfVolunteer: e.noOfVolunteer || 0,
        remaining: e.remaining,
        description: e.description || '',
        status: e.status || e.statusName || e.eventStatus || '',
      }));

      setVolunteers(mapped);
      setTotalPages(page?.totalPages || 0);
    };
    getData();
  }, [search, category, sort, pageNumber]);

  const handlePrev = () => {
    setPageNumber(p => Math.max(0, p - 1));
  };

  const handleNext = () => {
    setPageNumber(p => Math.min((totalPages || 1) - 1, p + 1));
  };
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
  const formatDateOnly = (v) => {
    if (!v) return "";
    const s = String(v).trim();
    const datePart = s.split(" ")[0];
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(datePart)) return datePart;
    const d = new Date(s);
    if (isNaN(d)) return datePart;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }
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
          Các dự án đang cần người
        </h2>
        <p className="w-2/3 mx-auto md:text-lg mt-4 text-center leading-relaxed ">
          Hãy chọn dự án mà các bạn quan tâm nhất
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
              <option value="">Tất cả danh mục</option>
              <option value="Y tế">Y tế</option>
              <option value="Giáo dục">Giáo dục</option>
              <option value="Xã hội">Xã hội</option>
              <option value="Động vật hoang dã">Động vật hoang dã</option>
              <option value="Môi trường">Môi trường</option>
              <option value="Cứu trợ lương thực">Cứu trợ lương thực</option>
              <option value="Khác">Khác</option>
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
              <option value="newly">Mới nhất</option>
              <option value="recent">Hoạt động gần đây</option>
              <option value="featured">Nổi bật</option>
              <option value="desc">Cũ nhất</option>
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
              placeholder="Tìm theo tên sự kiện"
              aria-label=""
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              type="button"
              className="inline-block rounded-lg bg-warning px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-warning-3 transition duration-150 ease-in-out hover:bg-warning-accent-300 hover:shadow-warning-2 focus:bg-warning-accent-300 focus:shadow-warning-2 focus:outline-none focus:ring-0 active:bg-warning-600 active:shadow-warning-2 motion-reduce:transition-none"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      {volunteers.length === 0 && showLoader ? (
        <div className="flex justify-center items-center py-16">
          <Spinner className="h-12 w-12" />
        </div>
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
                  <table className="table border-collapse border border-gray-400 text-center">
                    {/* head */}
                    <thead>
                      <tr className="text-white raleway text-base bg-[#2986cc]">
                        <th></th>
                        <th>Tên sự kiên</th>
                        <th>Tổ chức</th>
                        <th>Thể loại </th>
                        <th>Bắt đầu </th>
                        <th>Kết thúc </th>
                        <th>Địa điểm</th>
                        <th>Số lượng</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {volunteers.map((post, idx) => (
                        <tr className="border border-gray-300" key={post.id}>
                          <th className="font-semibold">{idx + 1}</th>
                          <td className="font-semibold">{truncateChars(post.title, 15)}</td>
                          <td className="font-semibold">
                            {post.orgName}
                          </td>
                          <td className="font-semibold">{post.category}</td>
                          <td className="font-semibold">{formatDateOnly(post.startTime)}</td>
                          <td className="font-semibold">{formatDateOnly(post.endTime)}</td>
                          <td className="font-semibold">{post.location}</td>
                          <td className="font-semibold text-center">
                            {post.noOfVolunteer}
                          </td>
                          <td>
                            <Link to={`/post-details/${post.id}`} state={{ event: post }}>
                              <Button color="green">Chi tiết</Button>
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
                    <table className="table border-collapse border border-gray-400 text-center">
                      {/* head */}
                      <thead>
                        <tr className="text-white raleway text-base bg-[#2986cc]">
                          <th>Tên </th>
                          <th>Hạn cuối</th>
                          <th>Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        {volunteers.map((post) => (
                          <tr className="border border-gray-300 justify-center" key={post.id}>
                            <td>{truncateChars(post.title, 15)}</td>
                            <td>{formatDateOnly(post.startTime)}</td>
                            <td>
                              <Link to={`/post-details/${post.id}`} state={{ event: post }}>
                                <Button color="green">Chi tiết</Button>
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
          <div className="flex justify-center gap-3 my-4">
            <button onClick={handlePrev} className="px-3 py-2 bg-gray-200 rounded" disabled={pageNumber <= 0}>Trước</button>
            <div className="px-3 py-2">Trang {pageNumber + 1} / {totalPages || 1}</div>
            <button onClick={handleNext} className="px-3 py-2 bg-gray-200 rounded" disabled={pageNumber >= (totalPages - 1)}>Sau</button>
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
