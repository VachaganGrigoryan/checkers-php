-- Database: `shashki`
--

-- --------------------------------------------------------

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+04:00";

--
-- Table structure for table `tbl_users`
--

CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `ip` int(10) unsigned NOT NULL,
  `code` varchar(100) NOT NULL,
  `last_activity` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `last_activity` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci AUTO_INCREMENT=1 ;

--
-- Table structure for table `tbl_field`
--

CREATE TABLE IF NOT EXISTS `tbl_field` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code_1` varchar(100) NOT NULL,
  `code_2` varchar(100) NOT NULL,
  `field` varchar(1000) NOT NULL,
  `status` enum('Y','N') NOT NULL DEFAULT 'N',
  `xod` enum('2','3') NOT NULL DEFAULT '2',
  `ts` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `code_1` (`code_1`),
  KEY `ts` (`ts`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci AUTO_INCREMENT=1 ;

-- 
-- Table structure for table `tbl_chat` 
-- 

CREATE TABLE `tbl_chat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `chatID` varchar(100) NOT NULL,
  `author` varchar(16) NOT NULL,
  `code` varchar(100) NOT NULL,
  `text` varchar(255) NOT NULL,
  `time` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci AUTO_INCREMENT=1 ;
