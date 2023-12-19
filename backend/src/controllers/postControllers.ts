import express, { Request, Response } from 'express';
import mssql from 'mssql';
import { sqlConfig } from '../config/sqlConfig';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
const cloudinary = require('cloudinary').v2;
import { checkFileType, storage } from './userControllers';
import { upload } from './userControllers';


//cloudinary
dotenv.config();
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export const upload2 = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('postPic');

//create post
export const createPost = async (req: Request, res: Response) => {
    try {
        let postUrl = null;
        let postID = v4();
        const { userID, content, userName } = req.body;
        const pool = await mssql.connect(sqlConfig);

        const userProfile = await pool.request()
            .input('userID', mssql.VarChar, userID)
            .query('SELECT imagePath FROM Users WHERE userID = @userID');
        const imagePath = userProfile.recordset[0]?.imagePath;

        let insertQuery;

        if (req.file) {
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`);
            postUrl = result.secure_url;
            console.log(postUrl);

            insertQuery = `
                INSERT INTO Posts (postID, userID, postPic, content, userName, imagePath)
                VALUES (@postID, @userID, @postUrl, @content, @userName,@imagePath)
            `;
        } else {
            console.log('No file uploaded');

            insertQuery = `
                INSERT INTO Posts (postID, userID, content, userName,imagePath)
                VALUES (@postID, @userID, @content, @userName,@imagePath)
            `;
        }

        const request = pool.request();
        request.input('postID', mssql.VarChar, postID);
        request.input('userID', mssql.VarChar, userID);
        request.input('content', mssql.VarChar, content);
        request.input('userName', mssql.VarChar, userName);
        request.input('imagePath',mssql.VarChar,imagePath);
        if (postUrl) {
            request.input('postUrl', mssql.VarChar, postUrl);
        }
        const results = await request.query(insertQuery);
        return res.status(200).json({ message: 'Post created successfully', success: true, post: postUrl });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//get user posts
export const getUserPosts = async (req: Request, res: Response) => {
    
    try {
        const { userID } = req.params;

        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('userID', mssql.VarChar, userID)
            .execute('GetUserPosts');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(400).json({ message: "No posts found" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//get all posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .execute('getAllPosts');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(400).json({ message: "No posts found" });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//delete post
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { postID } = req.body;
        const pool = await mssql.connect(sqlConfig);

        const checkResult = await pool
            .request()
            .input('postID', mssql.VarChar, postID)
            .query('SELECT 1 FROM Posts WHERE postID = @postID');

        if (checkResult.recordset.length > 0) {
            const result = await pool
                .request()
                .input('postID', mssql.VarChar, postID)
                .execute('deletePost');

            if (result.rowsAffected[0] > 0) {
                res.status(200).json({ message: 'Post deleted successfully' });
            } else {
                res.status(400).json({ message: 'Post deletion failed' });
            }
        } else {
            res.status(404).json({ message: 'The specified post does not exist' });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};