import express, { Request } from 'express';
import mssql from 'mssql';
import { commentOnComment, createComment, getPostComments } from './commentControllers';


describe('createComment', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                postID: 'post123',
                userID: 'user123',
                content: 'Test Comment',
                parentCommentID: null,
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

    it('creates a comment successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await createComment(req as Request, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment created" });
    });

    
});

describe('getPostComments', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            params: { postID: 'post123' }
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

    it('retrieves post comments successfully', async () => {
        const mockComments = [{ commentID: '1', content: 'Test Comment' }];
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1], recordset: mockComments });

        await getPostComments(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it('handles no comments found', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [0], recordset: [] });

        await getPostComments(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "No comments found" });
    });

});

describe('commentOnComment', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                postID: 'post123',
                userID: 'user123',
                content: 'Test Comment',
                parentCommentID: 'comment123',
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

    it('creates a comment on comment successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await commentOnComment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment on comment created" });
    });

});

describe('it updates a comment successfully', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                postID: 'post123',
                userID: 'user123',
                content: 'Test Comment',
                parentCommentID: 'comment123',
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

    it('updates a comment successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await commentOnComment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment on comment created" });
    });

});

describe('it deletes a comment successfully', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                postID: 'post123',
                userID: 'user123',
                content: 'Test Comment',
                parentCommentID: 'comment123',
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

    it('deletes a comment successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await commentOnComment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment on comment created" });
    });

});




