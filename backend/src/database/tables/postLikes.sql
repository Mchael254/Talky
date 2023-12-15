use Talky

-- CREATE TABLE postLikes (
--     likeID varchar(300) PRIMARY KEY NOT NULL,
--     postID varchar(300) NOT NULL,
--     userID varchar(300) NOT NULL,
--     userName VARCHAR(255) null,
--     Timestamp DATETIME DEFAULT GETDATE(),
--     FOREIGN KEY (postID) REFERENCES Posts(postID),
--     FOREIGN KEY (userID) REFERENCES Users(userID)
-- );

--prevent user from liking twice
ALTER TABLE postLikes
ADD CONSTRAINT UC_Post_User UNIQUE (postID, userID);

-- SELECT * FROM postLikes
