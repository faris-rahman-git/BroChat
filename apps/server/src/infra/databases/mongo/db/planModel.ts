import { model, Schema } from 'mongoose';

const planSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  duration: { type: Number },
  isActive: { type: Boolean, default: false },
  PlanType: {
    type: String,
    enum: [
      'subscription',
      'paid_group',
      'exclusive_user',
      'exclusive_user_customer',
    ],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  exclusiveUserId: { type: Schema.Types.ObjectId, ref: 'userModel' },
});

export default model('planModel', planSchema);
