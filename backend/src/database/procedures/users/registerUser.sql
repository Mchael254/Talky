
-- use Talky

CREATE or alter PROCEDURE registerUser(
    @userID varchar(100),
    @userName varchar(200),
    @email VARCHAR(300),
    @password VARCHAR(200)
)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Users WHERE userName = @userName)
        BEGIN
            INSERT INTO Users (userID, userName, email, password)
            VALUES (@userID, @userName, @email, @password)
        END
        ELSE
        BEGIN
            PRINT 'Username already exists. User not registered.'
        END
    END
    ELSE
    BEGIN
        PRINT 'Email already exists. User not registered.'
    END
END

drop procedure registerUser
