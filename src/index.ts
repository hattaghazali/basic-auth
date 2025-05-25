import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import mongoose from 'mongoose';
import { server, mongo } from './configs/config';

import user from './routes/router-user';
import admin from './routes/router-admin';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app: Application = express();
app.use(express.json());

// LOG
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(
        `Request: ${new Date()} ${req.method} ${req.url}, ${req.body}`,
        req.body
    );
    next();
});

// MIDDLEWARE ALLOWING THE SPECIFIED FE
const corsOptions = {
    origin: 'http://localhost:5173', // MatchING FE's address
    methods: ['GET', 'POST'] // Specify the allowed HTTP methods
};
app.use(cors(corsOptions));

// ADD MORE MIDDLEWARE IF HAVE

// TEST API
app.post('/', (req: Request, res: Response) => {
    const user = { email: req.body.email };
    res.status(200).json(user);
    return;
});

// ROUTE
app.use('/api/user', user);
app.use('/api/admin', admin);

// START APP
app.listen(server.SERVER_PORT, async () => {
    console.log(`Server started on localhost:${server.SERVER_PORT}`);

    try {
        const db_connection = await mongoose.connect(mongo.MONGO_CONNECTION, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });

        !db_connection && console.log('Not connected to MongoDB');
        db_connection &&
            console.log('Connected to MongoDB:', db_connection.version);
    } catch (error) {
        console.log('DB Error: ', error);
    }

    // const hashPassword = async (password: string): Promise<string> => {
    //     const saltRounds = 10; // Number of salt rounds for hashing
    //     try {
    //         const hashedPassword = await bcrypt.hash(password, saltRounds);
    //         return hashedPassword;
    //     } catch (error) {
    //         throw new Error(
    //             'Error hashing password: ' + (error as Error).message
    //         );
    //     }
    // };

    // const password = 'pass12345';
    // try {
    //     const hashedPassword = await hashPassword(password);
    //     console.log('Original password:', password);
    //     console.log('Hashed password:', hashedPassword);
    // } catch (error) {
    //     console.error(error);
    // }
});
