-- use Talky


-- CREATE OR ALTER PROCEDURE GetFollowing (
--     @p_userID VARCHAR(300)
-- )
-- AS
-- BEGIN
--     SELECT
--         U.userName,
--         U.followCount,
--         U.followingCount,
--         U.imagePath
--     FROM
--         Users U
--     JOIN
--         Follows F ON U.userID = F.followeeID
--     WHERE
--         F.followerID = @p_userID;
-- END;