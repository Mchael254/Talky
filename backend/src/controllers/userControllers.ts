import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mssql from "mssql";
import multer from 'multer'
import path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { v4 } from "uuid";
import { passwordResetRequestValidationSchema, passwordResetValidationSchema, profileUpdateValidationSchema, userLoginValidationSchema, userRegisterValidationSchema } from "../validators/userValidators";
import { sqlConfig } from "../config/sqlConfig";
import { ExtendedUser } from "../middleware/tokenVerify.ts";
import dotenv from 'dotenv';
const cloudinary = require('cloudinary').v2;


//cloudinary
dotenv.config();
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

//storage engine
export const storage = multer.memoryStorage();
//check file type
export function checkFileType(file: any, cb: any) {
    const fileTypes = /jpeg|jpg|png|gif|jfif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

//init upload
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('imagePath');



//upload profile pic
export const uploadProfilePic1 = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            console.log('no file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const email = req.body.email;
        const pool = await mssql.connect(sqlConfig);
        const updateQuery = `
            UPDATE Users
            SET imagePath = @imageUrl
            WHERE email = @email
        `;
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`);
        const imageUrl = result.secure_url;
        console.log(imageUrl);

        const request = pool.request();
        request.input('email', mssql.VarChar, email);
        request.input('imageUrl', mssql.VarChar, imageUrl);
        const results = await request.query(updateQuery);
        return res.status(200).json({
            message: 'pic upload in progress',

            success: true,
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error('Error updating profile pic:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}


//register user
export const registerUser = async (req: Request, res: Response) => {
    try {
        let { userName, email, password } = req.body;
        const { error } = userRegisterValidationSchema.validate(req.body);
        if (error) {
            return res.json({ message: error.details[0].message })
        }

        let userID = v4();
        const hashedPwd = await bcrypt.hash(password, 5);

        const pool = await mssql.connect(sqlConfig);

        const checkEmailQuery = `SELECT 1 FROM Users WHERE email = @email`;
        const emailCheckResult = await pool.request()
            .input("email", mssql.VarChar, email)
            .query(checkEmailQuery);

        const checkUserNameQuery = `SELECT 1 FROM Users WHERE userName = @userName`;
        const userNameCheckResult = await pool.request()
            .input("userName", mssql.VarChar, userName)
            .query(checkUserNameQuery);

        if (emailCheckResult.recordset.length > 0 && userNameCheckResult.recordset.length > 0) {
            return res.status(400).json({ error: 'Email and userName already exist.' });
        } else if (emailCheckResult.recordset.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        } else if (userNameCheckResult.recordset.length > 0) {
            return res.status(400).json({ error: 'UserName already exists.' });
        }

        const data = await pool.request()
            .input("userID", mssql.VarChar, userID)
            .input("userName", mssql.VarChar, userName)
            .input("email", mssql.VarChar, email)
            .input("password", mssql.VarChar, hashedPwd)
            .execute("registerUser");

        return res.status(200).json({
            message: 'User registered successfully.',
            email: 'welcome user email sent to new user'
        });
    } catch (error) {
        return res.json({
            error: error
        })

    }
}

//login user
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body;

        const { error } = userLoginValidationSchema.validate(req.body);

        if (error) {

            return res.status(400).json({ error: error.details[0].message });
        }

        const pool = await mssql.connect(sqlConfig);

        let user = await (await pool
            .request()
            .input('userName', mssql.VarChar, userName)
            .input('password', mssql.VarChar, password)
            .execute('loginUser')).recordset;

        if (user.length === 1) {
            const correctPwd = await bcrypt.compare(password, user[0].password);

            if (!correctPwd) {
                return res.status(401).json({
                    error: 'Incorrect password',
                });
            }
            // Include only essential information in the token payload
            const { userName, email, role } = user[0];
            const tokenPayload = { userName, email, role };

            const token = jwt.sign(tokenPayload, process.env.SECRET as string, {
                expiresIn: '36000s',
            });

            return res.status(200).json({
                message: 'Logged in successfully',
                token,
            });
        } else {
            return res.status(401).json({
                error: 'userName not found',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }

}

//get email_userName
export const get_email_userName = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        const data = await pool.request()
            .execute("get_email_userName");

        return res.status(200).json(data.recordset);
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

//checkUser Details
export const checkUserDetails = async (req: ExtendedUser, res: Response) => {
    if (req.info) {
        return res.json({
            info: req.info
        })
    }
}

//get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        const data = await pool.request()
            .execute("getUsers");

        return res.status(200).json(data.recordset);
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

//follow user
export const followUser = async (req: Request, res: Response) => {
    try {

        const { userID, userFollowedID } = req.body;
        const pool = await mssql.connect(sqlConfig);
        const data = await pool.request()
            .input("userID", mssql.VarChar, userID)
            .input("userFollowedID", mssql.VarChar, userFollowedID)
            .execute("followUser");

        return res.status(200).json({ message: 'User followed successfully.' });
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

//update user profile
export const updateProfile = async (req: Request, res: Response) => {

    try {

        const { userName, email, password } = req.body;

        const { error } = profileUpdateValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const hashedPwd = await bcrypt.hash(password, 5);

        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('userName', mssql.VarChar, userName)
            .input('email', mssql.VarChar, email)
            .input('password', mssql.VarChar, hashedPwd)
            .execute('UpdateUserProfile')

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Profile updated successfully' });


        } else {
            res.status(400).json({ error: 'Failed to update profile' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//initiate password reset
export const initiate_password_reset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const { error } = passwordResetRequestValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const resetToken = generateRandomToken();
        const expiryTime = calculateExpiryTime();

        const pool = await mssql.connect(sqlConfig);

        const resetResult = await pool
            .request()
            .input('email', mssql.VarChar, email)
            .input('resetToken', mssql.VarChar, resetToken)
            .input('expiryTime', mssql.Numeric, expiryTime)
            .execute('initiate_password_reset');

        if (resetResult.recordset && resetResult.recordset.length > 0) {
            const message = resetResult.recordset[0].message;
            if (message === 'Password reset initiated') {
                return res.status(200).json({ message: `password reset initiated check ${email} for more details`,
             });
            } else {
                return res.status(400).json({ message: 'email not found.' });
            }
        } else {
            return res.status(500).json({
                message: 'Error initiating password reset',
            });
        }
    } catch (error: any) {
        console.error('Error with the password reset', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const generateRandomToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const calculateExpiryTime = () => {
    return Math.floor(Date.now() / 1000) + 3600;
};


//reset password
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword, token } = req.body;

        const { error } = passwordResetValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const hashedPwd = await bcrypt.hash(newPassword, 5);

        const pool = await mssql.connect(sqlConfig);

        const resetResult = await pool
            .request()
            .input('email', mssql.VarChar, email)
            .input('newPassword', mssql.VarChar, hashedPwd)
            .input('token', mssql.VarChar, token)
            .execute('updatePassword');

        if (resetResult.recordset && resetResult.recordset.length > 0) {
            const message = resetResult.recordset[0].message;

            if (message === 'Password updated successfully') {
                return res.status(200).json({ message: 'Password reset successful' });
            } else if (message === 'Invalid token') {
                return res.status(400).json({ message: 'Invalid reset token' });
            } else if (message === 'Invalid email') {
                return res.status(400).json({ message: 'Invalid email' });
            } else {
                return res.status(500).json({
                    message: 'Error resetting password',
                });
            }
        } else {
            return res.status(500).json({
                message: 'Error resetting password',
            });
        }
    } catch (error: any) {
        console.error('Error with the password reset', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

























