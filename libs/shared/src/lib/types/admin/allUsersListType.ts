import { ObjectId } from 'mongodb';
export type AllUsersType = {
    _id: string | ObjectId;
    username: string;
    email: string;
    isBlocked: boolean;
    blockedAt?: Date | null;
    createdAt: Date;

    name : string ;
    phoneNumber?: number | null;
    avatar?: string;
    isDeleted: boolean;
    deletedAt?: Date | null;
    deletedBy?: string | null;
};
