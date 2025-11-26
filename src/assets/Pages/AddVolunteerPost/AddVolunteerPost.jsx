import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";
import { addLocalPost } from "../../../utils/localApi";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";


const AddVolunteerPost = ({ title }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const user = useSelector(s => s.auth.user);
  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const postTitle = form.postTitle.value;
    const category = form.category.value;
    const location = form.location.value;
    // Handle uploaded file (if any) and convert to base64 data URL
    const file = form.thumbnail.files && form.thumbnail.files[0];
    let thumbnail = "";
    if (file) {
      const fileToDataUrl = (f) => new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(f);
      });
      try {
        thumbnail = await fileToDataUrl(file);
      } catch (err) {
        console.error('Failed to read file', err);
      }
    }
    const noOfVolunteer = parseInt(form.noOfVolunteer.value);
    const deadline = startDate.toLocaleDateString();
    const orgName = form.orgName.value;
    const orgEmail = form.orgEmail.value;
    const description = form.description.value;
    const id = Date.now();
    const newVolunteerPost = {
      id,
      postTitle,
      category,
      location,
      thumbnail,
      noOfVolunteer,
      deadline,
      description,
      orgEmail,
      orgName,
    };

    try {
      // Save locally (public JSON cannot be written). We persist to localStorage for dev flow.
      const saved = addLocalPost(newVolunteerPost);
      console.log('saved', saved);
      toast.success("Your Volunteer post has been added ");
      form.reset();
      setThumbnailPreview(null);
      navigate("/manage-my-post");
    } catch (err) {
      console.log(err);
      toast.error('Failed to save post locally');
    }
  };
  return (
    <div data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1500"
      className="font-qs md:p-12 mb-12"
      style={{

        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="md:w-3/5 mx-auto min-h-[calc(100vh-364px)] my-12">
        <section className="p-2 md:p-6 mx-auto bg-white rounded-md shadow-md ">
          <h2 className="text-2xl pt-6 text-center mb-8 font-body font-semibold text-gray-900 capitalize">
            Add Volunteer Post
          </h2>

          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 p-12">
              <div>
                <label className="text-gray-800 font-semibold">
                  Post Title
                </label>
                <input
                  placeholder="Enter your title of the post"
                  name="postTitle"
                  id="postTitle"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                <label className="text-gray-800 font-semibold">
                  Location
                </label>
                <select
                  name="location"
                  id="location"
                  className="border p-2 rounded-md"
                >
                  <option value="Ha Noi">Ha Noi</option>
                  <option value="Hai Phong">Hai Phong</option>
                  <option value="Da Nang">Da Nang</option>
                  <option value="Nha Trang">Nha Trang</option>
                  <option value="Hue">Hue</option>
                  <option value="Ho Chi Minh">Ho Chi Minh</option>
                </select>
              </div>

              <div>
                <label className="text-gray-800 font-semibold">
                  Thumbnail (upload image)
                </label>
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(ev) => {
                    const f = ev.target.files && ev.target.files[0];
                    if (!f) return setThumbnailPreview(null);
                    const reader = new FileReader();
                    reader.onload = () => setThumbnailPreview(reader.result);
                    reader.readAsDataURL(f);
                  }}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />

                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt="preview" className="mt-2 h-28 object-cover rounded-md" />
                )}
              </div>
              <div>
                <label className="text-gray-800 font-semibold">
                  No. of Volunteer Needed
                </label>
                <input
                  id="noOfVolunteer"
                  name="noOfVolunteer"
                  placeholder="Enter the total number of people you need"
                  type="number"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="text-gray-800 font-semibold">Deadline</label>

                {/* Date Picker Input Field */}
                <DatePicker
                  className="border p-2 rounded-md w-full"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div>
                <label className="text-gray-800 font-semibold">
                  Organizer name
                </label>
                <input
                  id="orgName"
                  name="orgName"
                  defaultValue={user?.name}
                  type="text"
                  readOnly
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="text-gray-800 font-semibold">
                  Organizer email
                </label>
                <input
                  defaultValue={user?.email}
                  id="orgEmail"
                  name="orgEmail"
                  readOnly
                  type="email"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                value="Add Post"
              />
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
AddVolunteerPost.propTypes = {
  title: PropTypes.object.isRequired,
}
export default AddVolunteerPost;
