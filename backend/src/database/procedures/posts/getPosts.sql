use Talky

-- create or alter PROCEDURE getPosts
--     @p_userID varchar(300)
-- AS
-- BEGIN
--     SELECT * FROM Posts WHERE userID = @p_userID;
-- END


-- CREATE OR ALTER PROCEDURE getPosts
--     @p_userID VARCHAR(300)
-- AS
-- BEGIN
--     IF EXISTS (SELECT 1 FROM Posts WHERE userID = @p_userID)
--     BEGIN
--         -- User has posts, retrieve them
--         SELECT * FROM Posts WHERE userID = @p_userID;
--     END
--     ELSE
--     BEGIN
--         -- No posts for the user
--         PRINT 'No posts found for the specified user.';
--     END
-- END
