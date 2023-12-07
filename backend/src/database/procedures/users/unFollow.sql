
-- use Talky

-- select * from Users
--Unfollow user
CREATE OR ALTER PROCEDURE unFollowUser(
    @userID VARCHAR(300),
    @userFollowedID VARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Users WHERE userID = @userID) AND
       EXISTS (SELECT 1 FROM Users WHERE userID = @userFollowedID)
    BEGIN
        
        UPDATE Users
        SET following = following - 1
        WHERE userID = @userID;

        UPDATE Users
        SET followers = followers - 1
        WHERE userID = @userFollowedID;
    END
    ELSE
    BEGIN
        PRINT 'One or both users do not exist.';
     
    END
END;
