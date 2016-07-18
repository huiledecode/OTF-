-- phpMyAdmin SQL Dump
-- version 4.6.0
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Lun 18 Juillet 2016 à 16:20
-- Version du serveur :  5.7.12-0ubuntu1.1
-- Version de PHP :  7.0.4-7ubuntu2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `otf_demo`
--

-- --------------------------------------------------------

--
-- Structure de la table `accounts`
--

CREATE TABLE `accounts` (
  `_id` int(11) NOT NULL,
  `titre` varchar(4) NOT NULL,
  `nom` varchar(40) NOT NULL,
  `prenom` varchar(25) NOT NULL,
  `login` varchar(40) NOT NULL,
  `password` varchar(20) NOT NULL,
  `role_id` int(11) NOT NULL,
  `adresse1` varchar(50) NOT NULL,
  `adresse2` varchar(50) NOT NULL,
  `code_postal` varchar(8) NOT NULL,
  `ville` varchar(50) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `email` varchar(40) NOT NULL,
  `node` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `countries`
--

CREATE TABLE `countries` (
  `_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(2) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `countries`
--

INSERT INTO `countries` (`_id`, `name`, `code`, `created_date`) VALUES
(1, 'Afghanistan', 'AF', '2016-07-17 15:24:38'),
(2, 'Albania', 'AL', '2016-07-17 15:24:38'),
(3, 'Algeria', 'DZ', '2016-07-17 15:24:38'),
(4, 'American Samoa', 'AS', '2016-07-17 15:24:38'),
(5, 'Andorra', 'AD', '2016-07-17 15:24:38'),
(6, 'Angola', 'AO', '2016-07-17 15:24:38'),
(7, 'Anguilla', 'AI', '2016-07-17 15:24:38'),
(8, 'Antarctica', 'AQ', '2016-07-17 15:24:38'),
(9, 'Antigua And Barbuda', 'AG', '2016-07-17 15:24:38'),
(10, 'Argentina', 'AR', '2016-07-17 15:24:38'),
(11, 'Armenia', 'AM', '2016-07-17 15:24:38'),
(12, 'Aruba', 'AW', '2016-07-17 15:24:38'),
(13, 'Australia', 'AU', '2016-07-17 15:24:38'),
(14, 'Austria', 'AT', '2016-07-17 15:24:38'),
(15, 'Azerbaijan', 'AZ', '2016-07-17 15:24:38'),
(16, 'Bahamas', 'BS', '2016-07-17 15:24:38'),
(17, 'Bahrain', 'BH', '2016-07-17 15:24:38'),
(18, 'Bangladesh', 'BD', '2016-07-17 15:24:38'),
(19, 'Barbados', 'BB', '2016-07-17 15:24:38'),
(20, 'Belarus', 'BY', '2016-07-17 15:24:38'),
(21, 'Belgium', 'BE', '2016-07-17 15:24:38'),
(22, 'Belize', 'BZ', '2016-07-17 15:24:38'),
(23, 'Benin', 'BJ', '2016-07-17 15:24:38'),
(24, 'Bermuda', 'BM', '2016-07-17 15:24:38'),
(25, 'Bhutan', 'BT', '2016-07-17 15:24:38'),
(26, 'Bolivia', 'BO', '2016-07-17 15:24:38'),
(27, 'Bosnia And Herzegovina', 'BA', '2016-07-17 15:24:38'),
(28, 'Botswana', 'BW', '2016-07-17 15:24:38'),
(29, 'Bouvet Island', 'BV', '2016-07-17 15:24:38'),
(30, 'Brazil', 'BR', '2016-07-17 15:24:38'),
(31, 'British Indian Ocean Territory', 'IO', '2016-07-17 15:24:38'),
(32, 'Brunei Darussalam', 'BN', '2016-07-17 15:24:38'),
(33, 'Bulgaria', 'BG', '2016-07-17 15:24:38'),
(34, 'Burkina Faso', 'BF', '2016-07-17 15:24:38'),
(35, 'Burundi', 'BI', '2016-07-17 15:24:38'),
(36, 'Cambodia', 'KH', '2016-07-17 15:24:38'),
(37, 'Cameroon', 'CM', '2016-07-17 15:24:38'),
(38, 'Canada', 'CA', '2016-07-17 15:24:38'),
(39, 'Cape Verde', 'CV', '2016-07-17 15:24:38'),
(40, 'Cayman Islands', 'KY', '2016-07-17 15:24:38'),
(41, 'Central African Republic', 'CF', '2016-07-17 15:24:38'),
(42, 'Chad', 'TD', '2016-07-17 15:24:38'),
(43, 'Chile', 'CL', '2016-07-17 15:24:38'),
(44, 'China', 'CN', '2016-07-17 15:24:38'),
(45, 'Christmas Island', 'CX', '2016-07-17 15:24:38'),
(46, 'Cocos (keeling) Islands', 'CC', '2016-07-17 15:24:38'),
(47, 'Colombia', 'CO', '2016-07-17 15:24:38'),
(48, 'Comoros', 'KM', '2016-07-17 15:24:38'),
(49, 'Congo', 'CG', '2016-07-17 15:24:38'),
(50, 'Congo The Dem. Rep. Of', 'CD', '2016-07-17 15:24:38'),
(51, 'Cook Islands', 'CK', '2016-07-17 15:24:38'),
(52, 'Costa Rica', 'CR', '2016-07-17 15:24:38'),
(53, 'Cote D\'ivoire', 'CI', '2016-07-17 15:24:38'),
(54, 'Croatia', 'HR', '2016-07-17 15:24:38'),
(55, 'Cuba', 'CU', '2016-07-17 15:24:38'),
(56, 'Cyprus', 'CY', '2016-07-17 15:24:38'),
(57, 'Czech Republic', 'CZ', '2016-07-17 15:24:38'),
(58, 'Denmark', 'DK', '2016-07-17 15:24:38'),
(59, 'Djibouti', 'DJ', '2016-07-17 15:24:38'),
(60, 'Dominica', 'DM', '2016-07-17 15:24:38'),
(61, 'Dominican Republic', 'DO', '2016-07-17 15:24:38'),
(62, 'East Timor', 'TP', '2016-07-17 15:24:38'),
(63, 'Ecuador', 'EC', '2016-07-17 15:24:38'),
(64, 'Egypt', 'EG', '2016-07-17 15:24:38'),
(65, 'El Salvador', 'SV', '2016-07-17 15:24:38'),
(66, 'Equatorial Guinea', 'GQ', '2016-07-17 15:24:38'),
(67, 'Eritrea', 'ER', '2016-07-17 15:24:38'),
(68, 'Estonia', 'EE', '2016-07-17 15:24:38'),
(69, 'Ethiopia', 'ET', '2016-07-17 15:24:38'),
(70, 'Falkland Islands (malvinas)', 'FK', '2016-07-17 15:24:38'),
(71, 'Faroe Islands', 'FO', '2016-07-17 15:24:38'),
(72, 'Fiji', 'FJ', '2016-07-17 15:24:38'),
(73, 'Finland', 'FI', '2016-07-17 15:24:38'),
(74, 'France', 'FR', '2016-07-17 15:24:38'),
(75, 'French Guiana', 'GF', '2016-07-17 15:24:38'),
(76, 'French Polynesia', 'PF', '2016-07-17 15:24:38'),
(77, 'French Southern Territories', 'TF', '2016-07-17 15:24:38'),
(78, 'Gabon', 'GA', '2016-07-17 15:24:38'),
(79, 'Gambia', 'GM', '2016-07-17 15:24:38'),
(80, 'Georgia', 'GE', '2016-07-17 15:24:38'),
(81, 'Germany', 'DE', '2016-07-17 15:24:38'),
(82, 'Ghana', 'GH', '2016-07-17 15:24:38'),
(83, 'Gibraltar', 'GI', '2016-07-17 15:24:38'),
(84, 'Greece', 'GR', '2016-07-17 15:24:38'),
(85, 'Greenland', 'GL', '2016-07-17 15:24:38'),
(86, 'Grenada', 'GD', '2016-07-17 15:24:38'),
(87, 'Guadeloupe', 'GP', '2016-07-17 15:24:38'),
(88, 'Guam', 'GU', '2016-07-17 15:24:38'),
(89, 'Guatemala', 'GT', '2016-07-17 15:24:38'),
(90, 'Guinea', 'GN', '2016-07-17 15:24:39'),
(91, 'Guinea-bissau', 'GW', '2016-07-17 15:24:39'),
(92, 'Guyana', 'GY', '2016-07-17 15:24:39'),
(93, 'Haiti', 'HT', '2016-07-17 15:24:39'),
(94, 'Heard Island And Mcdonald Islands', 'HM', '2016-07-17 15:24:39'),
(95, 'Holy See (vatican City State)', 'VA', '2016-07-17 15:24:39'),
(96, 'Honduras', 'HN', '2016-07-17 15:24:39'),
(97, 'Hong Kong', 'HK', '2016-07-17 15:24:39'),
(98, 'Hungary', 'HU', '2016-07-17 15:24:39'),
(99, 'Iceland', 'IS', '2016-07-17 15:24:39'),
(100, 'India', 'IN', '2016-07-17 15:24:39'),
(101, 'Indonesia', 'ID', '2016-07-17 15:24:39'),
(102, 'Iran Islamic Republic Of', 'IR', '2016-07-17 15:24:39'),
(103, 'Iraq', 'IQ', '2016-07-17 15:24:39'),
(104, 'Ireland', 'IE', '2016-07-17 15:24:39'),
(105, 'Israel', 'IL', '2016-07-17 15:24:39'),
(106, 'Italy', 'IT', '2016-07-17 15:24:39'),
(107, 'Jamaica', 'JM', '2016-07-17 15:24:39'),
(108, 'Japan', 'JP', '2016-07-17 15:24:39'),
(109, 'Jordan', 'JO', '2016-07-17 15:24:39'),
(110, 'Kazakstan', 'KZ', '2016-07-17 15:24:39'),
(111, 'Kenya', 'KE', '2016-07-17 15:24:39'),
(112, 'Kiribati', 'KI', '2016-07-17 15:24:39'),
(113, 'Korea Dem. People\'s Republic Of', 'KP', '2016-07-17 15:24:39'),
(114, 'Korea Republic Of', 'KR', '2016-07-17 15:24:39'),
(115, 'Kosovo', 'KV', '2016-07-17 15:24:39'),
(116, 'Kuwait', 'KW', '2016-07-17 15:24:39'),
(117, 'Kyrgyzstan', 'KG', '2016-07-17 15:24:39'),
(118, 'Lao People\'s Dem. Rep.', 'LA', '2016-07-17 15:24:39'),
(119, 'Latvia', 'LV', '2016-07-17 15:24:39'),
(120, 'Lebanon', 'LB', '2016-07-17 15:24:39'),
(121, 'Lesotho', 'LS', '2016-07-17 15:24:39'),
(122, 'Liberia', 'LR', '2016-07-17 15:24:39'),
(123, 'Libyan Arab Jamahiriya', 'LY', '2016-07-17 15:24:39'),
(124, 'Liechtenstein', 'LI', '2016-07-17 15:24:39'),
(125, 'Lithuania', 'LT', '2016-07-17 15:24:39'),
(126, 'Luxembourg', 'LU', '2016-07-17 15:24:39'),
(127, 'Macau', 'MO', '2016-07-17 15:24:39'),
(128, 'Macedonia The Former Yugoslav Republic Of', 'MK', '2016-07-17 15:24:39'),
(129, 'Madagascar', 'MG', '2016-07-17 15:24:39'),
(130, 'Malawi', 'MW', '2016-07-17 15:24:39'),
(131, 'Malaysia', 'MY', '2016-07-17 15:24:39'),
(132, 'Maldives', 'MV', '2016-07-17 15:24:39'),
(133, 'Mali', 'ML', '2016-07-17 15:24:39'),
(134, 'Malta', 'MT', '2016-07-17 15:24:39'),
(135, 'Marshall Islands', 'MH', '2016-07-17 15:24:39'),
(136, 'Martinique', 'MQ', '2016-07-17 15:24:39'),
(137, 'Mauritania', 'MR', '2016-07-17 15:24:39'),
(138, 'Mauritius', 'MU', '2016-07-17 15:24:39'),
(139, 'Mayotte', 'YT', '2016-07-17 15:24:39'),
(140, 'Mexico', 'MX', '2016-07-17 15:24:39'),
(141, 'Micronesia Federated States Of', 'FM', '2016-07-17 15:24:39'),
(142, 'Moldova Republic Of', 'MD', '2016-07-17 15:24:39'),
(143, 'Monaco', 'MC', '2016-07-17 15:24:39'),
(144, 'Mongolia', 'MN', '2016-07-17 15:24:39'),
(145, 'Montserrat', 'MS', '2016-07-17 15:24:39'),
(146, 'Montenegro', 'ME', '2016-07-17 15:24:39'),
(147, 'Morocco', 'MA', '2016-07-17 15:24:39'),
(148, 'Mozambique', 'MZ', '2016-07-17 15:24:39'),
(149, 'Myanmar', 'MM', '2016-07-17 15:24:39'),
(150, 'Namibia', 'NA', '2016-07-17 15:24:39'),
(151, 'Nauru', 'NR', '2016-07-17 15:24:39'),
(152, 'Nepal', 'NP', '2016-07-17 15:24:39'),
(153, 'Netherlands', 'NL', '2016-07-17 15:24:39'),
(154, 'Netherlands Antilles', 'AN', '2016-07-17 15:24:39'),
(155, 'New Caledonia', 'NC', '2016-07-17 15:24:39'),
(156, 'New Zealand', 'NZ', '2016-07-17 15:24:39'),
(157, 'Nicaragua', 'NI', '2016-07-17 15:24:39'),
(158, 'Niger', 'NE', '2016-07-17 15:24:39'),
(159, 'Nigeria', 'NG', '2016-07-17 15:24:39'),
(160, 'Niue', 'NU', '2016-07-17 15:24:39'),
(161, 'Norfolk Island', 'NF', '2016-07-17 15:24:39'),
(162, 'Northern Mariana Islands', 'MP', '2016-07-17 15:24:39'),
(163, 'Norway', 'NO', '2016-07-17 15:24:39'),
(164, 'Oman', 'OM', '2016-07-17 15:24:39'),
(165, 'Pakistan', 'PK', '2016-07-17 15:24:39'),
(166, 'Palau', 'PW', '2016-07-17 15:24:39'),
(167, 'Palestinian Territory Occupied', 'PS', '2016-07-17 15:24:39'),
(168, 'Panama', 'PA', '2016-07-17 15:24:39'),
(169, 'Papua New Guinea', 'PG', '2016-07-17 15:24:39'),
(170, 'Paraguay', 'PY', '2016-07-17 15:24:39'),
(171, 'Peru', 'PE', '2016-07-17 15:24:39'),
(172, 'Philippines', 'PH', '2016-07-17 15:24:39'),
(173, 'Pitcairn', 'PN', '2016-07-17 15:24:39'),
(174, 'Poland', 'PL', '2016-07-17 15:24:39'),
(175, 'Portugal', 'PT', '2016-07-17 15:24:39'),
(176, 'Puerto Rico', 'PR', '2016-07-17 15:24:39'),
(177, 'Qatar', 'QA', '2016-07-17 15:24:39'),
(178, 'Reunion', 'RE', '2016-07-17 15:24:39'),
(179, 'Romania', 'RO', '2016-07-17 15:24:39'),
(180, 'Russian Federation', 'RU', '2016-07-17 15:24:39'),
(181, 'Rwanda', 'RW', '2016-07-17 15:24:39'),
(182, 'Saint Helena', 'SH', '2016-07-17 15:24:39'),
(183, 'Saint Kitts And Nevis', 'KN', '2016-07-17 15:24:39'),
(184, 'Saint Lucia', 'LC', '2016-07-17 15:24:39'),
(185, 'Saint Pierre And Miquelon', 'PM', '2016-07-17 15:24:39'),
(186, 'Saint Vincent And The Grenadines', 'VC', '2016-07-17 15:24:39'),
(187, 'Samoa', 'WS', '2016-07-17 15:24:39'),
(188, 'San Marino', 'SM', '2016-07-17 15:24:39'),
(189, 'Sao Tome And Principe', 'ST', '2016-07-17 15:24:39'),
(190, 'Saudi Arabia', 'SA', '2016-07-17 15:24:39'),
(191, 'Senegal', 'SN', '2016-07-17 15:24:39'),
(192, 'Serbia', 'RS', '2016-07-17 15:24:39'),
(193, 'Seychelles', 'SC', '2016-07-17 15:24:39'),
(194, 'Sierra Leone', 'SL', '2016-07-17 15:24:39'),
(195, 'Singapore', 'SG', '2016-07-17 15:24:39'),
(196, 'Slovakia', 'SK', '2016-07-17 15:24:39'),
(197, 'Slovenia', 'SI', '2016-07-17 15:24:39'),
(198, 'Solomon Islands', 'SB', '2016-07-17 15:24:39'),
(199, 'Somalia', 'SO', '2016-07-17 15:24:39'),
(200, 'South Africa', 'ZA', '2016-07-17 15:24:39'),
(201, 'South Georgia And The South Sandwich Islands', 'GS', '2016-07-17 15:24:39'),
(202, 'Spain', 'ES', '2016-07-17 15:24:39'),
(203, 'Sri Lanka', 'LK', '2016-07-17 15:24:39'),
(204, 'Sudan', 'SD', '2016-07-17 15:24:39'),
(205, 'Suriname', 'SR', '2016-07-17 15:24:39'),
(206, 'Svalbard And Jan Mayen', 'SJ', '2016-07-17 15:24:39'),
(207, 'Swaziland', 'SZ', '2016-07-17 15:24:39'),
(208, 'Sweden', 'SE', '2016-07-17 15:24:39'),
(209, 'Switzerland', 'CH', '2016-07-17 15:24:40'),
(210, 'Syrian Arab Republic', 'SY', '2016-07-17 15:24:40'),
(211, 'Taiwan Province Of China', 'TW', '2016-07-17 15:24:40'),
(212, 'Tajikistan', 'TJ', '2016-07-17 15:24:40'),
(213, 'Tanzania United Republic Of', 'TZ', '2016-07-17 15:24:40'),
(214, 'Thailand', 'TH', '2016-07-17 15:24:40'),
(215, 'Togo', 'TG', '2016-07-17 15:24:40'),
(216, 'Tokelau', 'TK', '2016-07-17 15:24:40'),
(217, 'Tonga', 'TO', '2016-07-17 15:24:40'),
(218, 'Trinidad And Tobago', 'TT', '2016-07-17 15:24:40'),
(219, 'Tunisia', 'TN', '2016-07-17 15:24:40'),
(220, 'Turkey', 'TR', '2016-07-17 15:24:40'),
(221, 'Turkmenistan', 'TM', '2016-07-17 15:24:40'),
(222, 'Turks And Caicos Islands', 'TC', '2016-07-17 15:24:40'),
(223, 'Tuvalu', 'TV', '2016-07-17 15:24:40'),
(224, 'Uganda', 'UG', '2016-07-17 15:24:40'),
(225, 'Ukraine', 'UA', '2016-07-17 15:24:40'),
(226, 'United Arab Emirates', 'AE', '2016-07-17 15:24:40'),
(227, 'United Kingdom', 'GB', '2016-07-17 15:24:40'),
(228, 'United States', 'US', '2016-07-17 15:24:40'),
(229, 'United States Minor Outlying Islands', 'UM', '2016-07-17 15:24:40'),
(230, 'Uruguay', 'UY', '2016-07-17 15:24:40'),
(231, 'Uzbekistan', 'UZ', '2016-07-17 15:24:40'),
(232, 'Vanuatu', 'VU', '2016-07-17 15:24:40'),
(233, 'Venezuela', 'VE', '2016-07-17 15:24:40'),
(234, 'Viet Nam', 'VN', '2016-07-17 15:24:40'),
(235, 'Virgin Islands British', 'VG', '2016-07-17 15:24:40'),
(236, 'Virgin Islands U.s.', 'VI', '2016-07-17 15:24:40'),
(237, 'Wallis And Futuna', 'WF', '2016-07-17 15:24:40'),
(238, 'Western Sahara', 'EH', '2016-07-17 15:24:40'),
(239, 'Yemen', 'YE', '2016-07-17 15:24:40'),
(240, 'Zambia', 'ZM', '2016-07-17 15:24:40'),
(241, 'Zimbabwe\n', 'ZW', '2016-07-17 15:24:40');

-- --------------------------------------------------------

--
-- Structure de la table `logs`
--

CREATE TABLE `logs` (
  `_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `event` varchar(20) NOT NULL,
  `message` varchar(100) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `session` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `_id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `libelle` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`_id`);

--
-- Index pour la table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`_id`);

--
-- Index pour la table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`_id`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `countries`
--
ALTER TABLE `countries`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;
--
-- AUTO_INCREMENT pour la table `logs`
--
ALTER TABLE `logs`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
