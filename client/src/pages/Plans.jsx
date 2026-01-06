import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../utils/api';
import PlanCard from '../components/PlanCard';
import Navbar from '../components/Navbar';

// Fallback plans if API fails
const FALLBACK_PLANS = [
  { name: 'Free', storage: '30GB', price: 0 },
  { name: 'Pro', storage: '500GB', price: 9.99 },
  { name: 'Unlimited', storage: 'Unlimited', price: 19.99 },
];

const Plans = () => {
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  const [currentSub, setCurrentSub] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await subscriptionAPI.getPlans();
      if (res.data.plans && res.data.plans.length > 0) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      console.error('Failed to load plans, using defaults:', err);
      // Keep fallback plans
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const res = await subscriptionAPI.getCurrentSubscription();
      setCurrentSub(res.data);
    } catch (err) {
      console.error('Failed to load subscription:', err);
    }
  };

  const handleUpgrade = () => {
    fetchCurrentSubscription();
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Choose Your Plan</h1>
        <p className="text-gray-300 text-center mb-8">Upgrade to get more storage and features</p>

        {currentSub && (
          <div className="bg-blue-500/20 border border-blue-400/50 text-blue-200 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">Current Plan: <span className="uppercase">{currentSub.currentPlan}</span></p>
            <p className="text-sm">Storage: {(currentSub.storageUsed / (1024 ** 3)).toFixed(2)}GB / {(currentSub.storageLimit / (1024 ** 3)).toFixed(2)}GB ({currentSub.storagePercentage}%)</p>
            {currentSub.subscriptionExpiry && (
              <p className="text-sm">Expires: {new Date(currentSub.subscriptionExpiry).toLocaleDateString()}</p>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-300">Loading plans...</p>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30">
            <p className="text-gray-300">No plans available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <PlanCard
                key={idx}
                plan={plan}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
        )}

        {currentSub?.subscription?.status === 'active' && currentSub?.currentPlan !== 'free' && (
          <div className="text-center mt-12">
            <button
              onClick={async () => {
                try {
                  await subscriptionAPI.cancelSubscription();
                  fetchCurrentSubscription();
                  alert('Subscription cancelled. You will revert to free plan.');
                } catch (err) {
                  alert('Failed to cancel subscription');
                }
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Cancel Current Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
