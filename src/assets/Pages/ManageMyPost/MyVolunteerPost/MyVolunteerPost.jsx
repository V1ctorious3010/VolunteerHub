import axios from "axios";
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
  console.log(myVolunteerPost);
  useEffect(() => {
    const volunteers = async () => {
      // load posts and filter by owner matching current user id or name
      const { getPosts } = await import('../../../../utils/localApi');
      const all = await getPosts();
      const mine = all.filter(p => (p.owner && p.owner.id && user && p.owner.id === user.id) || (p.owner && p.owner.name === user?.name));
      setMyVolunteerPost(mine);
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
        // simulate delete by removing from localStorage overlay
        const { deleteLocalPost } = await import('../../../../utils/localApi');
        deleteLocalPost(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your post has been deleted.",
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
            Total Posts: {myVolunteerPost.length}
          </h2>
          <div className="hidden md:block">
            <div className="overflow-x-auto ">
              <table className="table border-collapse border border-gray-400">
                {/* head */}
                <thead>
                  <tr className="text-white raleway text-base bg-[#DE00DF]">
                    <th></th>
                    <th>Post Title</th>
                    <th>Category </th>
                    <th>Deadline </th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {myVolunteerPost.map((post, idx) => (
                    <tr className="border border-gray-300" key={post.id}>
                      <th className="font-semibold">{idx + 1}</th>
                      <td className="font-semibold">{post.postTitle}</td>
                      <td className="font-semibold">{post.category}</td>
                      <td className="font-semibold">{post.deadline}</td>
                      <td className="font-semibold">{post.location}</td>

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
                      <th>Post Title </th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {myVolunteerPost.map((post) => (
                      <tr className="border border-gray-300" key={post.id}>
                        <td>{post.postTitle}</td>
                        <td>{post.category}</td>
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
