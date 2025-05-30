import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/model-user';
import { EStatus, IUser } from '../types/user';

interface IAuthRequest extends Request {
    userAuth?: IUser | null;
}

const adminLoginNew = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.json({
                success: false,
                message: "email or password can't be empty"
            });
            return;
        }

        const checkUser = await User.findOne({ u_email: email });

        if (!checkUser) {
            res.json({ message: 'Invalid email' });
            return;
        }

        const passwordMatch = await bcrypt.compare(
            password,
            checkUser.u_password
        );

        if (!passwordMatch) {
            res.json({ message: 'Invalid credentials' });
            return;
        }

        if (checkUser && passwordMatch) {
            const token = jwt.sign(
                { _id: checkUser._id, email: checkUser.u_email },
                'secret',
                { expiresIn: '1h' }
            );

            res.cookie('accessToken', token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
                path: '/'
            });

            res.status(200).json({
                success: true,
                message: 'Admin logged in',
                userId: checkUser._id
            });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: `Error when login: ${error.message}`
            });
            return;
        }
    }
};

const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.json({
                success: false,
                message: "email or password can't be empty"
            });
            return;
        }

        const checkUser = await User.findOne({ u_email: email });
        if (!checkUser) {
            res.json({ message: 'Invalid email' });
            return;
        }

        const passwordMatch = await bcrypt.compare(
            password,
            checkUser.u_password
        );
        if (!passwordMatch) {
            res.json({ message: 'Invalid credentials' });
            return;
        }

        if (checkUser && passwordMatch) {
            const token = jwt.sign(
                { _id: checkUser._id, email: checkUser.u_email },
                'secret',
                { expiresIn: '1hr' }
            );
            res.status(200).json({
                success: true,
                message: 'Admin logged in',
                accessToken: token
            });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: `Error when login: ${error.message}`
            });
            return;
        }
    }
};

const adminGetInfo = async (req: IAuthRequest, res: Response) => {
    try {
        if (!req.userAuth) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }

        const user = await User.findById(req.userAuth._id).select(
            '-u_password'
        );
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Admin user not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
        return;
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `Error of when fetching logged in admin: ${error.message}`
            });
            return;
        }
    }

    // try {
    //     const id = req.params.id;
    //     const query = await User.findById(id);

    //     if (!query) {
    //         res.status(404).json({
    //             success: false,
    //             message: 'Admin user not found'
    //         });
    //     }

    //     if (query) {
    //         res.status(200).json(query);
    //     }
    // } catch (error) {
    //     if (error instanceof Error) {
    //         res.status(500).json({
    //             success: false,
    //             message: `Error when get admin info: ${error.message}`
    //         });
    //         return;
    //     }
    // }
};

const adminCreateUserAccount = async (req: Request, res: Response) => {
    try {
        const { email, password, name, gender, state, occupation } = req.body;

        if (!email || !password || !gender || !state) {
            res.json({
                success: false,
                message: "Inputs can't be empty"
            });
            return;
        }

        const isDuplicate = await User.findOne({ u_email: email });

        if (isDuplicate) {
            res.json({
                success: false,
                message: 'Email already exists la'
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            u_email: email,
            u_password: hashedPassword,
            u_name: name,
            u_gender: gender,
            u_state: state,
            u_occupation: occupation,
            u_status: EStatus.Active
        });

        if (user) {
            res.status(200).json({
                success: true,
                message: `Successfully created a user!`
            });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `Error of when creating a user: ${error.message}`
            });
            return;
        }
    }
};

export { adminCreateUserAccount, adminLogin, adminGetInfo, adminLoginNew };
