use Talky

CREATE TABLE Follows (
    followerID VARCHAR(300) NOT NULL,
    followeeID VARCHAR(300) NOT NULL,
    PRIMARY KEY (followerID, followeeID),
    FOREIGN KEY (followerID) REFERENCES Users(userID),
    FOREIGN KEY (followeeID) REFERENCES Users(userID)
);

select * from Follows
delete from Follows
where followerID = '4d087c21-1cc8-48cc-b792-7045b93090bb'
 and followeeID = 'a5c1dee3-8c3a-4b80-abab-5389e8ad5455'