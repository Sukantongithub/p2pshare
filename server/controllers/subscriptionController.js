import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

// Storage tiers
const STORAGE_TIERS = {
  free: { storage: 1073741824, price: 0 }, // 1GB
  basic: { storage: 10737418240, price: 4.99 }, // 10GB
  premium: { storage: 107374182400, price: 9.99 }, // 100GB
};

export const getPlans = (req, res) => {
  const plans = Object.entries(STORAGE_TIERS).map(([name, data]) => ({
    name,
    storage: Math.round(data.storage / 1024 / 1024 / 1024) + 'GB',
    price: data.price,
  }));

  res.json({ plans });
};

export const upgradePlan = async (req, res) => {
  try {
    const { planName } = req.body;

    if (!STORAGE_TIERS[planName]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await User.findById(req.user.id);
    const planData = STORAGE_TIERS[planName];

    // Update user subscription
    user.subscription = planName;
    user.storageLimit = planData.storage;

    // Set expiry to 30 days from now (for non-free plans)
    if (planName !== 'free') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      user.subscriptionExpiry = expiryDate;
    }

    await user.save();

    // Create subscription record
    const subscription = new Subscription({
      userId: user._id,
      plan: planName,
      storageLimit: planData.storage,
      price: planData.price,
      status: 'active',
      endDate: planName !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
    });

    await subscription.save();

    res.json({
      message: `Upgraded to ${planName} plan`,
      user: {
        subscription: user.subscription,
        storageLimit: user.storageLimit,
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const subscription = await Subscription.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

    // Check if subscription has expired
    if (user.subscriptionExpiry && new Date() > user.subscriptionExpiry) {
      user.subscription = 'free';
      user.storageLimit = STORAGE_TIERS.free.storage;
      await user.save();
    }

    res.json({
      currentPlan: user.subscription,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      storagePercentage: Math.round((user.storageUsed / user.storageLimit) * 100),
      subscriptionExpiry: user.subscriptionExpiry,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      } : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.subscription === 'free') {
      return res.status(400).json({ error: 'Cannot cancel free plan' });
    }

    const subscription = await Subscription.findOne({ userId: req.user.id, status: 'active' });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    user.subscription = 'free';
    user.storageLimit = STORAGE_TIERS.free.storage;
    user.subscriptionExpiry = null;
    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
