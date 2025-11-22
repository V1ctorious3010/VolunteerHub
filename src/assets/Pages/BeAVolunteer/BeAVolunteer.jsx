import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import image from "../../images/form/adds.avif";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";


const BeAVolunteer = ({ title }) => {
  const post = useLoaderData();
  // safe parse of deadline -> Date
  const parseDate = (v) => {
    try {
      const d = v ? new Date(v) : new Date();
      return isNaN(d) ? new Date() : d;
    } catch (_) { return new Date(); }
  };
  const [startDate, setStartDate] = useState(parseDate(post?.deadline));
  const navigate = useNavigate();
  const user = useSelector(s => s.auth.user);
  const { id,
    postTitle,
    category,
    location,
    thumbnail,
    noOfVolunteer,
    // deadline (string) handled by startDate
    description,
    orgEmail, orgName,
  } = post;

  console.log(post);
  const handleRequest = async (e) => {
    e.preventDefault();
    const form = e.target;
    const postTitle = form.postTitle.value;
    const category = form.category.value;
    const location = form.destination.value;
    const thumbnail = form.thumbnail.value;
    const noOfVolunteer = form.noOfVolunteer.value;
    const deadline = startDate.toLocaleDateString();
    const orgName = form.orgName.value;
    const orgEmail = form.orgEmail.value;
    const volunteerName = form.volunteerName.value;
    const volunteerEmail = form.volunteerEmail.value;
    const description = form.description.value;
    const suggestion = form.suggestion.value;
    const status = form.status.value;
    const requestVolunteerPost = {
      postTitle,
      category,
      location,
      thumbnail,
      noOfVolunteer,
      deadline,
      description,
      suggestion,
      status,
      volunteerName,
      volunteerEmail,
      orgEmail,
      orgName,
      postId: id
    };
    console.log(requestVolunteerPost);
    try {
      const requestPost = {
        id: Date.now(),
        postId: id,
        volunteerEmail,
        status,
        suggestion,
        orgEmail,
        orgName,
        volunteerName,
      };
      // Save locally
      const { addLocalRequest } = await import('../../../utils/localApi');
      addLocalRequest(requestPost);
      toast.success("Your Volunteer Request has been sent ");
      form.reset();
      navigate("/manage-my-post");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send request. Please try again.");
    }
  };
  return (
    <div
      className="font-qs md:p-12 mb-12"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Helmet>
        <title>
          {title}
        </title>
      </Helmet>
      <div className="md:w-3/5 mx-auto min-h-[calc(100vh-364px)] my-12">
        <section className="p-2 md:p-6 mx-auto bg-white rounded-md shadow-md ">
          <h2 className="text-2xl pt-6 text-center mb-8 font-body font-semibold text-gray-900 capitalize dark:text-white">
            Be A Volunteer
          </h2>

          <form onSubmit={handleRequest}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 p-12">
              <div>
                <label className="text-gray-800 font-semibold dark:text-gray-200">
                  Post Title
                </label>
                <input
                  placeholder="Enter your title of the post"
                  name="postTitle"
                  readOnly
                  defaultValue={postTitle}
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
                  name="category"
                  id="category"
                  defaultValue={category}
                  disabled
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
                  name="destination"
                  id="location"
                  defaultValue={location}
                  disabled
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
                  readOnly
                  id="thumbnail"
                  name="thumbnail"
                  placeholder="Enter your thumbnail link"
                  type="url"
                  disabled
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="text-gray-800 font-semibold dark:text-gray-200">
                  No. of Volunteer Needed
                </label>
                <input
                  defaultValue={noOfVolunteer}
                  readOnly
                  id="noOfVolunteer"
                  name="noOfVolunteer"
                  placeholder="Enter the total number of people you need"
                  type="number"
                  disabled
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="text-gray-800 font-semibold">Deadline</label>

                {/* Date Picker Input Field */}
                <DatePicker
                  disabled
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
                  defaultValue={orgName}
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

                  id="orgEmail"
                  name="orgEmail"
                  defaultValue={orgEmail}
                  readOnly
                  type="email"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label
                  className="text-gray-800 font-semibold"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  defaultValue={description}
                  readOnly
                  placeholder="Enter the description"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                  name="description"
                  id="description"
                ></textarea>
              </div>
              <div>
                <label className="text-gray-800 font-semibold dark:text-gray-200">
                  Volunteer name
                </label>
                <input
                  id="volunteerName"
                  name="volunteerName"
                  defaultValue={user?.name}
                  type="text"
                  readOnly
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="text-gray-800 font-semibold dark:text-gray-200">
                  Volunteer email
                </label>
                <input

                  id="volunteerEmail"
                  name="volunteerEmail"
                  defaultValue={user?.email}
                  readOnly
                  type="email"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-800 font-semibold"
                  htmlFor="description"
                >
                  Suggestion
                </label>
                <textarea
                  required
                  placeholder="Enter your suggestion"
                  className="block w-full px-4  mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                  name="suggestion"
                  id="suggestion"
                ></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-800 font-semibold"
                  htmlFor="description"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="location"
                  defaultValue={"Requested"}
                  className="border p-2 rounded-md"
                >
                  <option value="Requested">Requested</option>
                  <option value="Reject">Reject</option>

                </select>
              </div>
            </div>

            <div className=" mt-6 md:px-12 md:pb-12">
              <input
                className="px-8 w-full py-4 leading-5 cursor-pointer text-white transition-colors duration-300 transhtmlForm bg-green-500 font-bold rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                type="submit"
                value="Request"
              />
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
BeAVolunteer.propTypes = {
  title: PropTypes.object.isRequired,
}
export default BeAVolunteer;
