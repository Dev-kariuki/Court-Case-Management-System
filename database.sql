-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 02, 2026 at 10:03 PM
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
-- Database: `roba_intranet`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cases`
--

CREATE TABLE `cases` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_color` varchar(50) NOT NULL,
  `case_no` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `court` varchar(50) NOT NULL,
  `division` varchar(50) NOT NULL,
  `location` varchar(80) NOT NULL,
  `judge` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `advocate` varchar(50) NOT NULL,
  `completed_by` int(11) DEFAULT NULL,
  `party` varchar(50) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_completed` datetime DEFAULT NULL,
  `bringup_date` datetime NOT NULL,
  `file_location` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `suit_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cases`
--

INSERT INTO `cases` (`id`, `title`, `file_color`, `case_no`, `description`, `court`, `division`, `location`, `judge`, `status`, `advocate`, `completed_by`, `party`, `date_created`, `date_completed`, `bringup_date`, `file_location`, `matter_id`, `suit_type`) VALUES
(1, 'The Republic vs John Doe', 'Red', 'E001/2025', 'This criminal case', 'Milimani High Court', 'Criminal', 'Nairobi', 'Hon. Kimondo', 0, 'Peter Kariuki', NULL, 'accused', '2026-02-02 13:45:54', NULL, '0000-00-00 00:00:00', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `case_attendance_memo`
--

CREATE TABLE `case_attendance_memo` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_client_advocate`
--

CREATE TABLE `case_client_advocate` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_conf`
--

CREATE TABLE `case_conf` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `party` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_correspondence`
--

CREATE TABLE `case_correspondence` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_court_docs`
--

CREATE TABLE `case_court_docs` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_docs`
--

CREATE TABLE `case_docs` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `party` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_pleadings`
--

CREATE TABLE `case_pleadings` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `party` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_serv`
--

