import express, { Request } from 'express';
import mssql from 'mssql';
import { likeComment, likePost, unlikeComment, unlikePost } from './likesControllers';

describe('likeComment', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                commentID: 'comment123',
                userID: 'user123'
            }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
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

    it('successfully likes a comment', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await likeComment(req as Request, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment liked" });
    });

});

describe('unlikeComment', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                commentID: 'comment123',
                userID: 'user123'
            }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
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

    it('successfully unlikes a comment', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await unlikeComment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment unliked" });
    });

});

describe('like a post', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                postID: 'post123',
                userID: 'user123',
                userName: 'testUser'
            }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
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

    it('successfully likes a post', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await likePost(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Post liked" });
    });

})

describe('unlike a post', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                postID: 'post123',
                userID: 'user123'
            }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
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

    it('successfully unlikes a post', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await unlikePost(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Post unliked" });
    });
});

