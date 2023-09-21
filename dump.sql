-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: poeticverse
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` char(32) DEFAULT NULL,
  `author_id` char(32) NOT NULL,
  `poem_id` char(32) DEFAULT NULL,
  `parent_id` char(32) DEFAULT NULL,
  `body` text NOT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`),
  UNIQUE KEY `id` (`id`),
  KEY `author_id` (`author_id`),
  KEY `poem_id` (`poem_id`),
  KEY `parent_id` (`parent_id`),
  FULLTEXT KEY `body` (`body`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poem` (`id`),
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `user_id` char(32) DEFAULT NULL,
  `comment_id` char(32) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `admin_id` char(32) DEFAULT NULL,
  `group` tinyint(1) DEFAULT NULL,
  `id` char(32) DEFAULT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`),
  UNIQUE KEY `id` (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `conversation_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation_members`
--

DROP TABLE IF EXISTS `conversation_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_members` (
  `user_id` char(32) DEFAULT NULL,
  `conversation_id` char(32) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `conversation_id` (`conversation_id`),
  CONSTRAINT `conversation_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `conversation_members_ibfk_2` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_members`
--

LOCK TABLES `conversation_members` WRITE;
/*!40000 ALTER TABLE `conversation_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `sender_id` char(32) NOT NULL,
  `conversation_id` char(32) NOT NULL,
  `body` text NOT NULL,
  `id` char(32) DEFAULT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`),
  UNIQUE KEY `id` (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `conversation_id` (`conversation_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`),
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poem`
--

DROP TABLE IF EXISTS `poem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poem` (
  `author_id` char(32) NOT NULL,
  `title` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `featured` tinyint(1) DEFAULT NULL,
  `isShared` tinyint(1) DEFAULT NULL,
  `id` char(32) DEFAULT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`),
  UNIQUE KEY `id` (`id`),
  KEY `author_id` (`author_id`),
  FULLTEXT KEY `title` (`title`),
  CONSTRAINT `poem_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poem`
--

LOCK TABLES `poem` WRITE;
/*!40000 ALTER TABLE `poem` DISABLE KEYS */;
INSERT INTO `poem` VALUES ('5428bb1d61eb4f26bb59c9b194ad59e6','The Silent Night','The silent night, a moon so bright,\nStars twinkle in the sky.\nA peaceful scene, so calm and clean,\nAs nighttime passes by.',0,0,'e5137c4cc05d476d942baf3ae2406b47',1,'2023-09-13 08:26:12','2023-09-13 08:26:12'),('5428bb1d61eb4f26bb59c9b194ad59e6','Dancing in the Rain','Dancing in the rain, I feel no pain,\nAs drops fall from the sky.\nA joyful sound, on the wet ground,\nWith every step, I fly.',0,0,'662d5302388a4110b9352e947ab0e2e5',2,'2023-09-13 08:26:13','2023-09-13 08:26:13'),('5428bb1d61eb4f26bb59c9b194ad59e6','Winter\'s Embrace','Winter\'s embrace, a frosty lace,\nOn trees and fields it lies.\nA cold delight, a snowy white,\nBeneath the clear blue skies.',0,0,'a0f93ac68ee047c39a7eed02c4867770',3,'2023-09-13 08:26:14','2023-09-13 08:26:14'),('5428bb1d61eb4f26bb59c9b194ad59e6','Sunset Serenade','Sunset serenade, colors cascade,\nThe day bids us goodbye.\nA fiery hue, in the evening\'s view,\nAs twilight paints the sky.',0,0,'2da65ef26dd249c6905da9bb6b136eb2',4,'2023-09-13 08:26:14','2023-09-13 08:26:14'),('5428bb1d61eb4f26bb59c9b194ad59e6','Whispers in the Woods','Whispers in the woods, where mystery broods,\nAmong the ancient trees.\nA hidden lore, as the leaves gently soar,\nIn the forest\'s gentle breeze.',0,0,'d7fd238fd5fa4cc381946a94472daffc',5,'2023-09-13 08:26:15','2023-09-13 08:26:15'),('5428bb1d61eb4f26bb59c9b194ad59e6','Ocean\'s Symphony','Ocean\'s symphony, a boundless sea,\nWaves crash upon the shore.\nA timeless dance, in a salty expanse,\nForever it will roar.',0,0,'009dfc40c30f4a179481db9f961fab36',6,'2023-09-13 08:26:15','2023-09-13 08:26:15'),('5428bb1d61eb4f26bb59c9b194ad59e6','Fields of Dreams','Fields of dreams, where the sunlight gleams,\nAmidst the golden grain.\nA tranquil space, in nature\'s embrace,\nWhere peace shall ever reign.',0,0,'b6234d31f36b4edc80b988e465e599d2',7,'2023-09-13 08:26:15','2023-09-13 08:26:15'),('5428bb1d61eb4f26bb59c9b194ad59e6','A Winter\'s Tale','A winter\'s tale, a snowy trail,\nFootprints in the snow.\nA cozy night, by the firelight,\nWhere memories gently flow.',0,0,'59ac6dbdd7e846ecaa6002a4e58b1831',8,'2023-09-13 08:26:16','2023-09-13 08:26:16'),('5428bb1d61eb4f26bb59c9b194ad59e6','Rainbow\'s End','Rainbow\'s end, where dreams ascend,\nOver the distant hill.\nA vibrant sight, in the soft twilight,\nWhere wishes are fulfilled.',0,0,'383d25f55c684532b2682f6ff3174c6a',9,'2023-09-13 08:26:16','2023-09-13 08:26:16'),('5428bb1d61eb4f26bb59c9b194ad59e6','Autumn Whispers','Autumn whispers, the leaves\' soft twisters,\nIn shades of red and gold.\nA tranquil scene, where the air is clean,\nAs nature\'s story is told.',0,0,'18a4455de5f842b9b59baf7ab1b200f5',10,'2023-09-13 08:26:16','2023-09-13 08:26:16');
/*!40000 ALTER TABLE `poem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poem_likes`
--

DROP TABLE IF EXISTS `poem_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poem_likes` (
  `user_id` char(32) DEFAULT NULL,
  `poem_id` char(32) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `poem_id` (`poem_id`),
  CONSTRAINT `poem_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `poem_likes_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poem` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poem_likes`
--

LOCK TABLES `poem_likes` WRITE;
/*!40000 ALTER TABLE `poem_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `poem_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poem_tags`
--

DROP TABLE IF EXISTS `poem_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poem_tags` (
  `tag_id` char(32) DEFAULT NULL,
  `poem_id` char(32) DEFAULT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `poem_id` (`poem_id`),
  CONSTRAINT `poem_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`),
  CONSTRAINT `poem_tags_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poem` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poem_tags`
--

LOCK TABLES `poem_tags` WRITE;
/*!40000 ALTER TABLE `poem_tags` DISABLE KEYS */;
INSERT INTO `poem_tags` VALUES ('4bb9a1e9458d42ebb1bf6c4d0533187a','e5137c4cc05d476d942baf3ae2406b47'),('4bb9a1e9458d42ebb1bf6c4d0533187a','e5137c4cc05d476d942baf3ae2406b47'),('d810c565012a496cb5a872ba421f72e0','e5137c4cc05d476d942baf3ae2406b47'),('c1747cae0d53461b98e400843ac71b03','e5137c4cc05d476d942baf3ae2406b47'),('d810c565012a496cb5a872ba421f72e0','662d5302388a4110b9352e947ab0e2e5'),('af2bec758a6043b994713837b4f819f6','662d5302388a4110b9352e947ab0e2e5'),('7de9b23558514e12b79013be92e6f21f','662d5302388a4110b9352e947ab0e2e5'),('af2bec758a6043b994713837b4f819f6','662d5302388a4110b9352e947ab0e2e5'),('4f854b7cc6394cda99a9dda3816f5780','a0f93ac68ee047c39a7eed02c4867770'),('d810c565012a496cb5a872ba421f72e0','a0f93ac68ee047c39a7eed02c4867770'),('af2bec758a6043b994713837b4f819f6','a0f93ac68ee047c39a7eed02c4867770'),('c1747cae0d53461b98e400843ac71b03','a0f93ac68ee047c39a7eed02c4867770'),('7de9b23558514e12b79013be92e6f21f','2da65ef26dd249c6905da9bb6b136eb2'),('af2bec758a6043b994713837b4f819f6','2da65ef26dd249c6905da9bb6b136eb2'),('af2bec758a6043b994713837b4f819f6','2da65ef26dd249c6905da9bb6b136eb2'),('6a7c4deaac8745e7a22b0efdb433f065','2da65ef26dd249c6905da9bb6b136eb2'),('d810c565012a496cb5a872ba421f72e0','d7fd238fd5fa4cc381946a94472daffc'),('c1747cae0d53461b98e400843ac71b03','d7fd238fd5fa4cc381946a94472daffc'),('7de9b23558514e12b79013be92e6f21f','d7fd238fd5fa4cc381946a94472daffc'),('d810c565012a496cb5a872ba421f72e0','d7fd238fd5fa4cc381946a94472daffc'),('7de9b23558514e12b79013be92e6f21f','009dfc40c30f4a179481db9f961fab36'),('7de9b23558514e12b79013be92e6f21f','009dfc40c30f4a179481db9f961fab36'),('c1747cae0d53461b98e400843ac71b03','009dfc40c30f4a179481db9f961fab36'),('d810c565012a496cb5a872ba421f72e0','009dfc40c30f4a179481db9f961fab36'),('4f854b7cc6394cda99a9dda3816f5780','b6234d31f36b4edc80b988e465e599d2'),('4bb9a1e9458d42ebb1bf6c4d0533187a','b6234d31f36b4edc80b988e465e599d2'),('6a7c4deaac8745e7a22b0efdb433f065','b6234d31f36b4edc80b988e465e599d2'),('af2bec758a6043b994713837b4f819f6','b6234d31f36b4edc80b988e465e599d2'),('c1747cae0d53461b98e400843ac71b03','59ac6dbdd7e846ecaa6002a4e58b1831'),('d810c565012a496cb5a872ba421f72e0','59ac6dbdd7e846ecaa6002a4e58b1831'),('4bb9a1e9458d42ebb1bf6c4d0533187a','59ac6dbdd7e846ecaa6002a4e58b1831'),('4f854b7cc6394cda99a9dda3816f5780','59ac6dbdd7e846ecaa6002a4e58b1831'),('7de9b23558514e12b79013be92e6f21f','383d25f55c684532b2682f6ff3174c6a'),('af2bec758a6043b994713837b4f819f6','383d25f55c684532b2682f6ff3174c6a'),('7de9b23558514e12b79013be92e6f21f','383d25f55c684532b2682f6ff3174c6a'),('7de9b23558514e12b79013be92e6f21f','383d25f55c684532b2682f6ff3174c6a'),('c1747cae0d53461b98e400843ac71b03','18a4455de5f842b9b59baf7ab1b200f5'),('af2bec758a6043b994713837b4f819f6','18a4455de5f842b9b59baf7ab1b200f5'),('4bb9a1e9458d42ebb1bf6c4d0533187a','18a4455de5f842b9b59baf7ab1b200f5'),('4bb9a1e9458d42ebb1bf6c4d0533187a','18a4455de5f842b9b59baf7ab1b200f5');
/*!40000 ALTER TABLE `poem_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `name` varchar(200) NOT NULL,
  `id` char(32) DEFAULT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES ('acrostic','88ae3a682e3d46b38f9464f253a3a479',1,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('ballad','fc33d4fe467149a59d321fb152f52897',2,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('blank verse','00e74606545c4139b6562b1142c6d796',3,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('cinquain','bf37b2f8df6d4bcb8ffdedc5687627c2',4,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('confessional','546caaadb05c456ead8f8a77331b3930',5,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('death poetry','82bd1b74cb2e4c6f8660e9e641f1eff3',6,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('despair','5d3c295ec1b344ba807b76a4d4612505',7,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('didactic','b097e1d62f4146de80c959d3dd6ddaa5',8,'2023-09-13 08:26:06','2023-09-13 08:26:06'),('elegy','e77fc2ed06594aedac420825877b8837',9,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('ekphrastic','e830cf35480342209cb343db320febe2',10,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('epic','7b296ecb81d442058d0fbf2460de2f9a',11,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('epigram','d2274d954e064da79d4eb1df0045647c',12,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('faith','21196de557c8404e8b1b00cd009413ff',13,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('free verse','deafa8f877134123bbe38984a0a616db',14,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('ghazal','7962f1f00831426d8823499b394c6b95',15,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('haiku','be1507aebad449379b5c103166919f9d',16,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('history','d6e42d3baf6e408aa8a92fd3fae66dc0',17,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('horror','b8cbe42226e645f7bce30da284a5b5b6',18,'2023-09-13 08:26:07','2023-09-13 08:26:07'),('humor','7de9b23558514e12b79013be92e6f21f',19,'2023-09-13 08:26:08','2023-09-13 08:26:08'),('indigenous poetry','f298a561f7384a6da7260e990af3133c',20,'2023-09-13 08:26:08','2023-09-13 08:26:08'),('limerick','7c8ff1f44bbb48abb9eeb7c9ad8e4527',21,'2023-09-13 08:26:08','2023-09-13 08:26:08'),('love','48051ffeafff463d8e064d5eba8632bd',22,'2023-09-13 08:26:08','2023-09-13 08:26:08'),('lyric','ee889fcd0ba944248980cddfe362c10f',23,'2023-09-13 08:26:08','2023-09-13 08:26:08'),('metaphysics','215736438c6d4a25b27c3a4bda4285d3',24,'2023-09-13 08:26:08','2023-09-13 08:26:08'),('narrative','4068cb60adb24951ac777cda163b4e66',25,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('nature','00e3a43afe0943e2b76046465a4cf8f3',26,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('nursery rhymes','ebd0c826752f442b95e0d178d567d923',27,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('ode','4d35c9164d4442e491f272e9cb0d1230',28,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('pastoral','00b229c32f094b3dbc9e3acb587e4949',29,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('prose','6715759bf75c42d3b8f02ab151153793',30,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('romantic','b035470ae08f4523869e28071de9c267',31,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('satire','6a7c4deaac8745e7a22b0efdb433f065',32,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('sestina','106e2e61f06d4da0be1d8d99255bb845',33,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('social commentary','f005b54276cb4bb6a00f8f36a0b32aaf',34,'2023-09-13 08:26:09','2023-09-13 08:26:09'),('sonnet','88aa3c87ddbc4e7896435d11c42124f4',35,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('spoken word','90f69504e092474b8ca6c571970a5b8b',36,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('surrealism','9af45ce69d564ba5bdcb407531a71b55',37,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('symbolism','62881e21e4804e4ba7734714eecd45b1',38,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('tanka','e0f9f510735a442fb2eb862c5af25ee7',39,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('tragedy','513ecb43c65548a697244417201b9eef',40,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('war','4f854b7cc6394cda99a9dda3816f5780',41,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('western','872f713cd4aa4b08a887fbb08946056c',42,'2023-09-13 08:26:10','2023-09-13 08:26:10'),('women','d810c565012a496cb5a872ba421f72e0',43,'2023-09-13 08:26:11','2023-09-13 08:26:11'),('world','ac71ecfa7258471783e9a99ad0a980af',44,'2023-09-13 08:26:11','2023-09-13 08:26:11'),('zen','c1747cae0d53461b98e400843ac71b03',45,'2023-09-13 08:26:11','2023-09-13 08:26:11'),('poetry','4bb9a1e9458d42ebb1bf6c4d0533187a',46,'2023-09-13 08:26:12','2023-09-13 08:26:12'),('belloc','af2bec758a6043b994713837b4f819f6',47,'2023-09-13 08:26:13','2023-09-13 08:26:13');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `access_token` varchar(500) NOT NULL,
  `refresh_token` varchar(500) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `user_id` char(32) NOT NULL,
  `id` char(32) DEFAULT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`),
  UNIQUE KEY `access_token` (`access_token`),
  UNIQUE KEY `refresh_token` (`refresh_token`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `first_name` varchar(128) NOT NULL,
  `verified` tinyint(1) DEFAULT NULL,
  `last_name` varchar(128) NOT NULL,
  `pen_name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `bio` text,
  `rank` enum('A','B','C','D','E','F') DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `secret` json DEFAULT NULL,
  `profile_picture` varchar(128) DEFAULT NULL,
  `id` char(32) DEFAULT NULL,
  `sn` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`sn`,`first_name`),
  UNIQUE KEY `pen_name` (`pen_name`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `id` (`id`),
  FULLTEXT KEY `first_name` (`first_name`,`last_name`,`pen_name`),
  FULLTEXT KEY `first_name_2` (`first_name`),
  FULLTEXT KEY `pen_name_2` (`pen_name`),
  FULLTEXT KEY `last_name` (`last_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Melissa',0,'Carter','selena51','adam@dan.com','+678759229943','asdfg','Produce war want couple fast. Identify behavior six charge. Drug us one travel. Side create should room apply audience effect.\nNotice Congress city bar media. Land per radio professional arrive picture.','A','[\"humor\", \"zen\", \"women\", \"war\"]',NULL,'https://wilcox.biz/','5428bb1d61eb4f26bb59c9b194ad59e6',1,'2023-09-13 08:26:11','2023-09-13 08:26:11');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-13 12:04:14
