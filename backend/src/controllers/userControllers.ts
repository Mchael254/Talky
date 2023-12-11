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
import { profileUpdateValidationSchema, userLoginValidationSchema, userRegisterValidationSchema } from "../validators/userValidators";
import { sqlConfig } from "../config/sqlConfig";
import { ExtendedUser } from "../middleware/tokenVerify.ts";

//storage engine
const storage = multer.memoryStorage();
// // Set storage engine
// const storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function(req, file, cb){
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });


//init upload
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profilePic');




//check file type
//check file type
function checkFileType(file: any, cb: any) {
    //allowed ext
    const fileTypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

export const uploadProfilePic = async (req: Request, res: Response) => {
    try {
        
        const userID = req.body.userID;
        console.log(userID);

        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'Uploaded file is not an image' });
        }
        
        const pool = await mssql.connect(sqlConfig);
        const updateQuery = `
            UPDATE Users
            SET profilePic = @profilePic
            WHERE userID = @UserID
        `;
        const request = pool.request();
        request.input('UserID', mssql.VarChar, userID);
        
        const file = req.file;
        console.log('File Object:', file);
        console.log('File Buffer:', file.buffer);

        console.log('File Type:', file.mimetype);
        console.log('File Extension:', path.extname(file.originalname));
        console.log('File MIME Type:', file.mimetype);

         // 
        request.input('profilePic', mssql.VarBinary, file.buffer);

        const result = await request.query(updateQuery);
        const rowsAffected = result.rowsAffected[0];

        if (rowsAffected > 0) {
            console.log('User profile pic updated successfully:', result);
            res.status(200).json({ message: 'User profile pic updated successfully' });
        } else {
            console.log('No rows affected. Profile pic update failed.');
            res.status(400).json({ error: 'Profile pic update failed' });
        } 
    } catch (error) {
        console.error('Error updating profile pic:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
 
  };



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
            return res.status(400).json({ error: 'Email and userName number already exist.' });
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

        return res.status(200).json({ message: 'User registered successfully.' });
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
            const { userName, email,role } = user[0];
            const tokenPayload = {  userName, email,role };

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

// //update user profile
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

// //upload profile picture based on user id



// export const uploadProfilePic = (req: Request, res: Response) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             res.status(400).json({ message: err });
//         } else {
//             try {
//                 let userID = req.body.userID
//                 // console.log(userID);
                
//                 if (!userID) {
//                     return res.status(400).json({ message: 'User ID not provided!' });
//                 }

//                 if (req.file === undefined) {
//                     return res.status(400).json({ message: 'No file selected!' });
//                 }

//                 const filePath = `uploads/${req.file.filename}`;

//                 // Update the user record with the file path
//                 const pool = await mssql.connect(sqlConfig);
//                 const updateQuery = 'UPDATE Users SET profilePic = @filePath WHERE userID = @userID';

//                 const result = await pool
//                     .request()
//                     .input('filePath', filePath)
//                     .input('userID', userID)
//                     .query(updateQuery);
               
//                     console.log(result);
                    
//                 if (result.rowsAffected[0] > 0) {
//                     res.status(200).json({ message: 'Profile updated successfully', filePath });
//                 } else {
//                     res.status(400).json({ error: 'Failed to update profile' });
//                 }

//             } catch (error) {
//                 console.error('Error uploading profile picture:', error);
//                 res.status(500).json({ message: 'Internal Server Error' });
//             }
//         }
//     });
// };









// export const uploadProfilePic = (req: Request, res: Response) => {
//     upload(req, res, (err) => {
//         if(err){
//             res.status(400).json({ message: err });
//         } else {
//             if(req.file == undefined){
//                 res.status(400).json({ message: 'No file selected!' });
//             } else {
//                 res.json({
//                     message: 'File uploaded successfully!',
//                     file: `uploads/${req.file.filename}`
//                 });
//             }
//         }
//     });
// };





  

//   upload(req, res, (err) => {
//     if (err) {
//       res.status(400).json({ message: err });
//     } else {
//       if (req.file == undefined) {
//         res.status(400).json({ message: 'No file selected!' });
//       } else {
       
//         const imagePath = `uploads/${req.file.filename}`;
//         const userID = req.body.userID; 

//         res.json({
//           message: 'File uploaded successfully!',
//           file: imagePath
//         });
//       }
//     }
//   });
  