CREATE TABLE `case_serv` (
  `id` int(11) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `title` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_timeline`
--

CREATE TABLE `case_timeline` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `date_completed` datetime DEFAULT NULL,
  `advocate` varchar(50) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `supp_doc1` varchar(100) DEFAULT NULL,
  `supp_doc2` varchar(100) DEFAULT NULL,
  `supp_doc3` varchar(100) DEFAULT NULL,
  `supp_doc4` varchar(100) DEFAULT NULL,
  `supp_doc5` varchar(100) DEFAULT NULL,
  `supp_doc6` varchar(100) DEFAULT NULL,
  `supp_doc7` varchar(100) DEFAULT NULL,
  `supp_doc8` varchar(100) DEFAULT NULL,
  `supp_doc9` varchar(100) DEFAULT NULL,
  `supp_doc10` varchar(100) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `bringup_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `case_timeline`
--

INSERT INTO `case_timeline` (`id`, `title`, `case_id`, `description`, `date_completed`, `advocate`, `status`, `supp_doc1`, `supp_doc2`, `supp_doc3`, `supp_doc4`, `supp_doc5`, `supp_doc6`, `supp_doc7`, `supp_doc8`, `supp_doc9`, `supp_doc10`, `date_created`, `bringup_date`) VALUES
(1, 'Plea Taking', 1, 'The accused will be pleading not guilty as advised by the counsel', NULL, 'Peter Kariuki', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-02 13:45:54', '2026-02-26 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `chat` text NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conveyancing`
--

CREATE TABLE `conveyancing` (
  `id` int(11) NOT NULL,
  `case_no` varchar(50) NOT NULL,
  `file_color` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `filling_date` datetime NOT NULL,
  `bringup_date` datetime NOT NULL,
  `advocate` varchar(50) NOT NULL,
  `completed_by` int(11) NOT NULL,
  `party` varchar(50) NOT NULL,
  `title_report` varchar(100) DEFAULT NULL,
  `inspection_report` varchar(100) DEFAULT NULL,
  `property_photos` varchar(100) DEFAULT NULL,
  `survey_map` varchar(100) DEFAULT NULL,
  `draft_agreement` varchar(100) DEFAULT NULL,
  `signed_contract` varchar(100) DEFAULT NULL,
  `deposit_receipt` varchar(100) DEFAULT NULL,
  `transfer_deed` varchar(100) DEFAULT NULL,
  `stamp_duty_receipt` varchar(100) DEFAULT NULL,
  `fee_receipts` varchar(100) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_completed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_attendance_memo`
--

CREATE TABLE `conv_attendance_memo` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_client_advocate`
--

CREATE TABLE `conv_client_advocate` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_conf`
--

CREATE TABLE `conv_conf` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `party` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_correspondence`
--

CREATE TABLE `conv_correspondence` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_court_docs`
--

CREATE TABLE `conv_court_docs` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_parties`
--

CREATE TABLE `conv_parties` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conv_pleadings`
--

CREATE TABLE `conv_pleadings` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `correspondence`
--

CREATE TABLE `correspondence` (
  `id` int(11) NOT NULL,
  `corr_id` varchar(50) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `completed` tinyint(1) NOT NULL,
  `file` varchar(100) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `all_day` tinyint(4) NOT NULL,
  `calendar` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `start`, `end`, `all_day`, `calendar`, `description`, `user_id`, `date_created`) VALUES
(1, 'Plea Taking', '2026-02-26 09:00:00', '2026-02-26 13:00:00', 0, 'company', 'The accused will be pleading not guilty as advised by the counsel', NULL, '2026-02-02 13:45:54');

-- --------------------------------------------------------

--
-- Table structure for table `finance`
--

CREATE TABLE `finance` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `date_of_receipt` datetime NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `image` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL,
  `category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `miscellaneous`
--

CREATE TABLE `miscellaneous` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_color` varchar(50) NOT NULL,
  `case_no` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `date_initiated` datetime NOT NULL,
  `date_completed` datetime DEFAULT NULL,
  `advocate` varchar(50) NOT NULL,
  `completed_by` int(11) NOT NULL,
  `file_location` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `party1` varchar(80) DEFAULT NULL,
  `party2` varchar(80) DEFAULT NULL,
  `party3` varchar(80) DEFAULT NULL,
  `party4` varchar(80) DEFAULT NULL,
  `party5` varchar(80) DEFAULT NULL,
  `party6` varchar(80) DEFAULT NULL,
  `party7` varchar(80) DEFAULT NULL,
  `party8` varchar(80) DEFAULT NULL,
  `party9` varchar(80) DEFAULT NULL,
  `party10` varchar(80) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `bringup_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_attendance_memo`
--

CREATE TABLE `misc_attendance_memo` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_client_advocate`
--

CREATE TABLE `misc_client_advocate` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_conf`
--

CREATE TABLE `misc_conf` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `party` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_correspondence`
--

CREATE TABLE `misc_correspondence` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_court_docs`
--

CREATE TABLE `misc_court_docs` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_docs`
--

CREATE TABLE `misc_docs` (
  `id` int(11) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `misc_pleadings`
--

CREATE TABLE `misc_pleadings` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `case_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `party` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parties`
--

CREATE TABLE `parties` (
  `id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `case_id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `summary`
--

CREATE TABLE `summary` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `case_no` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `deadline` datetime NOT NULL,
  `completed_by` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `assigned_to` int(11) DEFAULT NULL,
  `in_progress` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_completed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_booking`
--

CREATE TABLE `task_booking` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `booked_by` int(11) NOT NULL,
  `date_booked` datetime NOT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_docs`
--

CREATE TABLE `task_docs` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_docs`
--

INSERT INTO `task_docs` (`id`, `task_id`, `file_name`, `date_created`) VALUES
(1, 1, 'final answer mismatch.png', '2026-02-02 15:57:34'),
(2, 2, 'final answer mismatch.png', '2026-02-02 16:00:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `client` tinyint(1) NOT NULL DEFAULT 0,
  `fname` varchar(20) NOT NULL,
  `lname` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` varchar(50) NOT NULL,
  `case_no` varchar(20) DEFAULT NULL,
  `team_access` tinyint(4) NOT NULL,
  `tasks_access` tinyint(4) NOT NULL,
  `cases_access` tinyint(4) NOT NULL,
  `calendar_access` tinyint(4) NOT NULL,
  `announce_access` tinyint(4) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `file_name` varchar(100) NOT NULL,
  `pass_change` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `admin`, `client`, `fname`, `lname`, `email`, `password`, `role`, `case_no`, `team_access`, `tasks_access`, `cases_access`, `calendar_access`, `announce_access`, `date_created`, `file_name`, `pass_change`) VALUES
(1, 1, 0, 'Peter', 'Kariuki', 'petero@gmail.com', '123456', 'Legal Assistant', NULL, 1, 1, 1, 1, 1, '2025-04-03 16:01:04', 'man.jpg', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cases`
--
ALTER TABLE `cases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_attendance_memo`
--
ALTER TABLE `case_attendance_memo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_client_advocate`
--
ALTER TABLE `case_client_advocate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_conf`
--
ALTER TABLE `case_conf`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_correspondence`
--
ALTER TABLE `case_correspondence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_court_docs`
--
ALTER TABLE `case_court_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_docs`
--
ALTER TABLE `case_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_pleadings`
--
ALTER TABLE `case_pleadings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_serv`
--
ALTER TABLE `case_serv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `case_timeline`
--
ALTER TABLE `case_timeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `case_id` (`case_id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `conveyancing`
--
ALTER TABLE `conveyancing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_attendance_memo`
--
ALTER TABLE `conv_attendance_memo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_client_advocate`
--
ALTER TABLE `conv_client_advocate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_conf`
--
ALTER TABLE `conv_conf`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_correspondence`
--
ALTER TABLE `conv_correspondence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_court_docs`
--
ALTER TABLE `conv_court_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_parties`
--
ALTER TABLE `conv_parties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conv_pleadings`
--
ALTER TABLE `conv_pleadings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `correspondence`
--
ALTER TABLE `correspondence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `finance`
--
ALTER TABLE `finance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `miscellaneous`
--
ALTER TABLE `miscellaneous`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_attendance_memo`
--
ALTER TABLE `misc_attendance_memo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_client_advocate`
--
ALTER TABLE `misc_client_advocate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_conf`
--
ALTER TABLE `misc_conf`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_correspondence`
--
ALTER TABLE `misc_correspondence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_court_docs`
--
ALTER TABLE `misc_court_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_docs`
--
ALTER TABLE `misc_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `misc_pleadings`
--
ALTER TABLE `misc_pleadings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parties`
--
ALTER TABLE `parties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `summary`
--
ALTER TABLE `summary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_booking`
--
ALTER TABLE `task_booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_docs`
--
ALTER TABLE `task_docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cases`
--
ALTER TABLE `cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `case_attendance_memo`
--
ALTER TABLE `case_attendance_memo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_client_advocate`
--
ALTER TABLE `case_client_advocate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_conf`
--
ALTER TABLE `case_conf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_correspondence`
--
ALTER TABLE `case_correspondence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_court_docs`
--
ALTER TABLE `case_court_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_docs`
--
ALTER TABLE `case_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_pleadings`
--
ALTER TABLE `case_pleadings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_serv`
--
ALTER TABLE `case_serv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `case_timeline`
--
ALTER TABLE `case_timeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conveyancing`
--
ALTER TABLE `conveyancing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conv_attendance_memo`
--
ALTER TABLE `conv_attendance_memo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conv_client_advocate`
--
ALTER TABLE `conv_client_advocate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conv_conf`
--
ALTER TABLE `conv_conf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conv_correspondence`
--
ALTER TABLE `conv_correspondence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conv_court_docs`
--
ALTER TABLE `conv_court_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conv_parties`
--
ALTER TABLE `conv_parties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `conv_pleadings`
--
ALTER TABLE `conv_pleadings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `correspondence`
--
ALTER TABLE `correspondence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `finance`
--
ALTER TABLE `finance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `miscellaneous`
--
ALTER TABLE `miscellaneous`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `misc_attendance_memo`
--
ALTER TABLE `misc_attendance_memo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `misc_client_advocate`
--
ALTER TABLE `misc_client_advocate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `misc_conf`
--
ALTER TABLE `misc_conf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `misc_correspondence`
--
ALTER TABLE `misc_correspondence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `misc_court_docs`
--
ALTER TABLE `misc_court_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `misc_docs`
--
ALTER TABLE `misc_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `misc_pleadings`
--
ALTER TABLE `misc_pleadings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parties`
--
ALTER TABLE `parties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `summary`
--
ALTER TABLE `summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `task_booking`
--
ALTER TABLE `task_booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_docs`
--
ALTER TABLE `task_docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `case_timeline`
--
ALTER TABLE `case_timeline`
  ADD CONSTRAINT `case_timeline_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`);

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
