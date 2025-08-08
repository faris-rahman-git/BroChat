import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conversationModel',
    required: true,
  },
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
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
        enum: ['missed', 'pending', 'accepted', 'rejected'],
        default: 'pending',
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
  status: {
    type: String,
    enum: ['missed', 'pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('callModel', callSchema);
