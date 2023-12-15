use Talky

-- create or alter PROCEDURE updateComment(
--     @commentID varchar(300),
--     @content varchar(1000)
-- )
-- AS
-- BEGIN
--     UPDATE Comments SET content = @content WHERE commentID = @commentID;
-- END

-- drop PROCEDURE updateComment

-- CREATE OR ALTER PROCEDURE updateComment
--     @commentID VARCHAR(300),
--     @userID VARCHAR(300),
--     @updatedContent VARCHAR(1000)
-- AS
-- BEGIN
    
--     IF NOT EXISTS (SELECT 1 FROM Comments WHERE commentID = @commentID AND userID = @userID)
--     BEGIN
--         RAISERROR('Comment does not exist or does not belong to the user', 16, 1);
--         RETURN;
--     END

--     UPDATE Comments
--     SET content = @updatedContent
--     WHERE commentID = @commentID AND userID = @userID;
-- END;
