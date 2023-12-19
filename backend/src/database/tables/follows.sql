use Talky

-- CREATE TABLE Follows (
--     followerID VARCHAR(300) NOT NULL,
--     followeeID VARCHAR(300) NOT NULL,
--     PRIMARY KEY (followerID, followeeID),
--     FOREIGN KEY (followerID) REFERENCES Users(userID),
--     FOREIGN KEY (followeeID) REFERENCES Users(userID)
-- );

select * from Follows
select *from Users
delete from Follows
where followerID = '30b8726a-f623-4920-a0da-c77d183bbdca'
 and followeeID = '93c38333-1f1c-45ea-b30c-f0875af6bb89'

update Users 
set followCount = 0
where userID = '4d087c21-1cc8-48cc-b792-7045b93090bb'