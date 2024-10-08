CREATE DATABASE hotfixhandyman;
USE	hotfixhandyman;


CREATE TABLE JobRequests(
id integer PRIMARY KEY AUTO_INCREMENT,
FirstName varchar(255) NOT NULL,
LastName varchar(255) NOT NULL,
Address	 varchar(255) NOT NULL,
Email varchar(255) NOT NULL,
PhoneNumber varchar(255) NOT NULL,
JobDescription varchar(255) NOT NULL,
jobStatus ENUM('New', 'QuoteSent', 'Appoved', 'Scheduled', 'Completed') NOT NULL,
Image0 varchar(255),
Image1 varchar(255),
Image2 varchar(255),
Image3 varchar(255),
Image4 varchar(255),
Image5 varchar(255),
Image6 varchar(255),
Image7 varchar(255),
Image8 varchar(255),
Image9 varchar(255),
Created TIMESTAMP NOT NULL
);