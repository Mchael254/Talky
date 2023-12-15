import express from 'express';
import mssql from 'mssql';
import { sqlConfig } from '../config/sqlConfig';
import { v4 } from 'uuid';




//like comment
export const likeComment = async (req: express.Request, res: express.Response) => {
    try {
        const { commentID, userID } = req.body;

        let likeID = v4();
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('likeID', mssql.VarChar, likeID)
            .input('commentID', mssql.VarChar, commentID)
            .input('userID', mssql.VarChar, userID)
            .execute('AddLikeToComment');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Comment liked" });
        } else {
            res.status(400).json({ message: "Error liking comment" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//unlike comment
export const unlikeComment = async (req: express.Request, res: express.Response) => {
    try {
        const { commentID, userID } = req.body;

        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('commentID', mssql.VarChar, commentID)
            .input('userID', mssql.VarChar, userID)
            .execute('unlikeComment');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Comment unliked" });
        } else {
            res.status(400).json({ message: "Error unliking comment" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//like a post
export const likePost = async (req: express.Request, res: express.Response) => {
    try {
        const { postID, userID,userName } = req.body;

        let likeID = v4();
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('likeID', mssql.VarChar, likeID)
            .input('postID', mssql.VarChar, postID)
            .input('userID', mssql.VarChar, userID)
            .input('userName', mssql.VarChar, userName)
            .execute('likePost');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Post liked" });
        } else {
            res.status(400).json({ message: "Error liking post" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//unlike a post
export const unlikePost = async (req: express.Request, res: express.Response) => {
    try {
        const { postID, userID } = req.body;

        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('postID', mssql.VarChar, postID)
            .input('userID', mssql.VarChar, userID)
            .execute('unlikePost');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Post unliked" });
        } else {
            res.status(400).json({ message: "Error unliking post" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};
