CREATE  or alter PROCEDURE UpdateUserProfile
    @userName NVARCHAR(255),
    @email NVARCHAR(255),
    @password NVARCHAR(255)
AS
BEGIN
    UPDATE Users
    SET
        UserName = @userName,
        email = @email,
        Password = @password
    WHERE
        email = @email;
END;

-- use Talky
SELECT * from Users
