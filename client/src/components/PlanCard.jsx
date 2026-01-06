import React, { useState } from 'react';
import { subscriptionAPI } from '../utils/api';

const PlanCard = ({ plan, onUpgrade }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      await subscriptionAPI.upgradePlan(plan.name.toLowerCase());
      onUpgrade();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upgrade plan');
    } finally {
      setLoading(false);
    }
  };

  const isPremium = plan.name.toLowerCase() === 'premium';
  const isBasic = plan.name.toLowerCase() === 'basic';

  return (
    <div className={`rounded-lg shadow-lg p-6 text-center transition transform hover:scale-105 ${
      isPremium ? 'bg-linear-to-br from-blue-600 to-blue-800 text-white ring-2 ring-blue-400' : 'bg-white/20 backdrop-blur-lg border border-white/30 text-white'
    }`}>
      <h2 className={`text-2xl font-bold mb-2 ${!isPremium && 'text-white'}`}>
        {plan.name.toUpperCase()}
      </h2>
      <p className={`text-3xl font-bold mb-2 ${!isPremium ? 'text-blue-300' : ''}`}>
        {plan.storage}
      </p>
      <p className={`text-lg font-semibold mb-4 ${!isPremium && 'text-gray-200'}`}>
        {plan.price === 0 ? 'FREE' : `$${plan.price}/month`}
      </p>
      {error && <p className="text-red-400 text-sm mb-4 bg-red-500/20 p-2 rounded">{error}</p>}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
          isPremium
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : `${isBasic ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : plan.price === 0 ? 'Current Plan' : 'Upgrade'}
      </button>
    </div>
  );
};

export default PlanCard;
