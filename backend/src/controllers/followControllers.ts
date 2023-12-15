import mssql from 'mssql';
import express, { Request, Response } from 'express';
import { sqlConfig } from '../config/sqlConfig';

//follow user
export const addFollow = async (req:Request,res:Response) => {
    const { followerID, followeeID } = req.body;
    try {
        const pool = await mssql.connect(sqlConfig);
        await pool.request()
            .input('p_followerID', mssql.VarChar, followerID)
            .input('p_followeeID', mssql.VarChar, followeeID)
            .execute('AddFollow');
        res.json({ message: 'Followed successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//get followers
export const getFollowers = async (req: Request, res: Response) => {
    const { userID } = req.params;
    try {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input('p_userID', mssql.VarChar, userID)
            .execute('GetFollowers');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//get following
export const getFollowing = async (req: Request, res: Response) => {
    const { userID } = req.body;
    try {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input('p_userID', mssql.VarChar, userID)
            .execute('GetFollowing');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//unfollow user
export const unFollow = async (req: Request, res: Response) => {
    const { followerID, followeeID } = req.body;
    try {
        const pool = await mssql.connect(sqlConfig);
        await pool.request()
            .input('p_followerID', mssql.VarChar, followerID)
            .input('p_followeeID', mssql.VarChar, followeeID)
            .execute('unFollow');
        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};