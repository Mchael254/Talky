import express, { Request } from 'express';
import mssql from 'mssql';
import { createPost, deletePost, getAllPosts, getUserPosts } from './postControllers';
const cloudinary = require('cloudinary').v2;
import { Readable } from 'stream';


describe('createPost', () => {
    let req: Request;
    let res: any;
    let mockPool: any;
    let mockCloudinary: any;

    beforeEach(() => {
        req = {
            body: {
                content: 'Test Post',
                userID: '12345',
                userName: 'testUser',

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

    it('creates a post successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await createPost(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Post created" });
    });

   
});


describe('getUserPosts', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            params: { userID: '12345' }
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

    it('retrieves user posts successfully', async () => {
        const mockPosts = [{ id: 1, content: 'Test Post' }];
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1], recordset: mockPosts });

        await getUserPosts(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it('handles no posts found', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [0], recordset: [] });

        await getUserPosts(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "No posts found" });
    });

    it('handles errors', async () => {
        mockPool.execute.mockRejectedValueOnce('Error');

        await getUserPosts(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });


});

describe('getAllPosts', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {} as unknown as Request; 

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockPool = {
            request: jest.fn().mockReturnThis(),
            execute: jest.fn()
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retrieves all posts successfully', async () => {
        const mockPosts = [{ id: 1, content: 'Test Post' }];
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1], recordset: mockPosts });

        await getAllPosts(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it('handles no posts found', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [0], recordset: [] });

        await getAllPosts(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "No posts found" });
    });

    
});

describe('deletePost', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: { postID: '12345' }
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockPool = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            query: jest.fn(),
            execute: jest.fn()
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deletes a post successfully', async () => {
        mockPool.query.mockResolvedValueOnce({ recordset: [1] }); 
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] }); 

        await deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });

    it('handles post not found', async () => {
        mockPool.query.mockResolvedValueOnce({ recordset: [] }); 

        await deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'The specified post does not exist' });
    });

});




