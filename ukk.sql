-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2024 at 02:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ukk`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pemesanans`
--

CREATE TABLE `detail_pemesanans` (
  `id_detail_pemesanan` int(11) NOT NULL,
  `id_pemesanan` int(11) DEFAULT NULL,
  `id_kamar` int(11) DEFAULT NULL,
  `tgl_akses` datetime DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_pemesanans`
--

INSERT INTO `detail_pemesanans` (`id_detail_pemesanan`, `id_pemesanan`, `id_kamar`, `tgl_akses`, `harga`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2024-11-01 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(2, 1, 1, '2024-11-02 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(3, 1, 1, '2024-11-03 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(4, 1, 1, '2024-11-04 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(5, 1, 2, '2024-11-01 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(6, 1, 2, '2024-11-02 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(7, 1, 2, '2024-11-03 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(8, 1, 2, '2024-11-04 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(9, 1, 3, '2024-11-01 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(10, 1, 3, '2024-11-02 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(11, 1, 3, '2024-11-03 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19'),
(12, 1, 3, '2024-11-04 00:00:00', 1800000, '2024-10-27 13:16:19', '2024-10-27 13:16:19');

-- --------------------------------------------------------

--
-- Table structure for table `kamars`
--

CREATE TABLE `kamars` (
  `id_kamar` int(11) NOT NULL,
  `nomor_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamars`
--

INSERT INTO `kamars` (`id_kamar`, `nomor_kamar`, `id_tipe_kamar`, `createdAt`, `updatedAt`) VALUES
(1, 101, 1, '2024-10-27 13:04:30', '2024-10-27 13:04:30'),
(2, 102, 1, '2024-10-27 13:05:11', '2024-10-27 13:05:11'),
(3, 103, 1, '2024-10-27 13:05:17', '2024-10-27 13:05:17'),
(4, 111, 2, '2024-10-27 13:08:25', '2024-10-27 13:08:25'),
(5, 112, 2, '2024-10-27 13:08:32', '2024-10-27 13:08:32'),
(6, 113, 2, '2024-10-27 13:08:37', '2024-10-27 13:08:37'),
(7, 121, 6, '2024-10-27 13:10:19', '2024-10-27 13:10:19'),
(8, 122, 6, '2024-10-27 13:10:23', '2024-10-27 13:10:23'),
(9, 123, 6, '2024-10-27 13:10:28', '2024-10-27 13:10:28'),
(10, 126, 5, '2024-10-27 13:10:38', '2024-10-27 13:10:38'),
(11, 127, 5, '2024-10-27 13:10:43', '2024-10-27 13:10:43'),
(12, 128, 5, '2024-10-27 13:10:48', '2024-10-27 13:10:48'),
(13, 131, 3, '2024-10-27 13:11:35', '2024-10-27 13:11:35'),
(14, 132, 3, '2024-10-27 13:11:39', '2024-10-27 13:11:39'),
(15, 133, 3, '2024-10-27 13:11:43', '2024-10-27 13:11:43'),
(16, 141, 4, '2024-10-27 13:12:09', '2024-10-27 13:12:09'),
(17, 142, 4, '2024-10-27 13:12:13', '2024-10-27 13:12:13'),
(18, 143, 4, '2024-10-27 13:12:18', '2024-10-27 13:12:18'),
(19, 104, 1, '2024-10-27 13:13:39', '2024-10-27 13:13:39'),
(20, 105, 1, '2024-10-27 13:13:53', '2024-10-27 13:13:53');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanans`
--

CREATE TABLE `pemesanans` (
  `id_pemesanan` int(11) NOT NULL,
  `nomor_pemesanan` int(11) DEFAULT NULL,
  `nama_pemesan` varchar(255) DEFAULT NULL,
  `email_pemesan` varchar(255) DEFAULT NULL,
  `tgl_pemesanan` datetime DEFAULT NULL,
  `tgl_checkin` datetime DEFAULT NULL,
  `tgl_checkout` datetime DEFAULT NULL,
  `nama_tamu` varchar(255) DEFAULT NULL,
  `jumlah_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) DEFAULT NULL,
  `status_pemesanan` enum('baru','checkin','checkout') DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pemesanans`
--

INSERT INTO `pemesanans` (`id_pemesanan`, `nomor_pemesanan`, `nama_pemesan`, `email_pemesan`, `tgl_pemesanan`, `tgl_checkin`, `tgl_checkout`, `nama_tamu`, `jumlah_kamar`, `id_tipe_kamar`, `status_pemesanan`, `id_user`, `createdAt`, `updatedAt`) VALUES
(1, 13069556, 'Niel', 'rere@gmail.com', '2024-10-27 13:16:19', '2024-11-01 00:00:00', '2024-11-05 00:00:00', 'reva rahayu', 3, 1, 'checkout', 3, '2024-10-27 13:16:19', '2024-10-27 13:32:09');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240917040532-create-user.js'),
('20240917040831-create-pemesanan.js'),
('20240917040948-create-detail-pemesanan.js'),
('20240917041112-create-kamar.js'),
('20240917041228-create-tipe-kamar.js');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_kamars`
--

CREATE TABLE `tipe_kamars` (
  `id_tipe_kamar` int(11) NOT NULL,
  `nama_tipe_kamar` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipe_kamars`
--

INSERT INTO `tipe_kamars` (`id_tipe_kamar`, `nama_tipe_kamar`, `harga`, `deskripsi`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'Deluxe Room', 1800000, 'Kamar luas dengan fasilitas premium, area duduk, dan dekorasi elegan, memberikan pengalaman mewah.', 'image-1730030103151-deluxeRoom.jpeg', '2024-10-27 11:55:03', '2024-10-27 12:26:40'),
(2, 'Suite Room', 2000000, 'Kamar eksklusif dengan ruang tamu terpisah dan fasilitas ekstra, ideal untuk tamu yang menginginkan privasi dan kenyamanan lebih.', 'image-1730030204790-suiteroom.png', '2024-10-27 11:56:44', '2024-10-27 11:56:44'),
(3, 'Single Room', 900000, 'Kamar eksklusif dengan ruang tamu terpisah dan fasilitas ekstra, ideal untuk tamu yang menginginkan privasi dan kenyamanan lebih.', 'image-1730030280823-singleroom.png', '2024-10-27 11:58:00', '2024-10-27 11:58:00'),
(4, 'Double Room', 1200000, 'Kamar dengan satu tempat tidur besar queen size, cocok untuk pasangan.', 'image-1730030362657-doubleroom.jpeg', '2024-10-27 11:59:22', '2024-10-27 11:59:22'),
(5, 'Twin Room', 1000000, 'Kamar dengan dua tempat tidur single terpisah, cocok untuk tamu yang ingin tidur terpisah.', 'image-1730030486230-twinRoom.jpeg', '2024-10-27 12:01:26', '2024-10-27 12:01:26'),
(6, 'Family Room', 1500000, 'Kamar luas dengan beberapa tempat tidur, ideal untuk keluarga atau grup kecil.', 'image-1730030659998-familyRoom.jpeg', '2024-10-27 12:04:20', '2024-10-27 12:04:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama_user` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','resepsionis','customer') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama_user`, `foto`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Lucas Nicolas', 'image-1730027881515-Profile-1.jpg', 'lucas@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'admin', '2024-10-27 11:18:01', '2024-10-27 12:43:48'),
(2, 'Mechika Erica', 'image-1730028121409-Profile-2.jpg', 'erica@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'resepsionis', '2024-10-27 11:22:01', '2024-10-27 11:22:01'),
(3, 'Daniel Adhi Wardhana', 'image-1730028164998-Profile-3.jpg', 'niel@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'customer', '2024-10-27 11:22:45', '2024-10-27 11:22:45'),
(4, 'Jasmine Assegaf', 'image-1730034202845-luculucu.jpg', 'jasmine@gmail.com', '25d55ad283aa400af464c76d713c07ad', 'resepsionis', '2024-10-27 13:03:22', '2024-10-27 13:03:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD PRIMARY KEY (`id_detail_pemesanan`);

--
-- Indexes for table `kamars`
--
ALTER TABLE `kamars`
  ADD PRIMARY KEY (`id_kamar`);

--
-- Indexes for table `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD PRIMARY KEY (`id_pemesanan`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  ADD PRIMARY KEY (`id_tipe_kamar`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  MODIFY `id_detail_pemesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kamars`
--
ALTER TABLE `kamars`
  MODIFY `id_kamar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pemesanans`
--
ALTER TABLE `pemesanans`
  MODIFY `id_pemesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  MODIFY `id_tipe_kamar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
