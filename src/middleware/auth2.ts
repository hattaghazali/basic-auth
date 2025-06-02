import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user';
import User from '../models/model-user';

interface IAuthRequest extends Request {
    userAuth?: IUser | null;
}

const verifyToken = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'No Authorization header provided'
            });
            console.log(`no auth header provided`);
            return;
        }

        const accessToken = authHeader.replace('Bearer ', '');
        if (!accessToken) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            console.log(`no token provide`);
            return;
        }

        // Verify token
        const decoded = jwt.verify(accessToken, 'test') as {
            _id: string;
            email: string;
        };
        const user = await User.findOne({
            _id: decoded._id,
            u_email: decoded.email
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token: User not found'
            });
            console.log(`Invalid token: User not found`, user);
            return;
        }

        req.userAuth = user;
        // console.log(`verify logged in user`, user);
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                error: `ERROR OF JWT: ${error.message}`
            });
            return;
        }
    }
};
export default verifyToken;
