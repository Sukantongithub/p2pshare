import React from 'react';

const StorageBar = ({ used, limit }) => {
  const percentage = Math.round((used / limit) * 100);
  const usedGB = (used / (1024 ** 3)).toFixed(2);
  const limitGB = (limit / (1024 ** 3)).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Storage Usage</h3>
        <span className="text-sm text-gray-600">{usedGB}GB / {limitGB}GB</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-700">{percentage}% used</div>
    </div>
  );
};

export default StorageBar;
