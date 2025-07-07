import { ObjectId } from 'mongodb';
export type AllUsersType = {
    _id: string | ObjectId;
    username: string;
    email: string;
    isBlocked: boolean;
    createdAt: Date;
};
