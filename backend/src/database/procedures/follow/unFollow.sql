-- use Talky


-- CREATE or alter PROCEDURE unFollow (
--     @p_followerID VARCHAR(300),
--     @p_followeeID VARCHAR(300)
-- )
-- as
-- BEGIN
--     DELETE FROM Follows WHERE followerID = @p_followerID AND followeeID = @p_followeeID;
--     UPDATE Users SET followCount = followCount - 1 WHERE userID = @p_followeeID;
--     UPDATE Users SET followingCount = followingCount - 1 WHERE userID = @p_followerID;
-- END;