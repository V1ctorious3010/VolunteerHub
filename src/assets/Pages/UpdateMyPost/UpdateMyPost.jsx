import { useState } from "react";
import image from "../../images//form/up1.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";


const UpdateMyPost = ({ title }) => {
  const navigate = useNavigate();
  const user = useSelector(s => s.auth.user);
  const post = useLoaderData();
  const {
    id,
    postTitle,
    category,
    location,
    thumbnail,
    noOfVolunteer,
    description,
  } = post;

  const parseDate = (v) => {
    try {
      const d = v ? new Date(v) : new Date();
      return isNaN(d) ? new Date() : d;
    } catch (_) { return new Date(); }
  };
  const [startDate, setStartDate] = useState(parseDate(post?.deadline));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const postTitle = form.postTitle.value;
    const category = form.category.value;
    const location = form.location.value;
    const thumbnail = form.thumbnail.value;
    const noOfVolunteer = form.noOfVolunteer.value;
    const deadline = startDate.toLocaleDateString();
    const orgName = form.orgName.value;
    const orgEmail = form.orgEmail.value;
    const description = form.description.value;
    const updatedVolunteerPost = {
      postTitle,
      category,
      location,
      thumbnail,
      noOfVolunteer,
      deadline,
      description,
      orgEmail,
      orgName
    };

    try {
      updateLocalPost(id, updatedVolunteerPost);
      toast.success("Your Volunteer post has been Updated");
      navigate("/manage-my-post");
    } catch (err) {
      console.log(err);
      toast.error('Failed to update post locally');
    }
  };
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        className="font-qs md:p-12 mb-12"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="md:w-3/5 mx-auto min-h-[calc(100vh-364px)] my-12">
          <section className="p-2 md:p-6 mx-auto bg-white rounded-md shadow-md ">
            <h2 className="text-2xl pt-6 text-center mb-8 font-body font-semibold text-gray-900 capitalize dark:text-white">
              Update My Volunteer Post
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 p-12">
                <div>
                  <label className="text-gray-800 font-semibold dark:text-gray-200">
                    Post Title
                  </label>
                  <input
                    defaultValue={postTitle}
                    placeholder="Enter your title of the post"
                    name="postTitle"
                    id="postTitle"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label
                    className="text-gray-800 font-semibold"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <select
                    defaultValue={category}
                    name="category"
                    id="category"
                    className="border p-2 rounded-md"
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Social Service">Social Service</option>
                    <option value="Animal Welfare">Animal Welfare</option>
                    <option value="Environment">Environment</option>
                    <option value="Food Security">Food Security</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="text-gray-800 font-semibold dark:text-gray-200">
                    Location
                  </label>
                  <select
                    defaultValue={location}
                    name="location"
                    id="location"
                    className="border p-2 rounded-md"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Cox's Bazar">Cox&apos;s Bazar</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-800 font-semibold dark:text-gray-200">
                    Thumbnail
                  </label>
                  <input
                    defaultValue={thumbnail}
                    id="thumbnail"
                    name="thumbnail"
                    placeholder="Enter your thumbnail link"
                    type="url"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  />
                </div>
                <div>
                  <label className="text-gray-800 font-semibold dark:text-gray-200">
                    No. of Volunteer Needed
                  </label>
                  <input
                    defaultValue={noOfVolunteer}
                    id="noOfVolunteer"
                    name="noOfVolunteer"
                    placeholder="Enter the total number of people you need"
                    type="number"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="text-gray-800 font-semibold">
                    Deadline
                  </label>

                  {/* Date Picker Input Field */}
                  <DatePicker
                    className="border p-2 rounded-md w-full"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
                <div>
                  <label className="text-gray-800 font-semibold dark:text-gray-200">
                    Organizer name
                  </label>
                  <input
                    id="orgName"
                    name="orgName"
                    defaultValue={user?.name}
                    type="text"
                    readOnly
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  />
                </div>
                <div>
                  <label className="text-gray-800 font-semibold dark:text-gray-200">
                    Organizer email
                  </label>
                  <input
                    defaultValue={user?.email}
                    id="orgEmail"
                    name="orgEmail"
                    readOnly
                    type="email"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4 md:col-span-2">
                  <label
                    className="text-gray-800 font-semibold"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    defaultValue={description}
                    placeholder="Enter the description"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                    name="description"
                    id="description"
                  ></textarea>
                </div>
              </div>

              <div className=" mt-6 md:px-12 md:pb-12">
                <input
                  className="px-8 w-full py-4 leading-5 cursor-pointer text-white transition-colors duration-300 transhtmlForm bg-green-500 font-bold rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  type="submit"
                  value="Update"
                />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
UpdateMyPost.propTypes = {
  title: PropTypes.object.isRequired,
}
export default UpdateMyPost;
