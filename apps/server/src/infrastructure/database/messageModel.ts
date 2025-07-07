import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  tempId: { type: String, required: true, unique: true },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conversationModel',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  MessageType: {
    type: String,
    enum: ['text', 'image', 'video', 'voice', 'document'],
    required: true,
  },
  content: { type: String },
  mediaUrl: { type: String },
  deliveredBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
      time: { type: Date, default: Date.now },
    },
  ],
  readBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
      time: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'seen'],
    default: 'sent',
  },
  messageTime: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ conversationId: 1, messageTime: -1 });

export default mongoose.model('messageModel', messageSchema);
