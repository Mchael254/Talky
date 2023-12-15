use Talky


-- CREATE TABLE Comments (
--     commentID varchar(300) primary KEY NOT NULL,
--     userID varchar(300) NOT NULL,
--     postID varchar(300) NOT NULL,
--     ParentCommentID VARCHAR(300) NULL,
--     content VARCHAR(1000),
--     Timestamp DATETIME,
--     FOREIGN KEY (userID) REFERENCES Users(userID),
--     FOREIGN KEY (postID) REFERENCES Posts(postID),
--     FOREIGN KEY (ParentCommentID) REFERENCES Comments(CommentID),
--     add userName VARCHAR(255) null
-- );

alter table Comments
add likesCount int default 0
-- add userName VARCHAR(255) null

-- DROP TABLE Comments
-- delete from Comments
-- where commentID = '79de179b-444f-4454-88ba-414bcb3cb264'

-- SELECT * FROM Comments

ALTER TABLE Comments
DROP CONSTRAINT FK__Comments__postID__07C12930;
ALTER TABLE Comments
ADD CONSTRAINT FK__Comments__postID__07C12930
FOREIGN KEY (postID) REFERENCES Posts(postID) ON DELETE CASCADE;

