import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  },
  storageLimit: Number,
  price: Number,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  renewalDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Subscription', subscriptionSchema);
