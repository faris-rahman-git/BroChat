import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel',
      required: true,
    },
  ],
  Admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userModel',
      required: true,
    },
  ],
  isGroup: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  groupName: { type: String },
  about: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('conversationModel', conversationSchema);
