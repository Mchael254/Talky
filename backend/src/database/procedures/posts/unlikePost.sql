use Talky

--unlike post
-- CREATE OR ALTER PROCEDURE unlikePost
--     @postID varchar(300),
--     @userID varchar(300)
-- AS
-- BEGIN
--     BEGIN TRY
--         DELETE FROM postLikes
--         WHERE postID = @postID AND userID = @userID;
--         IF @@ROWCOUNT > 0
--         BEGIN
--             UPDATE Posts
--             SET likesCount = CASE 
--                                 WHEN likesCount > 0 THEN likesCount - 1 
--                                 ELSE 0 
--                              END
--             WHERE postID = @postID;
--         END
--     END TRY
--     BEGIN CATCH
--         THROW;
--     END CATCH
-- END;

