use Talky

-- create or alter PROCEDURE deleteComment(
--     @commentID varchar(300),
--     @userID varchar(300)
-- )
-- AS
-- BEGIN
--     DELETE FROM CommentLikes WHERE commentID = @commentID;
--     DELETE FROM Comments WHERE ParentCommentID = @commentID;
--     DELETE FROM Comments WHERE commentID = @commentID AND userID = @userID;
-- END