import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conversationModel',
    required: true,
  },
  caller: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel',
      required: true,
    },
    joinedAt: { type: Date },
    leftAt: { type: Date },
    duration: { type: Number },
  },
  roomId: { type: String, required: true },
  receivers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true,
      },
      status: {
        type: String,
        enum: ['missed', 'accepted', 'rejected'],
        default: 'missed',
      },
      joinedAt: { type: Date },
      leftAt: { type: Date },
      duration: { type: Number },
    },
  ],
  isVideoCall: {
    type: Boolean,
    required: true,
  },
  isGroupCall: {
    type: Boolean,
  },
  initiatedAt: { type: Date },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('callModel', callSchema);
