-- use Talky

--delete post
-- create or alter PROCEDURE deletePost
--     @postID varchar(300)
-- AS
-- BEGIN
--     DELETE FROM Posts WHERE postID = @postID;
-- END

-- CREATE OR ALTER PROCEDURE deletePost
--     @postID VARCHAR(300)
-- AS
-- BEGIN
--     -- Check if the post exists
--     IF EXISTS (SELECT 1 FROM Posts WHERE postID = @postID)
--     BEGIN
--         -- Delete the post
--         DELETE FROM Posts WHERE postID = @postID;
--         PRINT 'Post deleted successfully.';
--     END
--     ELSE
--     BEGIN
--         -- Post does not exist, leave a message
--         PRINT 'The specified post does not exist.';
--     END
-- END
