

-- use Talky
-- select * from Users
create  PROCEDURE loginUser(
    @userName varchar(200),
    @password VARCHAR(200)
)
as
BEGIN
    select * from Users where userName = @userName
end


-- drop PROCEDURE loginUser