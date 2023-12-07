-- use Talky

create or alter procedure get_email_userName
as 
begin
    select  email, userName from users
end




