import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { updateEvent } from "../../../utils/postApi";
import handleUploadAnh from "../../../utils/handleUploadAnh";


const UpdateMyPost = ({ title2 }) => {
  const navigate = useNavigate();
  const user = useSelector(s => s.auth.user);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const post = useLoaderData();
  const {
    id,
    title,
    category,
    location,
    thumbnail,
    noOfVolunteer,
    description,
    startTime: postStartTime,
    endTime: postEndTime,
  } = post;

  const parseDate = (v) => {
    try {
      const d = v ? new Date(v) : new Date();
      return isNaN(d) ? new Date() : d;
    } catch (_) { return new Date(); }
  };
  const [startDate, setStartDate] = useState(parseDate(postStartTime));
  const [endDate, setEndDate] = useState(parseDate(postEndTime));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const postTitle = form.title.value;
    const category = form.category.value;
    const location = form.location.value;
    const file = form.thumbnail.files && form.thumbnail.files[0];
    let thumbnailUrl = thumbnail || "";
    if (file) {
      try {
        thumbnailUrl = await handleUploadAnh(file, { notifyUrl: null });
      } catch (err) {
        console.error('Failed to upload file', err);
        toast.error('Lỗi tải ảnh lên');
      }
    }
    const noOfVolunteerVal = parseInt(form.noOfVolunteer.value);
    const formatDate = (d) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    const startTime = `${formatDate(startDate)} 00:00:00`;
    const endTime = `${formatDate(endDate)} 00:00:00`;
    const descriptionVal = form.description.value;

    const updatedVolunteerPost = {
      title: postTitle,
      category,
      location,
      thumbnail: thumbnailUrl,
      noOfVolunteer: noOfVolunteerVal,
      startTime,
      endTime,
      description: descriptionVal,
    };

    try {
      await updateEvent(id, updatedVolunteerPost);

      setThumbnailPreview(null);
      toast.success("Cập nhật bài viết thành công");
      navigate("/manage-my-post");
    } catch (err) {
      console.error('Update failed', err);
      const re = err?.response?.data?.message;
      toast.error(re || 'Cập nhật bài viết thất bại');
    }
  };
  return (
    <div>
      <Helmet>
        <title>{title2}</title>
      </Helmet>
      <div
        className="font-qs md:p-12 mb-12"

      >
        <div className="md:w-3/5 mx-auto min-h-[calc(100vh-364px)] my-12">
          <section className="p-2 md:p-6 mx-auto bg-white rounded-md shadow-md ">
            <h2 className="text-2xl pt-6 text-center mb-8 font-body font-semibold text-gray-900 capitalize">
              Cập nhật bài sự kiện
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 p-12">
                <div>
                  <label className="text-gray-800 font-semibold">
                    Tên sự kiện
                  </label>
                  <input
                    defaultValue={title}
                    placeholder="Enter your title of the post"
                    name="title"
                    id="title"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label
                    className="text-gray-800 font-semibold"
                    htmlFor="category"
                  >
                    Phân loại
                  </label>
                  <select
                    defaultValue={category}
                    name="category"
                    id="category"
                    className="border p-2 rounded-md"
                  >
                    <option value="Y tế">Y tế</option>
                    <option value="Giáo dục">Giáo dục</option>
                    <option value="Xã hội">Xã hội</option>
                    <option value="Động vật hoang dã">Động vật hoang dã</option>
                    <option value="Môi trường">Môi trường</option>
                    <option value="Cứu trợ lương thực">Cứu trợ lương thực</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="text-gray-800 font-semibold">
                    Địa điểm
                  </label>
                  <input
                    defaultValue={location}
                    id="location"
                    name="location"
                    placeholder="Enter the event location"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  />
                </div>

                <div>
                  <label className="text-gray-800 font-semibold">
                    Ảnh
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
                    Số lượng tình nguyện viên cần
                  </label>
                  <input
                    defaultValue={noOfVolunteer}
                    id="noOfVolunteer"
                    name="noOfVolunteer"
                    placeholder="Enter the total number of people you need"
                    type="number"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="text-gray-800 font-semibold">Ngày bắt đầu</label>
                  <DatePicker
                    className="border p-2 rounded-md w-full"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="text-gray-800 font-semibold">Ngày kết thúc</label>
                  <DatePicker
                    className="border p-2 rounded-md w-full"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
                {/* org fields removed — server will use authenticated user */}
                <div className="flex flex-col gap-2 mt-4 md:col-span-2">
                  <label
                    className="text-gray-800 font-semibold"
                    htmlFor="description"
                  >
                    Mô tả
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
                  value="Cập nhật"
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
