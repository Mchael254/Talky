import express, { Request } from 'express';
import mssql from 'mssql';
import { addFollow, getFollowers, getFollowing, unFollow } from './followControllers';


describe('it follows a user successfully', () => {
    let req: any;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                followerID: 'user123',
                followeeID: 'user456'
            }
        };

        res = {
            json: jest.fn()
        };

        mockPool = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn()
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('follows a user successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await addFollow(req, res);
        expect(res.json).toHaveBeenCalledWith({ message: 'Followed successfully' });
    });
});

describe('getFollowers', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            params: { userID: 'user123' }
        } as unknown as Request;

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        mockPool = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn()
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retrieves followers successfully', async () => {
        const mockFollowers = [{ followerID: 'follower1', name: 'Follower One' }];
        mockPool.execute.mockResolvedValueOnce({ recordset: mockFollowers });

        await getFollowers(req as Request, res);
        expect(res.json).toHaveBeenCalledWith(mockFollowers);
    });

});

describe('getFollowing', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            params: { userID: 'user123' }
        } as unknown as Request;

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        mockPool = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn()
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retrieves following successfully', async () => {
        const mockFollowing = [{ followeeID: 'followee1', name: 'Followee One' }];
        mockPool.execute.mockResolvedValueOnce({ recordset: mockFollowing });

        await getFollowing(req as Request, res);
        expect(res.json).toHaveBeenCalledWith(mockFollowing);
    });
});

describe('unFollow', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                followerID: 'follower123',
                followeeID: 'followee123'
            }
        } as unknown as Request;

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        mockPool = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn()
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('unfollows a user successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({});

        await unFollow(req, res);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unfollowed successfully' });
    });

    it('handles errors', async () => {
        mockPool.execute.mockRejectedValueOnce('Error');

        await unFollow(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        
    });
});

