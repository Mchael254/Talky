-- use Talky

CREATE or alter PROCEDURE AddFollow (
    @p_followerID VARCHAR(300),
    @p_followeeID VARCHAR(300)
)
as
BEGIN
    BEGIN TRY
        INSERT INTO Follows (followerID, followeeID) VALUES (@p_followerID, @p_followeeID);
        IF @@ROWCOUNT > 0
        BEGIN
            UPDATE Users SET followCount = followCount + 1 WHERE userID = @p_followeeID;
            UPDATE Users SET followingCount = followingCount + 1 WHERE userID = @p_followerID;
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;