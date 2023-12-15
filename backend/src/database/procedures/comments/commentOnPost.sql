use Talky

-- CREATE or alter PROCEDURE CommentOnPost(
-- @commentID VARCHAR(300),
-- @userID VARCHAR(300),
-- @postID VARCHAR(300),
-- @ParentCommentID VARCHAR(300) NULL,
-- @content VARCHAR(1000),
-- @userName VARCHAR(255)
-- )
-- AS
-- BEGIN
--     INSERT INTO Comments (commentID,userID, postID,ParentCommentID,content,userName,Timestamp)
--     VALUES (@commentID,@userID, @postID,@ParentCommentID,@content,@userName, GETDATE());
-- END;





-- CREATE PROCEDURE CommentOnComment
-- @userID INT,
-- @postID INT,
-- @ParentCommentID INT,
-- @content VARCHAR(1000)
-- AS
-- BEGIN
--     INSERT INTO Comments (userID, postID, ParentCommentID, content, Timestamp)
--     VALUES (@userID, @postID, @ParentCommentID, @content, GETDATE());
-- END;