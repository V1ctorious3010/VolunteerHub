-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2025 at 06:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `volunteerhub`
--
CREATE DATABASE IF NOT EXISTS `volunteerhub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `volunteerhub`;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` bigint(20) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `createdAt` datetime(6) NOT NULL,
  `postId` bigint(20) NOT NULL,
  `userEmail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `attachment`, `content`, `createdAt`, `postId`, `userEmail`) VALUES
(1, NULL, 'Tuyệt vời quá!', '2025-12-19 08:30:00.000000', 1, 'nguyenvanan@gmail.com'),
(2, NULL, 'Mình sẽ có mặt đúng giờ.', '2025-12-19 08:45:00.000000', 1, 'tranthibinh@gmail.com'),
(3, NULL, 'Ý nghĩa quá anh ơi.', '2025-12-19 10:15:00.000000', 2, 'lequangvinh@gmail.com'),
(5, NULL, 'Cố lên Hà Nội Xanh!', '2025-12-19 09:45:00.000000', 3, 'phamthanhthuy@gmail.com'),
(6, NULL, 'Thương các bé quá.', '2025-12-17 16:00:00.000000', 5, 'hoangminhduc@gmail.com'),
(7, NULL, 'Dạy học là niềm vui.', '2025-12-17 17:00:00.000000', 5, 'dangthuha@gmail.com'),
(8, NULL, 'Món quà ý nghĩa dịp Noel.', '2025-12-19 13:30:00.000000', 7, 'lequangvinh@gmail.com'),
(10, NULL, 'Cơm ngon canh ngọt.', '2025-12-19 17:30:00.000000', 9, 'nguyenvanan@gmail.com'),
(11, NULL, 'Cần thêm tình nguyện viên không ạ?', '2025-12-19 10:00:00.000000', 1, 'hoangminhduc@gmail.com'),
(12, NULL, 'Vẫn còn slot nhé bạn ơi.', '2025-12-19 10:05:00.000000', 1, 'redcross@gmail.com'),
(13, NULL, 'Rất hữu ích.', '2025-12-19 09:00:00.000000', 21, 'nguyenvanan@gmail.com'),
(15, NULL, 'Sẽ ủng hộ 5kg khoai.', '2025-12-18 10:00:00.000000', 19, 'lequangvinh@gmail.com'),
(16, NULL, 'Tri thức là sức mạnh.', '2025-12-19 11:30:00.000000', 15, 'phamthanhthuy@gmail.com'),
(17, NULL, 'Good job!', '2025-12-19 16:30:00.000000', 22, 'unicef_vn@gmail.com'),
(18, NULL, 'Hẹn gặp mọi người tối nay.', '2025-12-19 18:30:00.000000', 9, 'tranthibinh@gmail.com'),
(19, NULL, 'Quá đẹp.', '2025-12-19 15:45:00.000000', 28, 'dangthuha@gmail.com'),
(21, NULL, 'Cho mình địa chỉ hiến máu.', '2025-12-19 08:10:00.000000', 1, 'phamthanhthuy@gmail.com'),
(22, NULL, 'Tại BV Việt Đức nhé bạn.', '2025-12-19 08:15:00.000000', 1, 'redcross@gmail.com'),
(23, NULL, 'Tuyệt.', '2025-12-19 10:10:00.000000', 2, 'dangthuha@gmail.com'),
(25, NULL, 'Mong các bé luôn khỏe mạnh.', '2025-12-19 14:10:00.000000', 17, 'hoangminhduc@gmail.com'),
(28, NULL, 'Tôi có thể quyên góp sách không?', '2025-12-19 11:10:00.000000', 15, 'nguyenvanan@gmail.com'),
(29, NULL, 'Được bạn nhé, ghé văn phòng Unicef.', '2025-12-19 11:15:00.000000', 15, 'unicef_vn@gmail.com'),
(30, NULL, 'Cùng nhau lan tỏa.', '2025-12-19 16:10:00.000000', 25, 'dangthuha@gmail.com'),
(31, NULL, 'Môi trường là của chúng ta.', '2025-12-19 09:10:00.000000', 3, 'hoangminhduc@gmail.com'),
(32, NULL, 'Thật tự hào.', '2025-12-19 08:10:00.000000', 6, 'phamthanhthuy@gmail.com'),
(33, NULL, 'Tiếng Anh là chìa khóa.', '2025-12-17 15:10:00.000000', 5, 'lequangvinh@gmail.com'),
(35, NULL, 'Mình đăng ký rồi nhé.', '2025-12-11 10:10:00.000000', 12, 'tranthibinh@gmail.com'),
(36, NULL, 'Thương bà con mình.', '2025-12-18 08:10:00.000000', 19, 'nguyenvanan@gmail.com'),
(37, NULL, 'Kiến thức rất bổ ích.', '2025-12-19 08:40:00.000000', 21, 'dangthuha@gmail.com'),
(38, NULL, 'Nhìn nụ cười các em thật đẹp.', '2025-12-19 14:15:00.000000', 17, 'unicef_vn@gmail.com'),
(39, NULL, 'Hà Nội Xanh mãi đỉnh.', '2025-12-19 11:10:00.000000', 4, 'hoangminhduc@gmail.com'),
(40, NULL, 'Đã chuẩn bị quà xong.', '2025-12-19 14:10:00.000000', 8, 'redcross@gmail.com'),
(41, NULL, 'Good.', '2025-12-19 15:40:00.000000', 28, 'admin@gmail.com'),
(42, NULL, 'Like.', '2025-12-19 17:40:00.000000', 29, 'lequangvinh@gmail.com'),
(45, NULL, 'Chương trình quá hay.', '2025-12-19 16:15:00.000000', 22, 'tranthibinh@gmail.com'),
(46, NULL, 'Đã share bài viết.', '2025-12-19 13:15:00.000000', 7, 'dangthuha@gmail.com'),
(48, NULL, 'Đắk Lắk vẫy gọi.', '2025-12-19 15:10:00.000000', 28, 'hoangminhduc@gmail.com'),
(50, NULL, 'Cùng nhau cố gắng.', '2025-12-19 08:20:00.000000', 1, 'tungo@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `id` bigint(20) NOT NULL,
  `approvedAt` datetime(6) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `endTime` datetime(6) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `noOfVolunteer` int(11) DEFAULT NULL,
  `remaining` int(11) DEFAULT NULL,
  `startTime` datetime(6) DEFAULT NULL,
  `status` enum('COMING','FINISHED','ONGOING','PENDING','REJECTED') DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `orgEmail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `approvedAt`, `category`, `createdAt`, `description`, `endTime`, `location`, `noOfVolunteer`, `remaining`, `startTime`, `status`, `thumbnail`, `title`, `orgEmail`) VALUES
