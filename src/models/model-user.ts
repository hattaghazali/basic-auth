import mongoose, { Schema, Document } from 'mongoose';
import { EGender, EOccupation, EState, EStatus, IUser } from '../types/user';

const schemaUser = new mongoose.Schema<IUser>(
    {
        u_email: {
            type: String,
            required: true
        },
        u_password: {
            type: String,
            required: true
        },
        u_name: {
            type: String
        },
        u_gender: {
            type: Number,
            enum: [EGender.Male, EGender.Female]
        },
        u_state: {
            type: Number,
            enum: Object.values(EState).filter(
                (value) => typeof value === 'number'
            ) as number[]
        },
        u_occupation: {
            type: Number,
            enum: Object.values(EOccupation).filter(
                (value) => typeof value === 'number'
            ) as number[]
        },
        u_status: {
            type: Number,
            enum: Object.values(EStatus).filter(
                (value) => typeof value === 'number'
            ) as number[],
            required: true,
            default: EStatus.Active
        }
    },
    { timestamps: true, collection: 'tbl_user' }
);

const User = mongoose.model<IUser>('User', schemaUser);
export default User;
