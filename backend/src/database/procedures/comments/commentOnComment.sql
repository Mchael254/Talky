-- use Talky

-- CREATE OR ALTER PROCEDURE CommentOnComment
--     @commentID VARCHAR(300),
--     @userID VARCHAR(300),
--     @postID VARCHAR(300),
--     @parentCommentID VARCHAR(300) NULL, 
--     @content VARCHAR(1000),
--     @userName VARCHAR(255)
-- AS
-- BEGIN
--     -- Ensure that the parent comment exists
--     IF @parentCommentID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Comments WHERE commentID = @parentCommentID)
--     BEGIN
--         RAISERROR('Parent comment does not exist', 16, 1);
--         RETURN;
--     END

--     -- Insert the comment into the Comments table
--     INSERT INTO Comments (commentID, userID, postID, ParentCommentID, content,userName, Timestamp)
--     VALUES (@commentID, @userID, @postID, @parentCommentID, @content,@userName, GETDATE());
-- END;
