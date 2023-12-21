

import mssql from "mssql";
import bcrypt from "bcrypt";
import { followUser, getAllUsers, initiate_password_reset, loginUser, registerUser, resetPassword, updateProfile } from "./userControllers";
import { Request, request } from "express";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";



// describe("it mocks a v4", () => {

//     it("brings back a unique id", () => {

//         const mockedV4 = jest.requireMock('uuid').v4

//         //  mockedV4.mockImplementation(()=>'something')
//         console.log(v4());
//     })
// })

// describe("it mocks bcrypt", () => {

//     it("brings back a hashed password", async () => {

//         const mockedBcrypt = jest.requireMock('bcrypt').hash
//         mockedBcrypt.mockImplementation(() => 'something')
//         console.log(await bcrypt.hash('password', 10));
//     })
// })

// describe("it mocks jwt", () => {

//     it("brings back a jwt token", () => {

//         const mockedJwt = jest.requireMock('jsonwebtoken').sign
//         mockedJwt.mockImplementation(() => 'something')
//         console.log(jwt.sign({ username: 'username' }, 'secret'))
//     })
// })

// describe("it mocks mssql", () => {

//         it("brings back a mssql pool", () => {

//             const mockedMssql = jest.requireMock('mssql').connect
//             mockedMssql.mockImplementation(() => 'something')
//             console.log(mssql.connect('something'))
//         })
// });

describe('registerUser', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                userName: 'newUser',
                email: 'newuser@example.com',
                password: 'password123'
            }
        } as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mocking bcrypt hash
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

        // Mocking SQL Pool and Requests
        mockPool = {
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [] }),
            execute: jest.fn().mockResolvedValue({ rowsAffected: [1] })
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockPool as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('registers a new user successfully', async () => {
        await registerUser(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User registered successfully.',
            email: 'welcome user email sent to new user'
        });
    });

    it('returns an error when the email already exists', async () => {
        mockPool.query.mockResolvedValueOnce({ recordset: [{ email: 'newuser@example.com' }] });
        await registerUser(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
    // it('returns an error when the userName already exists', async () => {
    //     mockPool.query.mockResolvedValueOnce({ recordset: [{ userName: 'newUser' }] });
    
    //     await registerUser(req as any, res as any);
    
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({ error: 'UserName already exists' });
    // });

});

describe('loginUser', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                userName: 'testUser',
                password: 'testPassword'
            }
        } as Request;

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
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); // Mock bcrypt compare
        jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken' as never); // Mock JWT sign
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('logs in a user successfully', async () => {
        const mockUser = [{ userName: 'testUser', password: 'hashedPassword', email: 'test@example.com', role: 'user' }];
        mockPool.execute.mockResolvedValueOnce({ recordset: mockUser });

        await loginUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Logged in successfully',
            token: 'mockedToken'
        });
    });

    it('returns error for userName not found', async () => {
        mockPool.execute.mockResolvedValueOnce({ recordset: [] });

        await loginUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'userName not found' });
    });

    it('returns error for incorrect password', async () => {
        const mockUser = [{ userName: 'testUser', password: 'hashedPassword', email: 'test@example.com', role: 'user' }];
        mockPool.execute.mockResolvedValueOnce({ recordset: mockUser });

        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

        await loginUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect password' });

        jest.spyOn(bcrypt, 'compare').mockReset();
    });

    it('handles validation errors', async () => {
      
        req.body = { userName: 'testUser', password: '' }; 

        await loginUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        
    });

    it('handles server errors', async () => {
        const error = new Error('Database error');
        mockPool.execute.mockRejectedValueOnce(error);

        await loginUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});


describe('getAllUsers', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {} as Request; 

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

    it('retrieves all users successfully', async () => {
        const mockUsers = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
        mockPool.execute.mockResolvedValueOnce({ recordset: mockUsers });

        await getAllUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('handles database errors', async () => {
        const error = new Error('Database error');
        mockPool.execute.mockRejectedValueOnce(error);

        await getAllUsers(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: error });
    });
});


describe('updateProfile', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                userName: 'testUser',
                email: 'test@example.com',
                password: 'newPassword'
            }
        } as Request;

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
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('updates user profile successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ rowsAffected: [1] });

        await updateProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });

    // it('handles database errors', async () => {
    //     const error = new Error('Database error');
    //     mockPool.execute.mockRejectedValueOnce(error);

    //     await updateProfile(req, res);
    //     expect(res.json).toHaveBeenCalledWith({ error: error });
    // });
   
});

describe('initiate_password_reset', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com' }
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
        jest.spyOn(Math, 'random').mockReturnValue(0.5); 
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks(); 
    });

    it('initiates password reset successfully', async () => {
        const mockResetResult = { recordset: [{ message: 'Password reset initiated' }] };
        mockPool.execute.mockResolvedValueOnce(mockResetResult);

        await initiate_password_reset(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('password reset initiated') }));
    });

    it('handles validation errors', async () => {
        req.body.email = ''; 

        await initiate_password_reset(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
      
    });

    // it('handles non-existing email', async () => {
    //     mockPool.execute.mockResolvedValueOnce({ recordset: [] }); 

    //     await initiate_password_reset(req, res);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'email not found' });
    // });

    it('handles server errors', async () => {
        const error = new Error('Database error');
        mockPool.execute.mockRejectedValueOnce(error);

        await initiate_password_reset(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Internal Server Error' }));
    });
});



describe('resetPassword', () => {
    let req: Request;
    let res: any;
    let mockPool: any;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                newPassword: 'newPassword',
                token: 'resetToken'
            }
        } as Request;

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
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('resets password successfully', async () => {
        mockPool.execute.mockResolvedValueOnce({ recordset: [{ message: 'Password updated successfully' }] });

        await resetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successful' });
    });

    // it('handles database errors', async () => {
    //     const error = new Error('Database error');
    //     mockPool.execute.mockRejectedValueOnce(error);

    //     await resetPassword(req, res);
    //     expect(res.json).toHaveBeenCalledWith({ error: error.message });
    // });

    // it('handles invalid token', async () => {
    //     mockPool.execute.mockResolvedValueOnce({ recordset: [] });

    //     await resetPassword(req, res);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'Invalid reset token' });
    // });

    // it('handles invalid email', async () => {
    //     mockPool.execute.mockResolvedValueOnce({ recordset: [{ email: 'only' }] });
    //     mockPool.execute.mockResolvedValueOnce({ recordset: [] });

    //     await resetPassword(req, res);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' });
    // });




    
});









