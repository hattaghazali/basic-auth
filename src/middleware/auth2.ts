import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user';
import User from '../models/model-user';

// interface IAuthRequest extends Request {
//     isUser?: IUser;
// }

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'No Authorization header provided'
            });
            return;
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, 'secret') as {
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
            return;
        }

        console.log(user);
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
