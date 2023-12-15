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

ALTER TABLE postLikes
DROP CONSTRAINT FK__postLikes__postI__1EA48E88;

ALTER TABLE postLikes
ADD CONSTRAINT FK__postLikes__postI__1EA48E88
FOREIGN KEY (postID)
REFERENCES Posts(postID)
ON DELETE CASCADE;