(1, '2025-12-10 08:00:00.000000', 'Y tế', '2025-12-05 09:00:00.000000', 'Hiến máu nhân đạo tại BV Việt Đức.', '2025-12-25 17:00:00.000000', 'Hà Nội', 100, 98, '2025-12-25 07:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Ngày Hội Hiến Máu Hồng', 'redcross@gmail.com'),
(2, '2025-12-11 10:00:00.000000', 'Môi trường', '2025-12-06 14:00:00.000000', 'Làm sạch sông Tô Lịch.', '2025-12-21 11:00:00.000000', 'Hà Nội', 50, 48, '2025-12-21 07:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Làm sạch sông quê', 'greenhanoi@gmail.com'),
(3, '2025-12-01 10:00:00.000000', 'Giáo dục', '2025-11-20 14:00:00.000000', 'Dạy tiếng Anh vùng cao.', '2025-12-20 17:00:00.000000', 'Lào Cai', 20, 18, '2025-12-15 08:00:00.000000', 'ONGOING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Tiếng Anh Vùng Cao', 'unicef_vn@gmail.com'),
(4, '2025-12-15 11:00:00.000000', 'Xã hội', '2025-12-12 10:00:00.000000', 'Giáng sinh cho trẻ mồ côi.', '2025-12-24 22:00:00.000000', 'TP.HCM', 30, 28, '2025-12-24 18:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Giáng Sinh Ấm Áp', 'redcross@gmail.com'),
(5, '2025-12-18 09:00:00.000000', 'Cứu trợ lương thực', '2025-12-15 09:00:00.000000', 'Phát cơm cho người vô gia cư.', '2025-12-20 23:00:00.000000', 'Đà Nẵng', 15, 13, '2025-12-19 19:00:00.000000', 'ONGOING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Bữa Cơm 0 Đồng', 'greenhanoi@gmail.com'),
(6, NULL, 'Động vật', '2025-12-19 10:00:00.000000', 'Giải cứu chó mèo.', '2026-01-10 17:00:00.000000', 'Hà Nội', 10, 10, '2026-01-05 08:00:00.000000', 'PENDING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Trạm Cứu Hộ Sen Vàng', 'tungo@gmail.com'),
(7, '2025-12-10 08:00:00.000000', 'Môi trường', '2025-12-01 09:00:00.000000', 'Trồng 1000 cây xanh.', '2026-02-15 17:00:00.000000', 'Cần Giờ', 200, 198, '2026-02-14 07:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Tết Trồng Cây 2026', 'greenhanoi@gmail.com'),
(8, '2025-11-20 08:00:00.000000', 'Y tế', '2025-11-15 09:00:00.000000', 'Khám bệnh cho người già.', '2025-12-10 17:00:00.000000', 'Hải Phòng', 40, 38, '2025-12-08 07:00:00.000000', 'FINISHED', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Mắt Sáng Cho Người Già', 'redcross@gmail.com'),
(9, '2025-12-18 09:00:00.000000', 'Giáo dục', '2025-12-15 09:00:00.000000', 'Tặng sách cho trẻ em nghèo.', '2026-01-20 17:00:00.000000', 'Yên Bái', 20, 18, '2026-01-15 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Sách Cũ Đến Trường', 'unicef_vn@gmail.com'),
(10, '2025-12-12 10:00:00.000000', 'Khác', '2025-12-10 14:00:00.000000', 'Sửa nhà tình nghĩa.', '2025-12-30 17:00:00.000000', 'Quảng Nam', 15, 13, '2025-12-20 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Mái Ấm Tình Thương', 'redcross@gmail.com'),
(11, '2025-12-15 08:00:00.000000', 'Cứu trợ lương thực', '2025-12-10 09:00:00.000000', 'Giải cứu khoai lang.', '2025-12-22 17:00:00.000000', 'Vĩnh Long', 50, 48, '2025-12-18 07:00:00.000000', 'ONGOING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Giải cứu Khoai Lang', 'greenhanoi@gmail.com'),
(12, '2025-12-10 08:00:00.000000', 'Xã hội', '2025-12-05 09:00:00.000000', 'Tư vấn pháp luật miễn phí.', '2025-12-28 17:00:00.000000', 'Bình Dương', 10, 8, '2025-12-27 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Pháp Luật Cho Mọi Người', 'tungo@gmail.com'),
(13, '2025-12-15 10:00:00.000000', 'Y tế', '2025-12-12 14:00:00.000000', 'Tập huấn sơ cứu.', '2026-01-05 16:00:00.000000', 'Huế', 60, 58, '2026-01-05 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Kỹ Năng Sinh Tồn 101', 'redcross@gmail.com'),
(14, '2025-12-01 10:00:00.000000', 'Môi trường', '2025-11-25 14:00:00.000000', 'Đổi rác lấy quà.', '2025-12-18 17:00:00.000000', 'Nha Trang', 25, 23, '2025-12-18 08:00:00.000000', 'FINISHED', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Green Life Exchange', 'greenhanoi@gmail.com'),
(15, '2025-12-18 09:00:00.000000', 'Giáo dục', '2025-12-15 09:00:00.000000', 'Xây dựng tủ sách.', '2026-03-01 17:00:00.000000', 'Đắk Lắk', 30, 28, '2026-02-28 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Tri Thức Vùng Sâu', 'unicef_vn@gmail.com'),
(16, NULL, 'Xã hội', '2025-12-19 14:00:00.000000', 'Hỗ trợ người già đón Tết.', '2026-01-25 17:00:00.000000', 'Nam Định', 40, 40, '2026-01-20 08:00:00.000000', 'PENDING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Tết Ấm Tình Thân', 'redcross@gmail.com'),
(17, '2025-12-15 10:00:00.000000', 'Động vật', '2025-12-10 14:00:00.000000', 'Tiêm phòng miễn phí.', '2025-12-22 17:00:00.000000', 'Đà Lạt', 20, 18, '2025-12-22 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Pet Care Day', 'tungo@gmail.com'),
(18, '2025-12-10 08:00:00.000000', 'Y tế', '2025-12-05 09:00:00.000000', 'Tuyên truyền phòng dịch.', '2025-12-29 11:00:00.000000', 'Vinh', 15, 13, '2025-12-29 08:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Vì Sức Khỏe Cộng Đồng', 'unicef_vn@gmail.com'),
(19, '2025-12-15 11:00:00.000000', 'Cứu trợ lương thực', '2025-12-12 10:00:00.000000', 'Quyên góp thực phẩm.', '2025-12-26 17:00:00.000000', 'Vũng Tàu', 20, 18, '2025-12-26 09:00:00.000000', 'COMING', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Kho Thực Phẩm Chia Sẻ', 'redcross@gmail.com'),
(20, '2025-12-01 08:00:00.000000', 'Khác', '2025-11-20 09:00:00.000000', 'Dọn nghĩa trang liệt sĩ.', '2025-12-05 17:00:00.000000', 'Quảng Trị', 50, 48, '2025-12-05 07:00:00.000000', 'FINISHED', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Uống Nước Nhớ Nguồn', 'tungo@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `like_post`
--

DROP TABLE IF EXISTS `like_post`;
CREATE TABLE `like_post` (
  `id` bigint(20) NOT NULL,
  `createdAt` datetime(6) NOT NULL,
  `postId` bigint(20) NOT NULL,
  `userEmail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `actor_name` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `targetUrl` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `actor_name`, `content`, `createdAt`, `is_read`, `targetUrl`, `type`, `userEmail`) VALUES
(1, 'EVENT_ORGANIZER', 'Bạn đã được xác nhận hoàn thành sự kiện Bữa Cơm 0 Đồng', '2025-12-19 16:37:26.000000', b'0', NULL, 'Notification', 'dangthuha@gmail.com'),
(2, 'EVENT_ORGANIZER', 'Bạn đã được xác nhận hoàn thành sự kiện Bữa Cơm 0 Đồng', '2025-12-19 16:37:47.000000', b'0', NULL, 'Notification', 'hoangminhduc@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` bigint(20) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `createdAt` datetime(6) NOT NULL,
  `authorEmail` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `attachment`, `content`, `createdAt`, `authorEmail`, `eventId`) VALUES
(1, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Thông báo: Ngày mai bắt đầu hiến máu nhé!', '2025-12-19 08:00:00.000000', 'redcross@gmail.com', 1),
(2, NULL, 'Mình vừa hiến máu xong, cảm thấy rất tự hào!', '2025-12-19 10:00:00.000000', 'nguyenvanan@gmail.com', 1),
(3, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Chuẩn bị găng tay và túi đựng rác thôi.', '2025-12-19 09:00:00.000000', 'greenhanoi@gmail.com', 2),
(4, NULL, 'Cùng nhau dọn sạch sông quê nào các bạn!', '2025-12-19 11:00:00.000000', 'dangthuha@gmail.com', 2),
(5, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Các bé ở đây rất ham học.', '2025-12-17 15:00:00.000000', 'unicef_vn@gmail.com', 3),
(6, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Kỷ niệm khó quên khi dạy học tại Lào Cai.', '2025-12-18 08:00:00.000000', 'lequangvinh@gmail.com', 3),
(7, NULL, 'Kế hoạch tặng quà đêm Giáng sinh.', '2025-12-19 13:00:00.000000', 'redcross@gmail.com', 4),
(8, NULL, 'Mọi người đã gói xong quà chưa?', '2025-12-19 14:00:00.000000', 'tranthibinh@gmail.com', 4),
(9, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Bếp đã đỏ lửa, sẵn sàng phục vụ.', '2025-12-19 17:00:00.000000', 'greenhanoi@gmail.com', 5),
(10, NULL, 'Nụ cười của bà cụ khi nhận cơm làm mình ấm lòng.', '2025-12-19 20:00:00.000000', 'hoangminhduc@gmail.com', 5),
(11, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Chuẩn bị 1000 cây đước cho Cần Giờ.', '2025-12-10 09:00:00.000000', 'greenhanoi@gmail.com', 7),
(12, NULL, 'Ai đi trồng cây với mình không?', '2025-12-11 10:00:00.000000', 'phamthanhthuy@gmail.com', 7),
(13, NULL, 'Tổng kết chiến dịch Mắt sáng cho người già.', '2025-12-09 18:00:00.000000', 'redcross@gmail.com', 8),
(14, NULL, 'Được giúp các cụ khám mắt là một vinh dự.', '2025-12-09 19:00:00.000000', 'nguyenvanan@gmail.com', 8),
(15, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152425/my_app_avatars/lvcvxwrizmcgjn7vg1aa.jpg', 'Kho sách đã đầy, cảm ơn các mạnh thường quân.', '2025-12-19 11:00:00.000000', 'unicef_vn@gmail.com', 9),
(16, NULL, 'Đã phân loại xong 500 cuốn sách.', '2025-12-19 12:00:00.000000', 'dangthuha@gmail.com', 9),
(17, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Mái ấm tình thương đang dần hoàn thiện.', '2025-12-19 14:00:00.000000', 'redcross@gmail.com', 10),
(18, NULL, 'Cùng nhau sơn lại tường cho các bé.', '2025-12-19 15:00:00.000000', 'lequangvinh@gmail.com', 10),
(19, NULL, 'Khoai lang Vĩnh Long giá 10k/kg.', '2025-12-18 08:00:00.000000', 'greenhanoi@gmail.com', 11),
(20, NULL, 'Mọi người ủng hộ bà con nhé.', '2025-12-18 09:00:00.000000', 'tranthibinh@gmail.com', 11),
(21, NULL, 'Buổi tư vấn pháp luật tại KCN Bình Dương.', '2025-12-19 08:30:00.000000', 'tungo@gmail.com', 12),
(22, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Học kỹ năng sơ cứu để bảo vệ người thân.', '2025-12-19 16:00:00.000000', 'redcross@gmail.com', 13),
(23, NULL, 'Hôm nay trời đẹp, đi tình nguyện thôi!', '2025-12-19 07:00:00.000000', 'nguyenvanan@gmail.com', 1),
(25, NULL, 'Ai rảnh cuối tuần đi từ thiện không?', '2025-12-19 09:30:00.000000', 'phamthanhthuy@gmail.com', NULL),
(26, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152938/my_app_avatars/oa1hhjkyxeib7jiuvftr.jpg', 'Tình nguyện là cho đi không nhận lại.', '2025-12-19 10:30:00.000000', 'dangthuha@gmail.com', 9),
(27, NULL, 'Rất vui khi được tham gia cộng đồng này.', '2025-12-19 11:30:00.000000', 'hoangminhduc@gmail.com', 5),
(28, 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766153504/my_app_avatars/cyq70jtwzjgwacbz2d41.jpg', 'Hình ảnh đẹp từ chuyến đi thiện nguyện vừa qua.', '2025-12-19 15:30:00.000000', 'unicef_vn@gmail.com', 9),
(29, NULL, 'Kêu gọi hỗ trợ cho các hoàn cảnh khó khăn.', '2025-12-19 17:30:00.000000', 'tungo@gmail.com', 12);

-- --------------------------------------------------------

--
-- Table structure for table `push_subscription`
--

DROP TABLE IF EXISTS `push_subscription`;
CREATE TABLE `push_subscription` (
  `id` bigint(20) NOT NULL,
  `auth` varchar(255) DEFAULT NULL,
  `endpoint` varchar(500) NOT NULL,
  `p256dh` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `push_subscription`
--

INSERT INTO `push_subscription` (`id`, `auth`, `endpoint`, `p256dh`, `user_email`) VALUES
(2, 'vTEiOVAqTpaDQn4KocqIBQ', 'https://fcm.googleapis.com/fcm/send/c6xbVD0Ty40:APA91bHh1OhGLBhFuBjkYT4nlJ9h4ETVdlJOQCnwQQsdaxLeSdAIQ5zvOW1udJLqPGweTZltAU4D8DhAVrgZIbPfIa2hF_8q9jKEdmq9RscxACVTJDiHLQRXjSIRQdq23K8gmbqWalhs', 'BEJWqNeCA9OUoZyE7y0N7x6aI28b6SZzeJR1zet2eobViuE-ZlvgFTAXW5xbEN851xFNDf-efZVr_2FwCWMvmnc', 'admin@gmail.com'),
(3, 'pIYNbIqTT2WDgqSjRhZBpg', 'https://fcm.googleapis.com/fcm/send/f1iOy511-RA:APA91bH58CBbpGsmITCq5KHdbDVb6KbCUkjhgsgQZ-A95QtJPHlB16NAbbmNp-uww9DBLYSN_nCkFF-drF4naZCcIx1NIbW4Nchd4ZXeuWWI9VplR-jM4dCFYH_bZlFkTgdkO9FsNaK9', 'BEJR6nvN26lcZKOerwDMfENCBFiQI4kilTcsbl7cuqwD9UCU-SvIfqE8jqOI7tv93Zx7eMnxRzouuUaKN85PvN4', 'greenhanoi@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
CREATE TABLE `registration` (
  `id` bigint(20) NOT NULL,
  `createdAt` datetime(6) DEFAULT NULL,
  `status` enum('APPROVED','COMPLETED','PENDING','REJECTED') DEFAULT NULL,
  `eventId` bigint(20) NOT NULL,
  `userEmail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `createdAt`, `status`, `eventId`, `userEmail`) VALUES
(1, '2025-12-11 09:00:00.000000', 'APPROVED', 1, 'nguyenvanan@gmail.com'),
(2, '2025-12-11 09:00:00.000000', 'APPROVED', 1, 'tranthibinh@gmail.com'),
(3, '2025-12-11 09:00:00.000000', 'APPROVED', 2, 'dangthuha@gmail.com'),
(4, '2025-12-11 09:00:00.000000', 'APPROVED', 2, 'hoangminhduc@gmail.com'),
(5, '2025-11-25 09:00:00.000000', 'COMPLETED', 3, 'lequangvinh@gmail.com'),
(6, '2025-11-25 09:00:00.000000', 'COMPLETED', 3, 'phamthanhthuy@gmail.com'),
(7, '2025-12-16 09:00:00.000000', 'APPROVED', 4, 'nguyenvanan@gmail.com'),
(8, '2025-12-16 09:00:00.000000', 'APPROVED', 4, 'tranthibinh@gmail.com'),
(9, '2025-12-17 09:00:00.000000', 'COMPLETED', 5, 'dangthuha@gmail.com'),
(10, '2025-12-17 09:00:00.000000', 'COMPLETED', 5, 'hoangminhduc@gmail.com'),
(11, '2025-12-05 09:00:00.000000', 'APPROVED', 7, 'lequangvinh@gmail.com'),
(12, '2025-12-05 09:00:00.000000', 'APPROVED', 7, 'phamthanhthuy@gmail.com'),
(13, '2025-12-05 09:00:00.000000', 'COMPLETED', 8, 'nguyenvanan@gmail.com'),
(14, '2025-12-05 09:00:00.000000', 'COMPLETED', 8, 'tranthibinh@gmail.com'),
(15, '2025-12-18 09:00:00.000000', 'APPROVED', 9, 'dangthuha@gmail.com'),
(16, '2025-12-18 09:00:00.000000', 'APPROVED', 9, 'hoangminhduc@gmail.com'),
(17, '2025-12-12 09:00:00.000000', 'APPROVED', 10, 'lequangvinh@gmail.com'),
(18, '2025-12-12 09:00:00.000000', 'APPROVED', 10, 'phamthanhthuy@gmail.com'),
(19, '2025-12-11 09:00:00.000000', 'APPROVED', 11, 'nguyenvanan@gmail.com'),
(20, '2025-12-11 09:00:00.000000', 'APPROVED', 11, 'tranthibinh@gmail.com'),
(21, '2025-12-06 09:00:00.000000', 'APPROVED', 12, 'dangthuha@gmail.com'),
(22, '2025-12-06 09:00:00.000000', 'APPROVED', 12, 'hoangminhduc@gmail.com'),
(23, '2025-12-13 09:00:00.000000', 'APPROVED', 13, 'lequangvinh@gmail.com'),
(24, '2025-12-13 09:00:00.000000', 'APPROVED', 13, 'phamthanhthuy@gmail.com'),
(25, '2025-11-26 09:00:00.000000', 'COMPLETED', 14, 'nguyenvanan@gmail.com'),
(26, '2025-11-26 09:00:00.000000', 'COMPLETED', 14, 'tranthibinh@gmail.com'),
(27, '2025-12-16 09:00:00.000000', 'APPROVED', 15, 'dangthuha@gmail.com'),
(28, '2025-12-16 09:00:00.000000', 'APPROVED', 15, 'hoangminhduc@gmail.com'),
(29, '2025-12-11 09:00:00.000000', 'APPROVED', 17, 'lequangvinh@gmail.com'),
(30, '2025-12-11 09:00:00.000000', 'APPROVED', 17, 'phamthanhthuy@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `Email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isLocked` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','EVENT_ORGANIZER','VOLUNTEER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`Email`, `avatar`, `isLocked`, `name`, `password`, `role`) VALUES
('admin@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Quản trị viên hệ thống', '$2a$10$MrvjH6YVGJIb9DM5ISDRwOe4PbxiTeqFoYYn2ziZX6PvDoVjYwSyO', 'ADMIN'),
('dangthuha@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Đặng Thu Hà', '$2a$10$A.3RoKfU7mEOarOGVLV0peYDVLUlfr04gZ.GECa41Pck5uGXaSdVa', 'VOLUNTEER'),
('greenhanoi@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'CLB Hà Nội Xanh', '$2a$10$yh53nBoWd3jsscMxlH8ykevtBx29bGnXMEE.sm7sJuTc2ayJRybX6', 'EVENT_ORGANIZER'),
('hoangminhduc@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Hoàng Minh Đức', '$2a$10$AJBf2s4HCJXsYcpjUdWPd.Fnta0psPg6S7DNok89NZ4boWKidcrsa', 'VOLUNTEER'),
('lequangvinh@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Lê Quang Vinh', '$2a$10$UbBILi2f6j8vYbKPi3P0Bu9yhirYxIkGyzS7/ZLUU0uAlTsqDKqjC', 'VOLUNTEER'),
('nguyenvanan@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Nguyễn Văn An', '$2a$10$YD148hwSQQQCPM8PuRYIDeVIK.JbIMRxjj3fU7hOOEo.k.24C7UAC', 'VOLUNTEER'),
('phamthanhthuy@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Phạm Thanh Thủy', '$2a$10$f4zEo4ZWTNe/rT7xmpesmuz/Qg8YHNtCDtmX8kJ9E7qK9qyRYkgnu', 'VOLUNTEER'),
('redcross@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Hội Chữ Thập Đỏ Việt Nam', '$2a$10$4jJ4/tfUUk6Bj0KGWWjQ..DqnR5L.NUwfdpdHPNFo4Ba.5yUwENgG', 'EVENT_ORGANIZER'),
('tranthibinh@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Trần Thị Bình', '$2a$10$P3NG4NoN641yIYipRARixem/Mf3sykN1KluSQzwk8BnhfTl5p9xxq', 'VOLUNTEER'),
('tungo@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'Lê Hồng Quang', '$2a$10$BxWerDZt1KE7jrbFcHNzcuLzOn/mgfji5uiVplUC0l0yFCC2KNdWO', 'EVENT_ORGANIZER'),
('tungod@gmail.com', NULL, b'0', 'Lê Hồng Quang', '$2a$10$zwApdICFhqcId32REcmyKuMIJaCb4uxH6RuGCdAj7KXUgflawAS/O', 'EVENT_ORGANIZER'),
('unicef_vn@gmail.com', 'https://res.cloudinary.com/ddejkfvvs/image/upload/v1766152879/my_app_avatars/rnwtxeyznb0kuxoqleti.webp', b'0', 'UNICEF Việt Nam', '$2a$10$zwApdICFhqcId32REcmyKuMIJaCb4uxH6RuGCdAj7KXUgflawAS/O', 'EVENT_ORGANIZER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbai3l7qmfg6yic1vh00rds7ta` (`postId`),
  ADD KEY `FKbugjo4ge6bgvij74y87mmt6dv` (`userEmail`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKo3fn3vjp1fv9d7c87o4p3oc92` (`orgEmail`);

--
-- Indexes for table `like_post`
--
ALTER TABLE `like_post`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK86dgxdu6g0ebm35l2fyopcwkw` (`userEmail`,`postId`),
  ADD KEY `FK9p0bevk7le4y7y9r7290grlmd` (`postId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1y7eqq3cyx0coq5audvon9jab` (`userEmail`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh28mlr8unda1a4r85nra3gpmn` (`authorEmail`),
  ADD KEY `FK7bjw5ce30lyyqfpwnyb5b7229` (`eventId`);

--
-- Indexes for table `push_subscription`
--
ALTER TABLE `push_subscription`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh9v3aaas44ei0hs3uewdp0jk7` (`eventId`),
  ADD KEY `FKs3r5599l56pkmf2g3lt72x3re` (`userEmail`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `like_post`
--
ALTER TABLE `like_post`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `push_subscription`
--
ALTER TABLE `push_subscription`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FKbai3l7qmfg6yic1vh00rds7ta` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `FKbugjo4ge6bgvij74y87mmt6dv` FOREIGN KEY (`userEmail`) REFERENCES `user` (`Email`);

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `FKo3fn3vjp1fv9d7c87o4p3oc92` FOREIGN KEY (`orgEmail`) REFERENCES `user` (`Email`);

--
-- Constraints for table `like_post`
--
ALTER TABLE `like_post`
  ADD CONSTRAINT `FK9p0bevk7le4y7y9r7290grlmd` FOREIGN KEY (`postId`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `FKakdbh1g0w7ljuspuj3p18luef` FOREIGN KEY (`userEmail`) REFERENCES `user` (`Email`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK1y7eqq3cyx0coq5audvon9jab` FOREIGN KEY (`userEmail`) REFERENCES `user` (`Email`);

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK7bjw5ce30lyyqfpwnyb5b7229` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `FKh28mlr8unda1a4r85nra3gpmn` FOREIGN KEY (`authorEmail`) REFERENCES `user` (`Email`);

--
-- Constraints for table `registration`
--
ALTER TABLE `registration`
  ADD CONSTRAINT `FKh9v3aaas44ei0hs3uewdp0jk7` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `FKs3r5599l56pkmf2g3lt72x3re` FOREIGN KEY (`userEmail`) REFERENCES `user` (`Email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
