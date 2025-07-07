import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true, default: '' },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: Number,
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  avatar: { type: String, default: '' },
  isBlocked: { type: Boolean, default: false },
  blockedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: String, enum: ['admin', 'user'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default model('userModel', UserSchema);
