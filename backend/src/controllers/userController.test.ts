

import mssql from "mssql";
import bcrypt from "bcrypt";
import { loginUser, registerUser } from "./userControllers";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

describe("it mocks a v4", () => {

    it("brings back a unique id", () => {

        const mockedV4 = jest.requireMock('uuid').v4

        //  mockedV4.mockImplementation(()=>'something')
        console.log(v4());


    })
})

describe("User Registration", () => {
    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });


    it("registers a user", async () => {
        let req = {
            body: {
                userName: "Mike",
                email: "mikevenum9@gmail.com",
                password: "Mike123.100#",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("Mike123.100#" as never);

        const mockedInput = jest.fn().mockReturnThis();

        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute,
        };

        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };

        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool as never);

        await registerUser(req as Request, res as any);

        expect(res.json).toHaveBeenCalledWith({
            message: "User registered successfully",
        });
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it("failed to register", async () => {
        const req = {
            body: {
                userName: "Mike",
                email: "mikevenum9@gmail.com",
                password: "Mike123",
            },
        };

        jest
            .spyOn(bcrypt, "hash")
            .mockResolvedValueOnce("HashedPass@word123" as never);

        const mockedInput = jest.fn().mockReturnThis();

        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute,
        };

        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };

        jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool as never);

        await registerUser(req as Request, res as never);

        expect(res.json).toHaveBeenCalledWith({
            error: '"userName" is required',
        });
        expect(res.status).toHaveBeenCalledWith(400)
    });

});


//login user
// describe("User Login", () => {

//     let res: any;
//     let req: any;

//     beforeEach(() => {
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn().mockReturnThis(),
//         };
//     });

//     it("Returns an error if email or password is empty", async () => {
//         const req = {
//             body: {
//                 email: "",
//                 password: "",
//             },
//         };

//         await loginUser(req as Request, res);

//         expect(res.json).toHaveBeenCalledWith({
//             error: '"email" is not allowed to be empty',
//         });
//     });
//     it('Returns an error if email or password is missing', async () => {
//         const req = {
//             body: {

//             }
//         }

//         await loginUser(req as Request, res)

//         expect(res.json).toHaveBeenCalledWith({ "error": "\"password\" is required" })

//     })

//     it("Returns an error if email is not in database", async () => {
//         const req = {
//             body: {
//                 email: "incorrect@email.com",
//                 password: "12345678"
//             }
//         }

//         jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
//             request: jest.fn().mockReturnThis(),
//             input: jest.fn().mockReturnThis(),
//             execute: jest.fn().mockResolvedValueOnce({ recordset: [] })
//         } as never)

//         await loginUser(req as Request, res)

//         expect(res.json).toHaveBeenCalledWith({ error: "Email not found" })
//     })

//     it("Handles incorrect password scenario", async () => {
//         const req = {
//             body: {
//                 email: "correct@email.com",
//                 password: "wrongPassword"
//             }
//         }

//         jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
//             request: jest.fn().mockReturnThis(),
//             input: jest.fn().mockReturnThis(),
//             execute: jest.fn().mockResolvedValueOnce({
//                 recordset: [{
//                     email: 'correct@email.com',
//                     password: 'hashedPwd'
//                 }]
//             })
//         } as never)

//         jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)

//         await loginUser(req as Request, res)

//         expect(res.json).toHaveBeenCalledWith({ error: "Incorrect password" })
//     })

//     it("successfully logs in a user and returns a token", async () => {

//         let expectedUser = {
//             userID: "539c2d03-1605-43af-8553-f87c8045352f",
//             userName: "Eucs",
//             email: "eucs@gmail.com",
//             password: "$2b$05$H88rqrOnfZSrEGVXbnuI5.cfT4gR7slyPPCc6dIadBcGL/MQ8KvIe",
//             role: "customer",
//             welcomed: 0,
//         };

//         const req = {
//             body: {
//                 email: expectedUser.email,
//                 password: "correctPassword"
//             }
//         }

//         jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
//             request: jest.fn().mockReturnThis(),
//             input: jest.fn().mockReturnThis(),
//             execute: jest.fn().mockResolvedValueOnce({ recordset: [expectedUser] })
//         } as never)

//         jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never)

//         jest.spyOn(jwt, 'sign').mockReturnValueOnce("generate-token-jghjg-jyiugjxz-mmhjruyiu" as never)

//         await loginUser(req as Request, res)

//         expect(res.json).toHaveBeenCalledWith({
//             message: "Logged in successfully",
//             token: "generate-token-jghjg-jyiugjxz-mmhjruyiu"
//         })

//     })

// })