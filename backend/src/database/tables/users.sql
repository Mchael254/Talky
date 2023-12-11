create DATABASE Talky

use Talky

-- SELECT * FROM Users

-- create table Users (
--     userID VARCHAR(300) not null PRIMARY KEY,
--     userName VARCHAR(255) not null,
--     email VARCHAR(255) not null UNIQUE,
--     password VARCHAR(255) not null,
--     role varchar(20) DEFAULT 'customer',
--     Welcomed bit DEFAULT 0,
--     isDeleted bit DEFAULT 0,
--     emailSent bit DEFAULT 0,
--     expiryTime int,
--     resetToken varchar(255) null,
--     followers int DEFAULT 0,
--     following int DEFAULT 0,
--     profilePic varbinary(max)
    
-- -- )
alter table Users 
-- ALTER TABLE Users
-- DROP CONSTRAINT DF__Users__following__3D5E1FD2;

-- DROP INDEX [IndexName] ON Users;


drop column following

use Talky
-- alter table Users
update Users
set role  = 'admin'
where userID = '069e804d-97ba-4756-aee7-5943ae8f8f6c'
