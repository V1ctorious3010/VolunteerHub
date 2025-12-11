import { Button, Typography } from "@material-tailwind/react";
import { ScrollRestoration, useLoaderData, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";


const PostDetails = ({ title }) => {
  const post = useLoaderData();
  const user = useSelector(s => s.auth.user);
  const navigate = useNavigate();
  const {
    id,
    postTitle,
    category,
    location,
    thumbnail,
    noOfVolunteer,
    deadline,
    description,
    orgEmail,
    orgName
  } = post;
  // console.log(post);
  const handleVolunteer = () => {
    // console.log("I want to be a volunteer !");

    if (noOfVolunteer <= 0) {
      toast.error("Sự kiện đã đủ người !");
      return
    }
    if (user?.email == orgEmail) {
      return toast.error("Bạn không thể làm tình nguyện viên cho sự kiện này !");
    } else {
      navigate(`/be-a-volunteer/${id}`);
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
              {postTitle}
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
                  {location}
                </span>
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className=" flex items-center gap-2">
                <Typography

                  className="text-lg font-semibold "
                >
                  Hạn cuối :
                </Typography>
                <Typography

                  className="text-lg font-qs font-bold "
                >
                  {deadline}
                </Typography>
              </div>
              <div className=" flex items-center gap-2">
                <Typography

                  className="text-lg font-semibold "
                >
                  Số lượng tình nguyện viên cần :
                </Typography>
                <Typography
                  color="blue-gray"
                  className="text-lg font-qs font-bold bg-green-300 px-3 py-2 rounded-full "
                >
                  {noOfVolunteer}
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
            <div className="mb-4 flex w-full items-center gap-3 md:w-1/2 ">
              <Button
                onClick={handleVolunteer}
                color="red"
                variant="gradient"
                className="w-52"
              >
                Làm tình nguyện viên
              </Button>
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
