import { useEffect, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import PageError from "../../ErrorPage/PageError";
import PropTypes from "prop-types";
import Loader from "../../../Components/Loader/Loader";
import LoadingGif from "../../../Components/Loader/LoadingGif";
import { Helmet } from "react-helmet";
import { getMyEvents } from "../../../../utils/postApi";

const MyVolunteerPost = ({ title }) => {
  const user = useSelector(s => s.auth.user);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const [myVolunteerPost, setMyVolunteerPost] = useState([]);
  // console.log(myVolunteerPost);
  useEffect(() => {
    const volunteers = async () => {
      try {
        const resp = await getMyEvents();
        console.log(resp);
        let data = resp?.data;
        // Normalize response to an array regardless of server shape
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.content)) data = data.content;
          else if (data && Array.isArray(data.data)) data = data.data;
          else if (data && typeof data === 'object') data = [data];
          else data = [];
        }
        const normalized = data.map(e => ({
          id: e.id,
          title: e.title,
          category: e.category || 'General',
          startTime: e.startTime,
          endTime: e.endTime,
          location: e.location,
          status: e.status,
        }));
        setMyVolunteerPost(normalized);
      } catch (err) {
        console.error('Failed to load my events', err);
        setMyVolunteerPost([]);
      }
    };
    volunteers();
  }, [user?.id, user?.name]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // No backend delete endpoint is implemented here — simulate removal from UI
        Swal.fire({
          title: "Deleted!",
          text: "The item has been removed locally.",
          icon: "success",
        });
        const remaining = myVolunteerPost.filter((post) => post.id !== id);
        setMyVolunteerPost(remaining);
        navigate(`/manage-my-post`);
      }
    });
  };

  // Loading:
  const navigation = useNavigation();
  if (navigation.state === "loading") return <Loader />;

  return (
    <div className="container font-qs mx-auto space-y-5">
      <Helmet>
        <title>
          {title}
        </title>
      </Helmet>
      {myVolunteerPost.length > 0 ? (
        <div>
          <h2 className="text-5xl font-bold my-6 text-center mt-6">
            Tổng số sự kiện: {myVolunteerPost.length}
          </h2>
          <div className="hidden md:block">
            <div className="overflow-x-auto ">
              <table className="table border-collapse border border-gray-400">
                {/* head */}
                <thead>
                  <tr className="text-white raleway text-base bg-[#DE00DF]">
                    <th></th>
                    <th>Tên sự kiện</th>
                    <th>Phân loại </th>
                    <th>Thời gian bắt đầu </th>
                    <th>Thời gian kết thúc</th>
                    <th>Địa điểm</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {myVolunteerPost.map((post, idx) => (
                    <tr className="border border-gray-300" key={post.id}>
                      <th className="font-semibold">{idx + 1}</th>
                      <td className="font-semibold">{post.title}</td>
                      <td className="font-semibold">{post.category}</td>
                      <td className="font-semibold">{post.startTime}</td>
                      <td className="font-semibold">{post.endTime}</td>
                      <td className="font-semibold">{post.location}</td>
                      <td className="font-semibold">{post.status}</td>

                      <td>
                        <div className="flex items-center gap-6">
                          <Link to={`/update-my-post/${post.id}`}>
                            <MdEdit className="size-6" />
                          </Link>
                          <button onClick={() => handleDelete(post.id)}>
                            <MdDelete className="size-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className=" md:hidden">
              <div className="overflow-x-auto ">
                <table className="table border-collapse border border-gray-400">
                  {/* head */}
                  <thead>
                    <tr className="text-white raleway text-base bg-[#DE00DF]">
                      <th>Tên sự kiện </th>
                      <th>Phân loại</th>
                      <th>Hành dộng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {myVolunteerPost.map((post) => (
                      <tr className="border border-gray-300" key={post.id}>
                        <td>{post.title}</td>
                        <td>{post.category}</td>
                        <td>
                          {((post.orgEmail && post.orgEmail === user?.email) || (post.orgName && post.orgName === user?.name)) ? (
                            <div className="flex items-center gap-6">
                              <Link to={`/update-my-post/${post.id}`}>
                                <MdEdit className="size-6" />
                              </Link>
                              <button onClick={() => handleDelete(post.id)}>
                                <MdDelete className="size-6" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : showLoader ? (
        <LoadingGif></LoadingGif>
      ) : (
        <PageError></PageError>
      )}
    </div>
  );
};
MyVolunteerPost.propTypes = {
  title: PropTypes.object.isRequired,
};
export default MyVolunteerPost;
