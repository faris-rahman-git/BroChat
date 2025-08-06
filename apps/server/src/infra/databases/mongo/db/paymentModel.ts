import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  feature: {
    type: String,
    enum: ['premium_group', 'monthly', 'yearly'],
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
});
export default model('paymentModel', paymentSchema);
