import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  feature: {
    type: String,
    enum: [
      'subscription',
      'paid_group',
      'exclusive_user',
      'exclusive_user_customer',
    ],
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'conversationModel',
  },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  signature: { type: String, required: true },
  amount: { type: Number, required: true },
  recipientEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },

  exclusiveDetails: {
    exclusiveUserId: { type: Schema.Types.ObjectId, ref: 'userModel' },
    adminShare: { type: Number },
    userShare: { type: Number },
  },
});
export default model('paymentModel', paymentSchema);
