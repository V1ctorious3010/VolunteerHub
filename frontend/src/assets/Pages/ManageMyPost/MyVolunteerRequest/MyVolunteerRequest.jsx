import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getRegistrations, deleteRegistration } from '../../../../utils/postApi';
import { GiCancel } from "react-icons/gi";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import PageError from "../../ErrorPage/PageError";
import Loader from "../../../Components/Loader/Loader";
import LoadingGif from "../../../Components/Loader/LoadingGif";
import { Helmet } from "react-helmet";

const MyVolunteerRequest = ({ title }) => {
  const [showLoader, setShowLoader] = useState(true);
  // console.log(showLoader);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const user = useSelector(s => s.auth.user);
  const navigate = useNavigate();
  const [myVolunteerRequest, setMyVolunteerRequest] = useState([]);
  // console.log(myVolunteerRequest);
  useEffect(() => {
    const volunteers = async () => {
      try {
        const resp = await getRegistrations();
        const content = resp?.data?.content || [];
        // backend should return registrations for current user; use content directly
        const mine = content;
        setMyVolunteerRequest(mine);
      } catch (err) {
        setMyVolunteerRequest([]);
      }
    };
    volunteers();
  }, [user?.email, user?.id]);

  const handleCancel = (id) => {
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
        try {
          await deleteRegistration(id);
          const remaining = myVolunteerRequest.filter((post) => post.registrationId !== id && post.id !== id);
          setMyVolunteerRequest(remaining);
          navigate(`/manage-my-post`);
        } catch (err) {
          Swal.fire('Error', 'Unable to cancel registration', 'error');
        }
      }
    });
  };
  const navigation = useNavigate();
  if (navigation.state === "loading") return <Loader />;
  return (
    <div className="container font-qs mx-auto space-y-5">
      <Helmet>
        <title>
          {title}
        </title>
      </Helmet>
      {myVolunteerRequest.length > 0 ? (
        <div>
          <h2 className="text-5xl my-6 font-bold text-center mt-6">
            Total Requests: {myVolunteerRequest.length}
          </h2>
          <div className="hidden md:block">
            <div className="overflow-x-auto ">
              <table className="table border-collapse border border-gray-400">
                {/* head */}
                <thead>
                  <tr className="text-white raleway text-base bg-[#2986cc]">
                    <th></th>
                    <th>Sự kiện</th>
                    <th>Email tổ chức </th>
                    <th>Thời gian bắt đầu </th>
                    <th>Địa điểm</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {myVolunteerRequest.map((post, idx) => (
                    <tr className="border border-gray-300" key={post.registrationId}>
                      <th className="font-semibold">{idx + 1}</th>
                      <td className="font-semibold">{post.eventTitle}</td>
                      <td className="font-semibold">{post.organizerEmail}</td>
                      <td className="font-semibold">{post.eventStartTime}</td>
                      <td className="font-semibold">{post.eventLocation}</td>

                      <td>
                        <div className="flex items-center gap-6">
                          <GiCancel
                            title="Cancel Request"
                            onClick={() => handleCancel(post.registrationId)}
                            className="size-6 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className=" md:hidden">
            <div className="overflow-x-auto ">
              <table className="table border-collapse border border-gray-400">
                {/* head */}
                <thead>
                  <tr className="text-white raleway text-base bg-[#DE00DF]">
                    <th>Title </th>
                    <th>Start Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {myVolunteerRequest.map((post) => (
                    <tr className="border border-gray-300" key={post.registrationId}>
                      <td>{post.eventTitle}</td>
                      <td>{post.eventStartTime}</td>
                      <td>
                        <div className="flex items-center gap-6">
                          <GiCancel
                            title="Cancel Request"
                            onClick={() => handleCancel(post.registrationId)}
                            className="size-6 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
MyVolunteerRequest.propTypes = {
  title: PropTypes.object.isRequired,
};
export default MyVolunteerRequest;
