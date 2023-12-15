-- use Talky
-- SELECT * FROM Users

CREATE OR ALTER PROCEDURE updatePassword
    @email VARCHAR(255),
    @newPassword VARCHAR(255),
    @token VARCHAR(255)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        IF EXISTS (SELECT 1 FROM Users WHERE email = @email AND resetToken = @token)
        BEGIN
           
            UPDATE Users
            SET password = @newPassword,
                resetToken = NULL,
                expiryTime = NULL,
                emailSent = 0
            WHERE email = @email;

            SELECT 'Password updated successfully' AS message;
        END
        ELSE
        BEGIN
            SELECT 'Invalid token' AS message;
        END
    END
    ELSE
    BEGIN
        SELECT 'Invalid email' AS message;
    END
END;
