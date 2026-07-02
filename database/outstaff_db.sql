-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2026 at 08:04 AM
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
-- Database: `outstaff_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `lock_until` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `failed_attempts`, `lock_until`, `created_at`) VALUES
(2, 'Super Admin', 'admin@gmail.com', '$2b$12$cFdAh/L.9QcQ4/01D3.kvOb4gx3zokj2fSbtVSIeDGMcMeGGAHe5q', 0, NULL, '2026-03-02 12:22:28');

-- --------------------------------------------------------

--
-- Table structure for table `department_table`
--

CREATE TABLE `department_table` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_table`
--

INSERT INTO `department_table` (`department_id`, `department_name`, `status`, `created_at`) VALUES
(1, 'IT', 1, '2026-02-28 10:33:30'),
(2, 'Accounts', 1, '2026-02-28 10:33:54'),
(3, 'HR', 1, '2026-02-28 10:33:54');

-- --------------------------------------------------------

--
-- Table structure for table `designation_table`
--

CREATE TABLE `designation_table` (
  `designation_id` int(11) NOT NULL,
  `designation_name` varchar(100) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designation_table`
--

INSERT INTO `designation_table` (`designation_id`, `designation_name`, `status`, `created_at`) VALUES
(1, 'Developer', 1, '2026-02-28 10:34:39'),
(2, 'assistant', 1, '2026-02-28 10:34:39');

-- --------------------------------------------------------

--
-- Table structure for table `employee_master`
--

CREATE TABLE `employee_master` (
  `employee_id` int(11) NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `employee_name` varchar(100) NOT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_master`
--

INSERT INTO `employee_master` (`employee_id`, `employee_code`, `employee_name`, `father_name`, `department_id`, `designation_id`, `vendor_id`, `contact`, `status`, `created_at`) VALUES
(2, 'EMP1001', 'Aman Kumar', 'Harry Kumar', 2, 2, 1, '9888988898', 'Active', '2026-02-28 11:31:01'),
(3, 'EMP1002', 'Tushar Kaundal', 'Rajinder Kaundal', 2, 2, 2, '7981408104', 'Active', '2026-02-28 11:32:15'),
(4, 'EMP1003', 'Sahil', 'Manoj', 2, 2, 2, '9023153113', 'Active', '2026-06-10 05:01:09'),
(5, 'EMP1004', 'Sri Valli', 'Konta Reddy', 3, 2, 2, '9998877321', 'Active', '2026-06-10 05:02:52'),
(6, 'EMP1005', 'Ayush', 'ramandeep', 1, 1, 1, '6782435077', 'Active', '2026-06-10 05:19:52');

-- --------------------------------------------------------

--
-- Table structure for table `item_group_master`
--

CREATE TABLE `item_group_master` (
  `item_group_id` int(11) NOT NULL,
  `item_group_name` varchar(150) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_group_master`
--

INSERT INTO `item_group_master` (`item_group_id`, `item_group_name`, `status`, `created_at`) VALUES
(1, 'SOFTWARE', 1, '2026-02-28 17:49:33'),
(2, 'HARDWARE', 1, '2026-03-01 00:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `item_master`
--

CREATE TABLE `item_master` (
  `item_id` int(11) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `item_rate` decimal(10,2) DEFAULT 0.00,
  `item_group_id` int(11) DEFAULT NULL,
  `item_process_id` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_master`
--

INSERT INTO `item_master` (`item_id`, `item_code`, `item_name`, `item_rate`, `item_group_id`, `item_process_id`, `status`, `created_at`) VALUES
(1, '1001', 'Software ( Accounting )', 35000.00, 1, 1, 1, '2026-02-28 17:51:00'),
(2, '1002', 'Server System', 150000.00, 2, 2, 1, '2026-03-01 00:04:50');

-- --------------------------------------------------------

--
-- Table structure for table `item_process_master`
--

CREATE TABLE `item_process_master` (
  `item_process_id` int(11) NOT NULL,
  `item_process_name` varchar(150) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_process_master`
--

INSERT INTO `item_process_master` (`item_process_id`, `item_process_name`, `status`, `created_at`) VALUES
(1, 'SOFTWARE TRAINING', 1, '2026-02-28 17:50:09'),
(2, 'IMPLEMENTATION', 1, '2026-03-01 00:07:29');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('ADMIN','USER') DEFAULT 'USER',
  `in_time` datetime NOT NULL,
  `out_time` datetime DEFAULT NULL,
  `flag` enum('I','O') DEFAULT 'I',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `user_id`, `user_type`, `in_time`, `out_time`, `flag`, `created_at`) VALUES
(1, 2, 'ADMIN', '2026-03-06 11:10:39', '2026-03-09 13:29:48', 'O', '2026-03-06 05:40:39'),
(2, 2, 'USER', '2026-03-06 11:11:08', '2026-03-09 13:28:18', 'O', '2026-03-06 05:41:08'),
(3, 2, 'USER', '2026-03-06 11:12:13', '2026-03-07 15:00:14', 'O', '2026-03-06 05:42:13'),
(4, 2, 'USER', '2026-03-06 11:15:15', '2026-03-07 14:55:10', 'O', '2026-03-06 05:45:15'),
(5, 2, 'USER', '2026-03-06 11:15:20', '2026-03-07 11:14:49', 'O', '2026-03-06 05:45:20'),
(6, 2, 'USER', '2026-03-06 11:19:57', '2026-03-06 14:43:28', 'O', '2026-03-06 05:49:57'),
(7, 2, 'USER', '2026-03-06 11:20:57', '2026-03-06 14:30:38', 'O', '2026-03-06 05:50:57'),
(8, 2, 'USER', '2026-03-06 11:21:07', '2026-03-06 13:44:27', 'O', '2026-03-06 05:51:07'),
(9, 2, 'ADMIN', '2026-03-06 11:21:20', '2026-03-06 13:44:19', 'O', '2026-03-06 05:51:20'),
(10, 2, 'ADMIN', '2026-03-06 11:22:35', '2026-03-06 13:26:45', 'O', '2026-03-06 05:52:35'),
(11, 2, 'ADMIN', '2026-03-06 11:26:12', '2026-03-06 13:26:24', 'O', '2026-03-06 05:56:12'),
(12, 2, 'USER', '2026-03-06 11:29:38', '2026-03-06 13:22:39', 'O', '2026-03-06 05:59:38'),
(13, 2, 'USER', '2026-03-06 11:29:46', '2026-03-06 13:22:10', 'O', '2026-03-06 05:59:46'),
(14, 2, 'USER', '2026-03-06 11:29:58', '2026-03-06 13:15:11', 'O', '2026-03-06 05:59:58'),
(15, 2, 'USER', '2026-03-06 11:30:17', '2026-03-06 13:11:10', 'O', '2026-03-06 06:00:17'),
(16, 2, 'ADMIN', '2026-03-06 11:32:40', '2026-03-06 11:32:57', 'O', '2026-03-06 06:02:40'),
(17, 2, 'ADMIN', '2026-03-06 11:33:15', '2026-03-06 11:35:18', 'O', '2026-03-06 06:03:15'),
(18, 2, 'USER', '2026-03-06 11:35:56', '2026-03-06 13:05:08', 'O', '2026-03-06 06:05:56'),
(19, 2, 'USER', '2026-03-06 11:39:43', '2026-03-06 11:39:46', 'O', '2026-03-06 06:09:43'),
(20, 2, 'ADMIN', '2026-03-06 11:48:05', '2026-03-06 13:03:50', 'O', '2026-03-06 06:18:05'),
(21, 2, 'ADMIN', '2026-03-06 11:49:19', '2026-03-06 12:08:40', 'O', '2026-03-06 06:19:19'),
(22, 2, 'ADMIN', '2026-03-06 12:29:22', '2026-03-06 12:50:15', 'O', '2026-03-06 06:59:22');

-- --------------------------------------------------------

--
-- Table structure for table `menu_permissions`
--

CREATE TABLE `menu_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_key` varchar(100) NOT NULL,
  `can_active` tinyint(1) DEFAULT 0,
  `can_add` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `can_print` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_permissions`
--

INSERT INTO `menu_permissions` (`id`, `user_id`, `menu_key`, `can_active`, `can_add`, `can_edit`, `can_delete`, `can_print`, `created_at`) VALUES
(75, 1, 'ITEM_MASTERS', 1, 1, 1, 0, 0, '2026-02-28 11:35:59'),
(76, 1, 'DAILY_PRODUCTION', 1, 1, 0, 0, 0, '2026-02-28 11:35:59'),
(77, 1, 'SALARY_REPORT', 1, 0, 0, 0, 1, '2026-02-28 11:35:59'),
(78, 1, 'EMPLOYEE_MASTER', 1, 0, 1, 1, 0, '2026-02-28 11:35:59'),
(177, 2, 'DAILY_PRODUCTION', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(178, 2, 'SALARY_REPORT', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(179, 2, 'ITEM_MASTERS', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(180, 2, 'EMPLOYEE_MASTERS', 1, 0, 0, 0, 0, '2026-06-10 05:16:52'),
(181, 2, 'CONTRACTOR_VENDOR_MASTERS', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(182, 2, 'PRODUCT_PROCESS', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(183, 2, 'GROUP_MASTER', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(184, 2, 'MONTHLY_PRODUCTION', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(185, 2, 'UPLOAD_PRODUCTION', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(186, 2, 'ADVANCE_UPLOAD', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(187, 2, 'ITEM_WISE_REPORT', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(188, 2, 'EMPLOYEE_WISE_REPORT', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(189, 2, 'CONTRACTOR_VENDOR_WISE_REPORT', 1, 1, 1, 1, 1, '2026-06-10 05:16:52'),
(190, 2, 'EMPLOYEE_MASTER', 1, 1, 1, 1, 1, '2026-06-10 05:16:52');

-- --------------------------------------------------------

--
-- Table structure for table `production_table`
--

CREATE TABLE `production_table` (
  `production_id` int(11) NOT NULL,
  `production_date` date NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `qty` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `production_table`
--

INSERT INTO `production_table` (`production_id`, `production_date`, `employee_code`, `item_code`, `qty`, `created_at`) VALUES
(11, '2026-02-28', 'EMP1001', '1002', 20, '2026-03-01 01:59:23'),
(12, '2026-02-28', 'EMP1002', '1001', 5, '2026-03-01 02:22:58'),
(13, '2026-02-28', 'EMP1001', '1002', 1, '2026-03-01 02:24:04'),
(14, '2026-02-28', 'EMP1001', '1002', 5, '2026-03-01 02:24:04'),
(15, '2026-03-01', 'EMP1002', '1002', 1, '2026-03-01 02:27:47'),
(16, '2026-03-01', 'EMP1001', '1002', 4, '2026-03-01 02:27:47'),
(17, '2026-03-02', 'EMP1001', '1001', 20, '2026-03-02 11:15:34'),
(18, '2026-03-02', 'EMP1002', '1002', 2, '2026-03-02 11:15:34'),
(19, '2026-02-27', 'EMP1001', '1001', 5, '2026-03-02 11:57:56'),
(20, '2026-02-27', 'EMP1002', '1002', 2, '2026-03-02 11:57:56'),
(21, '2026-03-04', 'EMP1001', '1001', 5, '2026-03-02 15:09:09'),
(22, '2026-03-04', 'EMP1002', '1002', 2, '2026-03-02 15:09:09'),
(23, '2026-03-06', 'emp1001', '1002', 20, '2026-03-06 14:51:15'),
(24, '2026-03-06', 'emp1002', '1001', 2, '2026-03-06 14:51:15'),
(25, '2026-03-06', 'emp1001', '1001', 1, '2026-03-06 14:51:15'),
(26, '2026-06-10', 'EMP1001', '1001', 20, '2026-06-10 10:29:44'),
(27, '2026-06-10', 'EMP1002', '1002', 10, '2026-06-10 10:29:44'),
(28, '2026-06-10', 'EMP1001', '1002', 20, '2026-06-10 10:51:28'),
(29, '2026-06-10', 'EMP1005', '1002', 5, '2026-06-10 10:51:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `contact`, `created_at`) VALUES
(1, 'Sunil', 'sunilg@gmail.com', '$2b$12$n5A4cJkfbJdur9ZSSCtVju0lSOnwYPiwvOpyFY9WHledgEvcIZEOK', '8398783978', '2026-02-28 07:19:55'),
(2, 'Devansh Singla', 'devanshsinglaa@gmail.com', '$2b$12$MvyU.qLolcSOysG.vG6W9eRPmYXT2OobMp8pudQx1XbK/7bT4iTjK', '9877817998', '2026-02-28 07:19:55'),
(3, 'sahil', 'sahilsp@gmail.com', '$2b$12$UgqP8P1p/NDDtdEOKPCkn.nLtsJzowHtD1/mGbSNBXI71h6cO23pq', '9023153113', '2026-03-02 10:25:07'),
(4, 'Tushar', 'tushartk@gmail.com', '$2b$12$Q4FN9RdWXe98pUYoceM4x.LoLahLpNNvErRF0sBU4JcD8vpp.18/e', '7814309804', '2026-03-02 10:25:50'),
(5, 'nitin', 'nitin@gmail.com', '$2b$12$CHf4ArGdv7W/iWjqNUHDg.39WsBYf1yUyCy8mSaRIpgtBwMyi3gCG', '6283435077', '2026-03-02 12:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `vendor_contractor_master`
--

CREATE TABLE `vendor_contractor_master` (
  `vendor_id` int(11) NOT NULL,
  `vendor_code` varchar(50) NOT NULL,
  `vendor_name` varchar(150) NOT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendor_table`
--

CREATE TABLE `vendor_table` (
  `vendor_id` int(11) NOT NULL,
  `vendor_code` varchar(50) DEFAULT NULL,
  `vendor_name` varchar(150) NOT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendor_table`
--

INSERT INTO `vendor_table` (`vendor_id`, `vendor_code`, `vendor_name`, `gst_number`, `address`, `mobile`, `email`, `status`, `created_at`) VALUES
(1, 'V001', 'Affordable Solutions', '19120910', 'bhaibala chowk, Ludhiana', '9877887778', 'affordableacs@gmail.com', 1, '2026-02-28 10:37:18'),
(2, 'V002', 'spine', '129182091', 'Mumbai', '7877878787', 'spine.technologies@gmail.com', 1, '2026-02-28 10:37:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `department_table`
--
ALTER TABLE `department_table`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `designation_table`
--
ALTER TABLE `designation_table`
  ADD PRIMARY KEY (`designation_id`);

--
-- Indexes for table `employee_master`
--
ALTER TABLE `employee_master`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `designation_id` (`designation_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `item_group_master`
--
ALTER TABLE `item_group_master`
  ADD PRIMARY KEY (`item_group_id`);

--
-- Indexes for table `item_master`
--
ALTER TABLE `item_master`
  ADD PRIMARY KEY (`item_id`),
  ADD UNIQUE KEY `item_code` (`item_code`),
  ADD KEY `item_group_id` (`item_group_id`),
  ADD KEY `item_process_id` (`item_process_id`);

--
-- Indexes for table `item_process_master`
--
ALTER TABLE `item_process_master`
  ADD PRIMARY KEY (`item_process_id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `production_table`
--
ALTER TABLE `production_table`
  ADD PRIMARY KEY (`production_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vendor_contractor_master`
--
ALTER TABLE `vendor_contractor_master`
  ADD PRIMARY KEY (`vendor_id`),
  ADD UNIQUE KEY `vendor_code` (`vendor_code`);

--
-- Indexes for table `vendor_table`
--
ALTER TABLE `vendor_table`
  ADD PRIMARY KEY (`vendor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `department_table`
--
ALTER TABLE `department_table`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `designation_table`
--
ALTER TABLE `designation_table`
  MODIFY `designation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee_master`
--
ALTER TABLE `employee_master`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `item_group_master`
--
ALTER TABLE `item_group_master`
  MODIFY `item_group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `item_master`
--
ALTER TABLE `item_master`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `item_process_master`
--
ALTER TABLE `item_process_master`
  MODIFY `item_process_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT for table `production_table`
--
ALTER TABLE `production_table`
  MODIFY `production_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vendor_contractor_master`
--
ALTER TABLE `vendor_contractor_master`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendor_table`
--
ALTER TABLE `vendor_table`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_master`
--
ALTER TABLE `employee_master`
  ADD CONSTRAINT `employee_master_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department_table` (`department_id`),
  ADD CONSTRAINT `employee_master_ibfk_2` FOREIGN KEY (`designation_id`) REFERENCES `designation_table` (`designation_id`),
  ADD CONSTRAINT `employee_master_ibfk_3` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_table` (`vendor_id`);

--
-- Constraints for table `item_master`
--
ALTER TABLE `item_master`
  ADD CONSTRAINT `item_master_ibfk_1` FOREIGN KEY (`item_group_id`) REFERENCES `item_group_master` (`item_group_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `item_master_ibfk_2` FOREIGN KEY (`item_process_id`) REFERENCES `item_process_master` (`item_process_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  ADD CONSTRAINT `menu_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

