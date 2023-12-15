-- use Talky

create or alter PROCEDURE getUserPosts
    @userID varchar(300)
AS
BEGIN
    SELECT * FROM Posts WHERE userID = @userID;
END


