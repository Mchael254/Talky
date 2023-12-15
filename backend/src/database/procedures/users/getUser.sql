-- use Talky

create or alter procedure getUsers
as
BEGIN
    select * from users
    WHERE
    role = 'customer';
END
