use Talky

-- CREATE TABLE CommentLikes (
--     likeID varchar(300) PRIMARY KEY NOT NULL,
--     commentID varchar(300) NOT NULL,
--     userID varchar(300) NOT NULL,
--     Timestamp DATETIME DEFAULT GETDATE(),
--     FOREIGN KEY (commentID) REFERENCES Comments(commentID),
--     FOREIGN KEY (userID) REFERENCES Users(userID)
-- );

-- SELECT * FROM CommentLikes

--prevent user from liking twice
ALTER TABLE CommentLikes
ADD CONSTRAINT UC_Comment_User UNIQUE (commentID, userID);

--delete from CommentLikes
ALTER TABLE CommentLikes DROP CONSTRAINT FK__CommentLi__comme__1332DBDC;

ALTER TABLE CommentLikes
ADD CONSTRAINT FK__CommentLi__comme__1332DBDC
    FOREIGN KEY (commentID) REFERENCES Comments(commentID) ON DELETE CASCADE;

