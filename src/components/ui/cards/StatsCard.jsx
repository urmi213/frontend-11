import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'red', 
  trend = null,
  subtitle = '',
  loading = false 
}) => {
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
  };

  const textColorClasses = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    indigo: 'text-indigo-500',
    pink: 'text-pink-500',
  };

  const bgColorClasses = {
    red: 'bg-red-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    yellow: 'bg-yellow-50',
    indigo: 'bg-indigo-50',
    pink: 'bg-pink-50',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-pulse">
        <div className="flex items-center">
          <div className="rounded-lg bg-gray-200 p-3">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${bgColorClasses[color]}`}>
          <div className={`h-6 w-6 ${textColorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend !== null && (
              <span className={`ml-2 text-sm font-semibold ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Progress bar for some stats */}
      {(title.includes('Goal') || title.includes('Progress')) && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.min(100, Math.round((value / 100) * 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${colorClasses[color]}`}
              style={{ width: `${Math.min(100, Math.round((value / 100) * 100))}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;