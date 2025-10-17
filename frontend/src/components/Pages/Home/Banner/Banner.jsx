import bannerImage from '../../../../assets/images/banner/homepage.jpg';

/**
 * Banner Component
 * @description Hiển thị một section giới thiệu với bố cục hai cột:
 * - Bên trái: Tiêu đề và mô tả chính.
 * - Bên phải: Hình ảnh minh họa.
 * @returns {JSX.Element}
 */
const Banner = () => {
  return (
    // Container chính cho toàn bộ section, có padding trên dưới và căn giữa
    <div
      data-aos="fade-up"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      {/* Sử dụng Flexbox để tạo layout 2 cột.
        - flex-col: Mặc định trên mobile, ảnh sẽ nằm dưới chữ.
        - lg:flex-row: Trên màn hình lớn (large), layout chuyển thành 2 cột ngang.
        - items-center: Căn giữa các mục theo chiều dọc.
        - gap-12: Tạo khoảng cách giữa 2 cột.
      */}
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* === CỘT BÊN TRÁI (VĂN BẢN) === */}
        <div className="lg:w-1/2 text-center lg:text-left">
          {/* Tiêu đề chính - to và đậm */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-600 leading-tight">
            Helping Organizations Better&nbsp;
            <span className="text-green-600">Recruit</span>,&nbsp;
            <span className="text-green-600">Engage</span>, and&nbsp;
            <span className="text-green-600">Manage</span>
            &nbsp;Volunteers
          </h1>

          {/* Đoạn mô tả - nhỏ hơn và có khoảng cách với tiêu đề */}
          <p className="mt-6 text-lg text-gray-600">
            You need to make the most of your volunteers’ time and effort, and the time and effort you dedicate to managing them. We make it easy to not just manage your volunteers, but effectively engage them. VolunteerHub is a feature-rich, easy-to-use volunteer management software created to help organizations get the most value from their volunteer program by eliminating constraints.
          </p>
        </div>

        {/* === CỘT BÊN PHẢI (HÌNH ẢNH) === */}
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <img
            src={bannerImage}
            alt="Volunteers working together in the community"
            className="w-full h-auto rounded-lg shadow-2xl object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Banner;