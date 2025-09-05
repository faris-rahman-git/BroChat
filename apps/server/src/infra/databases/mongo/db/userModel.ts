import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true, default: '' },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: Number,
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  avatar: { type: String, default: '' },
  about: { type: String, default: '' },
  isBlocked: { type: Boolean, default: false },
  blockedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: String, enum: ['admin', 'user'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'userModel' }],
  blockedByUsers: [{ type: Schema.Types.ObjectId, ref: 'userModel' }],
  isExclusive: { type: Boolean, default: false },
  isSubscribed: { type: Boolean, default: false },
  subscriptionPlan: { type: String },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
});

export default model('userModel', UserSchema);
