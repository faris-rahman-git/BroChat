import { Schema, model } from 'mongoose';

const reportSchema = new Schema({
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  reportedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'conversationModel',
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
  takenAction: { type: String },
  note: { type: String },
  actionTakeAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default model('reportModel', reportSchema);
