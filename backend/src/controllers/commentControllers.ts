import express, { Request, Response } from 'express';
import mssql from 'mssql';
import { sqlConfig } from '../config/sqlConfig';
import { v4 } from 'uuid';


export const createComment = async (req: express.Request, res: express.Response) => {
    try {
        const { postID, userID, content, parentCommentID,userName } = req.body; 
        let commentID = v4();

        const pool = await mssql.connect(sqlConfig);
        const request = pool.request();
        request.input('commentID', mssql.VarChar, commentID)
            .input('postID', mssql.VarChar, postID)
            .input('userID', mssql.VarChar, userID)
            .input('content', mssql.VarChar, content)
            .input('userName', mssql.VarChar, userName);

        // Only add ParentCommentID to the request if it's provided
        if (parentCommentID) {
            request.input('ParentCommentID', mssql.VarChar, parentCommentID);
        } else {
            request.input('ParentCommentID', mssql.VarChar, null); 
        }

        const result = await request.execute('CommentOnPost');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Comment created" });
        } else {
            res.status(400).json({ message: "Error creating comment" });
        }
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//get post comments
export const getPostComments = async (req: express.Request, res: express.Response) => {
    try {
        const { postID } = req.body;
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('postID', mssql.VarChar, postID)
            .execute('getPostComments');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(400).json({ message: "No comments found" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//comment on comment
export const commentOnComment = async (req: express.Request, res: express.Response) => {
    try {
        const { postID, userID, content, parentCommentID,userName } = req.body; 
        let commentID = v4();

        const pool = await mssql.connect(sqlConfig);
        const request = pool.request();
        request.input('commentID', mssql.VarChar, commentID)
            .input('postID', mssql.VarChar, postID)
            .input('userID', mssql.VarChar, userID)
            .input('content', mssql.VarChar, content)
            .input('parentCommentID', mssql.VarChar, parentCommentID)
            .input('userName', mssql.VarChar, userName);

        const result = await request.execute('CommentOnComment');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Comment on comment created" });
        } else {
            res.status(400).json({ message: "Error creating comment" });
        }
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//get comment on comment
export const getCommentOnComment = async (req: express.Request, res: express.Response) => {
    try {
        const { commentID } = req.body;
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('commentID', mssql.VarChar, commentID)
            .execute('getCommentOnComment');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(400).json({ message: "No comments found" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//update comment
export const updateComment = async (req: express.Request, res: express.Response) => {
    try {
        const { userID,commentID, updatedContent } = req.body;
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('commentID', mssql.VarChar, commentID)
            .input('userID', mssql.VarChar, userID)
            .input('updatedContent', mssql.VarChar, updatedContent)
            .execute('updateComment');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Comment updated" });
        } else {
            res.status(400).json({ message: "Error updating comment" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//delete comment
export const deleteComment = async (req:Request, res:Response) => {
    try {
        const { commentID, userID } = req.body;
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('commentID', mssql.VarChar, commentID)
            .input('userID', mssql.VarChar, userID)
            .execute('deleteComment');

        const totalRowsAffected = result.rowsAffected.reduce((acc, val) => acc + val, 0);
        if (totalRowsAffected > 0) {
            res.status(200).json({ message: "Comment deleted" });
        } else {
            res.status(400).json({ message: "Error deleting comment" });
        }
    } catch (error) {
        res.status(500).json({ message: error || 'Internal Server Error' });
    }
};
