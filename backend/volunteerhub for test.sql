-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2025 at 05:10 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `category`
--
DROP DATABASE IF EXISTS `volunteerhub`;
CREATE DATABASE IF NOT EXISTS `volunteerhub` DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_general_ci;
USE `volunteerhub`;
CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `noOfVolunteer` int(11) DEFAULT NULL,
  `remaining` int(11) DEFAULT NULL,
  `startTime` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `managerId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `description`, `duration`, `location`, `noOfVolunteer`, `remaining`, `startTime`, `status`, `thumbnail`, `title`, `managerId`) VALUES
(1, 'rqereqewrer', '2h30', 'hanoi', 22, 22, '2025-11-11 01:39:54.000000', '', NULL, 'brother', 'wu@gmail.com'),
(2, 'rqeredassccqewrer', '2h30', 'hanoi', 22, 22, '2025-11-11 01:39:54.000000', '', NULL, 'alonsobrother', 'wu@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `event_category`
--

CREATE TABLE `event_category` (
  `id` bigint(20) NOT NULL,
  `categoryId` bigint(20) DEFAULT NULL,
  `eventId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` bigint(20) NOT NULL,
  `createdAt` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

CREATE TABLE `volunteer` (
  `Email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','EVENT_ORGANIZER','VOLUNTEER') DEFAULT NULL,
  `is_locked` bit(1) DEFAULT NULL,
  `events_num` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`Email`, `name`, `password`, `role`, `is_locked`, `events_num`) VALUES
('test5@example.com', 'Kien', '$2a$10$mxbNh..B7Npcn5WQKQoR3eJZhDtvwBW04SEAWrIUkCn/GQ2YgAJua', 'VOLUNTEER', b'0', 1),
('wu@gmail.com', 'wukiing', 'lilililili', 'VOLUNTEER', b'1', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKii6l17b7w8eg6xkixc08jwmk` (`managerId`);

--
-- Indexes for table `event_category`
--
ALTER TABLE `event_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK74omyhix99qomcap33liptc4y` (`eventId`),
  ADD KEY `FKlpj7r0h84laeegm5r69bgb91t` (`categoryId`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKh9v3aaas44ei0hs3uewdp0jk7` (`eventId`),
  ADD KEY `FK3m5ojq0x8q44cikc41513hytn` (`userId`);

--
-- Indexes for table `volunteer`
--
ALTER TABLE `volunteer`
  ADD PRIMARY KEY (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_category`
--
ALTER TABLE `event_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `FKii6l17b7w8eg6xkixc08jwmk` FOREIGN KEY (`managerId`) REFERENCES `volunteer` (`Email`);

--
-- Constraints for table `event_category`
--
ALTER TABLE `event_category`
  ADD CONSTRAINT `FK74omyhix99qomcap33liptc4y` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `FKlpj7r0h84laeegm5r69bgb91t` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`);

--
-- Constraints for table `registration`
--
ALTER TABLE `registration`
  ADD CONSTRAINT `FK3m5ojq0x8q44cikc41513hytn` FOREIGN KEY (`userId`) REFERENCES `volunteer` (`Email`),
  ADD CONSTRAINT `FKh9v3aaas44ei0hs3uewdp0jk7` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
