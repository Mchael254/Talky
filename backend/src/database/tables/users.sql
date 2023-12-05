create DATABASE Talky

use Talky

-- SELECT * FROM Users

create table Users (
    userID VARCHAR(300) not null PRIMARY KEY,
    userName VARCHAR(255) not null,
    email VARCHAR(255) not null UNIQUE,
    password VARCHAR(255) not null,
    role varchar(20) DEFAULT 'customer',
    Welcomed bit DEFAULT 0,
    isDeleted bit DEFAULT 0,
    emailSent bit DEFAULT 0,
    expiryTime int,
    resetToken varchar(255) null,
    followers int DEFAULT 0,
    following int DEFAULT 0,
    
)
alter table Users
add profilePic varbinary(max)
-- drop column profilePic


