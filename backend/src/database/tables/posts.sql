use Talky

-- select * from Posts

-- CREATE TABLE Posts (
--     postID varchar(300) NOT NULL PRIMARY KEY,
--     userID varchar(300) NOT NULL,
--     postPic VARCHAR(255)null ,
--     content VARCHAR(1000),
--     add userName VARCHAR(255) null
--     Timestamp DATETIME,
--     FOREIGN KEY (UserID) REFERENCES Users(UserID)
-- );
alter table Posts
add likesCount int default 0

FOREIGN KEY (userName) REFERENCES Users(userName)

alter table Posts
add postPic VARCHAR(255) null
-- drop COLUMN postPic

ALTER TABLE Posts
ADD CONSTRAINT DF_Posts_Timestamp DEFAULT GETDATE() FOR Timestamp;



-- delete from Posts 
-- where userID = 'a5c1dee3-8c3a-4b80-abab-5389e8ad5455'