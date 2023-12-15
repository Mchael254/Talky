use Talky

-- Procedure for initiating password reset
-- CREATE or alter PROCEDURE initiate_password_reset
--     @email VARCHAR(255),
--     @resetToken VARCHAR(255),
--     @expiryTime INT
-- AS
-- BEGIN
--     IF EXISTS (SELECT * FROM Users WHERE email = @email)
--     BEGIN
--         IF EXISTS (SELECT * FROM Users WHERE email = @email)
--         BEGIN
--             UPDATE Users SET resetToken = @resetToken, expiryTime = @expiryTime WHERE email = @email;
--         END
--         ELSE
--         BEGIN
--             INSERT INTO Users (email, resetToken, expiryTime)
--             VALUES (@email, @resetToken, @expiryTime);
--         END

--         SELECT 'Password reset initiated' AS message;
--     END
--     ELSE
--         SELECT 'User not found.' AS message;
-- END;
