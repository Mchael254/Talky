import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mssql from "mssql";
import { v4 } from "uuid";
import { userLoginValidationSchema, userRegisterValidationSchema } from "../validators/userValidators";
import { sqlConfig } from "../config/sqlConfig";
import { ExtendedUser } from "../middleware/tokenVerify.ts";

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
            const loginCredentials = user.map((record) => {
                const { phone_no, id_no, password, ...rest } = record;
                return rest;
            });

            const token = jwt.sign(loginCredentials[0], process.env.SECRET as string, {
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
export const followUser = async (req:Request,res:Response) => {
    try {
        
        const {userID,userFollowedID } = req.body;
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



