-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2025 at 07:07 PM
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
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
CREATE TABLE `volunteer` (
  `volunteerEmail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `volunteer`
--

TRUNCATE TABLE `volunteer`;
--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`volunteerEmail`) VALUES
('sinestria@gmail.com'),
('wu@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_post`
--

DROP TABLE IF EXISTS `volunteer_post`;
CREATE TABLE `volunteer_post` (
  `id` bigint(20) NOT NULL,
  `postTitle` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `deadline` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `noOfVolunteer` int(11) NOT NULL,
  `orgName` varchar(255) NOT NULL,
  `orgEmail` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `volunteer_post`
--

TRUNCATE TABLE `volunteer_post`;
--
-- Dumping data for table `volunteer_post`
--

INSERT INTO `volunteer_post` (`id`, `postTitle`, `category`, `deadline`, `location`, `noOfVolunteer`, `orgName`, `orgEmail`, `thumbnail`, `description`) VALUES
(1, 'Dọn dẹp bãi biển Đà Nẵng', 'Environmental', '2025-10-20', 'Da Nang, Vietnam', 2, 'Green Sea Org', 'green.sea@example.com', 'https://demofree.sirv.com/nope-not-here.jpg', NULL),
(2, 'Dạy kèm trẻ em có hoàn cảnh khó khăn', 'Education', '2025-10-16', 'Hanoi, Vietnam', 0, 'Hope Kids Center', 'hope.kids@example.com', 'https://demofree.sirv.com/nope-not-here.jpg', NULL),
(3, 'Phân phát suất ăn miễn phí cho người vô gia cư', 'Community Service', '2025-10-23', 'Ho Chi Minh City, Vietnam', 17, 'Food For All', 'food.forall@example.com', 'https://demofree.sirv.com/nope-not-here.jpg', NULL),
(5, 'tập tạ', 'Education', '2025-10-16', 'Chittagong', 200, 'wukong', 'wu@gmail.com', 'https://demofree.sirv.com/nope-not-here.jpg', NULL),
(6, 'tập tạ tăng cân', 'Healthcare', '2025-10-16', 'Dhaka', 22, 'wukong', 'wu@gmail.com', 'https://friendshipcenters.org/wp-content/uploads/2021/02/hm_CenterSarasota-1300x600-1.jpg', 'tăng cơ ');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_request`
--

DROP TABLE IF EXISTS `volunteer_request`;
CREATE TABLE `volunteer_request` (
  `id` bigint(20) NOT NULL,
  `volunteerEmail` varchar(255) NOT NULL,
  `postId` bigint(20) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `suggestion` varchar(255) DEFAULT NULL,
  `requestDate` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Truncate table before insert `volunteer_request`
--

TRUNCATE TABLE `volunteer_request`;
--
-- Dumping data for table `volunteer_request`
--

INSERT INTO `volunteer_request` (`id`, `volunteerEmail`, `postId`, `status`, `suggestion`, `requestDate`) VALUES
(2, 'wu@gmail.com', 1, 'Requested', '', NULL),
(4, 'sinestria@gmail.com', 1, 'Reject', '', NULL),
(5, 'wu@gmail.com', 2, 'Requested', '', NULL),
(6, 'wu@gmail.com', 1, 'Pending', '3', '2025-10-16 15:42:43.000000'),
(7, 'wu@gmail.com', 3, 'Pending', 'ppp', '2025-10-16 15:44:26.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `volunteer`
--
ALTER TABLE `volunteer`
  ADD PRIMARY KEY (`volunteerEmail`);

--
-- Indexes for table `volunteer_post`
--
ALTER TABLE `volunteer_post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_org_email` (`orgEmail`),
  ADD KEY `idx_post_title` (`postTitle`);

--
-- Indexes for table `volunteer_request`
--
ALTER TABLE `volunteer_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request1` (`postId`),
  ADD KEY `request2` (`volunteerEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `volunteer_post`
--
ALTER TABLE `volunteer_post`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `volunteer_request`
--
ALTER TABLE `volunteer_request`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `volunteer_request`
--
ALTER TABLE `volunteer_request`
  ADD CONSTRAINT `request1` FOREIGN KEY (`postId`) REFERENCES `volunteer_post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `request2` FOREIGN KEY (`volunteerEmail`) REFERENCES `volunteer` (`volunteerEmail`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
