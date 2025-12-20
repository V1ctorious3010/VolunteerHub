import { Button, Typography, Spinner } from "@material-tailwind/react";
import { ScrollRestoration, useLoaderData, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { ROLE } from "../../../constants/roles";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { useState } from "react";
import Swal from 'sweetalert2';
import { deleteEventByAdmin } from "../../../utils/adminApi";


const PostDetails = ({ title2 }) => {
  const loaderPost = useLoaderData();
  const location = useLocation();
  const statePost = location?.state?.event || location?.state?.post || null;
  const post = loaderPost || statePost || {};
  const user = useSelector(s => s.auth.user);
  const navigate = useNavigate();
  const isVolunteer = user?.role === ROLE.VOLUNTEER || (Array.isArray(user?.roles) && user.roles.includes(ROLE.VOLUNTEER));
  const isAdmin = user?.role === ROLE.ADMIN;
  const [deleting, setDeleting] = useState(false);
  const {
    id,
    title,
    category,
    location: postLocation,
    thumbnail,
    noOfVolunteer,
    remaining,
    startTime,
    endTime,
    description,
    orgEmail,
    orgName,
    status,
    statusName,
    eventStatus
  } = post || {};
  const postStatus = status || statusName || eventStatus || "";
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
  const formattedStart = formatDateOnly(startTime);
  const formattedEnd = formatDateOnly(endTime);
  // console.log(post);
  const handleVolunteer = () => {
    // console.log("I want to be a volunteer !");
    const available = typeof remaining !== 'undefined' ? remaining : noOfVolunteer;
    if (available <= 0) {
      toast.error("Sự kiện đã đủ người !");
      return
    }
    if (user?.email == orgEmail) {
      return toast.error("Bạn không thể làm tình nguyện viên cho sự kiện này !");
    } else {
      navigate(`/be-a-volunteer/${id}`);
    }
  };

  const handleDeleteEvent = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa sự kiện?',
      text: `Bạn có chắc chắn muốn xóa sự kiện "${title}"? Hành động này không thể hoàn tác!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa sự kiện',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        setDeleting(true);
        await deleteEventByAdmin(id);
        toast.success('Đã xóa sự kiện thành công');
        navigate('/need-volunteer');
      } catch (error) {
        const errorMsg = error?.response?.data?.message || error?.message || 'Không thể xóa sự kiện';
        toast.error(errorMsg);
        console.error('Error deleting event:', error);
      } finally {
        setDeleting(false);
      }
    }
  };
  return (
    <div>
      <ScrollRestoration></ScrollRestoration>
      <Helmet>
        <title>
          {title}
        </title>
      </Helmet>
      <section className="py-16 font-qs px-8 ">
        <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500" className="mx-auto container grid place-items-center gap-12 grid-cols-1 md:grid-cols-2">
          <img
            src={thumbnail}
            alt="pink blazer"
            className="h-[36rem] rounded-md object-cover"
          />
          <div className="space-y-6">
            <Typography className="mb-4" variant="h2">
              {title2 || title}
            </Typography>
            <Typography variant="h4">
              Thể loại :{" "}
              <span className="text-green-500 font-qs font-bold">
                {category}
              </span>
            </Typography>
            <Typography className="!mt-4 text-base font-normal leading-[27px] !text-gray-500">
              {description}
            </Typography>
            <div className="my-4 flex items-center gap-2">
              <Typography className="text-xl font-semibold  ">
                Địa điểm :{" "}
                <span className="font-bold font-qs bg-yellow-300 px-4 py-2 rounded-md">
                  {postLocation}
                </span>
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className=" flex items-center gap-2">
                <Typography

                  className="text-lg font-semibold "
                >
                  Bắt đầu :
                </Typography>
                <Typography

                  className="text-lg font-qs font-bold "
                >
                  {formattedStart}
                </Typography>
              </div>

              <div className=" flex items-center gap-2">
                <Typography

                  className="text-lg font-semibold "
                >
                  Kết thúc :
                </Typography>
                <Typography

                  className="text-lg font-qs font-bold "
                >
                  {formattedEnd}
                </Typography>
              </div>
              <div className=" flex items-center gap-2 mt-4">
                <Typography

                  className="text-lg font-semibold "
                >
                  Số lượng tình nguyện viên
                </Typography>
                <Typography
                  color="blue-gray"
                  className="text-lg font-qs font-bold bg-green-300 px-3 py-2 rounded-full "
                >
                  {typeof remaining !== 'undefined' ? remaining : noOfVolunteer}
                </Typography>
              </div>
            </div>
            <div className="my-4 pb-8 ">
              <Typography

                className="text-lg font-qs font-bold pb-4"
              >
                Thông tin tổ chức :
              </Typography>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className=" flex items-center gap-2">
                  <Typography

                    className="text-lg font-qs font-bold"
                  >
                    Tên :
                  </Typography>
                  <Typography

                    className="text-lg font-qs font-bold"
                  >
                    {orgName}
                  </Typography>
                </div>
                <div className=" flex flex-col md:flex-row  md:items-center md:gap-2">
                  <Typography

                    className="text-lg font-qs font-bold"
                  >
                    Email:
                  </Typography>
                  <Typography

                    className="text-lg font-qs font-bold"
                  >{orgEmail}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="mb-4 flex w-full items-center gap-3 flex-wrap">
              {isVolunteer && postStatus !== 'ONGOING' ? (
                <Button
                  onClick={handleVolunteer}
                  color="red"
                  variant="gradient"
                  className="w-52"
                >
                  Làm tình nguyện viên
                </Button>
              ) : null}
              <Button
                onClick={() => navigate(`/event-feed/${id}`)}
                color="blue"
                variant="gradient"
                className="w-52"
              >
                Xem trang sự kiện
              </Button>
              {isAdmin && (
                <Button
                  onClick={handleDeleteEvent}
                  color="red"
                  variant="gradient"
                  className="w-52"
                  disabled={deleting}
                >
                  {deleting ? <Spinner className="h-4 w-4" /> : "Xóa sự kiện"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
PostDetails.propTypes = {
  title: PropTypes.object.isRequired,
}
export default PostDetails;
