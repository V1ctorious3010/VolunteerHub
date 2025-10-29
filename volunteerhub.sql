-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2025 at 06:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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

DROP DATABASE IF EXISTS `volunteerhub`;
CREATE DATABASE IF NOT EXISTS `volunteerhub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `volunteerhub`;

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
CREATE TABLE IF NOT EXISTS `volunteer` (
                                           `email` varchar(255) NOT NULL,
    `password` varchar(255) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `role` enum('ADMIN','MANAGER','VOLUNTEER') DEFAULT NULL,
    PRIMARY KEY (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`email`, `password`, `name`, `role`) VALUES
                                                                  ('f@gmail.com', '$2a$10$bifUP0QYNUdFtyCgOQLLEu9kzWJTb.WU6xo8hG2WojApRAbWZnVxO', 'baoquydau', 'VOLUNTEER'),
                                                                  ('ffff@gmail.com', '$2a$10$VNEJW0NFlt8xzcSQivaHleVnB0myod8xXffbfqVA9SzAhpJOqtTbS', 'baoquydau', 'VOLUNTEER'),
                                                                  ('ffxf@gmail.com', '$2a$10$NpodlEl0F21LZSmBet6sS.N30PoeykUXMLnxWd8eDE7fPQdJ0A6L.', 'baoquydau', 'VOLUNTEER'),
                                                                  ('fxf@gmail.com', '$2a$10$wL8sg3m9dROXw3fvYDLDtOS44oslJgq2wZRBGarEAxvsIX0wazvM6', 'baoquydau', 'VOLUNTEER');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_post`
--

DROP TABLE IF EXISTS `volunteer_post`;
CREATE TABLE IF NOT EXISTS `volunteer_post` (
                                                `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `postTitle` varchar(255) NOT NULL,
    `category` varchar(255) DEFAULT NULL,
    `deadline` date NOT NULL,
    `location` varchar(255) DEFAULT NULL,
    `noOfVolunteer` int(11) NOT NULL,
    `orgName` varchar(255) NOT NULL,
    `orgEmail` varchar(255) NOT NULL,
    `thumbnail` varchar(255) DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_org_email` (`orgEmail`),
    KEY `idx_post_title` (`postTitle`)
    ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
CREATE TABLE IF NOT EXISTS `volunteer_request` (
                                                   `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `postId` bigint(20) NOT NULL,
    `status` varchar(255) DEFAULT NULL,
    `suggestion` varchar(255) DEFAULT NULL,
    `requestDate` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `request1` (`postId`),
    KEY `request2` (`email`)
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `volunteer_request`
--
ALTER TABLE `volunteer_request`
    ADD CONSTRAINT `request1` FOREIGN KEY (`postId`) REFERENCES `volunteer_post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `request2` FOREIGN KEY (`email`) REFERENCES `volunteer` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
