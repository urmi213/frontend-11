import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  description = '',
  trend = '',
  trendUp = true,
  loading = false,
  className = '',
  onClick
}) => {
  // Color configurations
  const colorConfig = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-700',
      darkText: 'text-red-900',
      lightText: 'text-red-600',
      trendBg: trendUp ? 'bg-red-100' : 'bg-red-50',
      trendText: trendUp ? 'text-red-800' : 'text-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      darkText: 'text-blue-900',
      lightText: 'text-blue-600',
      trendBg: trendUp ? 'bg-blue-100' : 'bg-blue-50',
      trendText: trendUp ? 'text-blue-800' : 'text-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-700',
      darkText: 'text-green-900',
      lightText: 'text-green-600',
      trendBg: trendUp ? 'bg-green-100' : 'bg-green-50',
      trendText: trendUp ? 'text-green-800' : 'text-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      text: 'text-yellow-700',
      darkText: 'text-yellow-900',
      lightText: 'text-yellow-600',
      trendBg: trendUp ? 'bg-yellow-100' : 'bg-yellow-50',
      trendText: trendUp ? 'text-yellow-800' : 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
      darkText: 'text-purple-900',
      lightText: 'text-purple-600',
      trendBg: trendUp ? 'bg-purple-100' : 'bg-purple-50',
      trendText: trendUp ? 'text-purple-800' : 'text-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      text: 'text-pink-700',
      darkText: 'text-pink-900',
      lightText: 'text-pink-600',
      trendBg: trendUp ? 'bg-pink-100' : 'bg-pink-50',
      trendText: trendUp ? 'text-pink-800' : 'text-pink-600',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-700',
      darkText: 'text-indigo-900',
      lightText: 'text-indigo-600',
      trendBg: trendUp ? 'bg-indigo-100' : 'bg-indigo-50',
      trendText: trendUp ? 'text-indigo-800' : 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      text: 'text-gray-700',
      darkText: 'text-gray-900',
      lightText: 'text-gray-600',
      trendBg: trendUp ? 'bg-gray-100' : 'bg-gray-50',
      trendText: trendUp ? 'text-gray-800' : 'text-gray-600',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  if (loading) {
    return (
      <div className={`rounded-xl border ${config.border} ${config.bg} p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${config.iconBg}`}></div>
          <div className="w-16 h-6 rounded bg-gray-200"></div>
        </div>
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-xl border ${config.border} ${config.bg} p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Header with Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${config.iconBg}`}>
          <div className={config.iconColor}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${config.trendBg} ${config.trendText}`}>
            {trendUp ? '↗' : '↘'} {trend}
          </span>
        )}
      </div>

      {/* Main Value */}
      <h3 className={`text-3xl font-bold mb-1 ${config.darkText}`}>
        {value}
      </h3>

      {/* Title */}
      <h4 className={`text-lg font-semibold mb-2 ${config.text}`}>
        {title}
      </h4>

      {/* Description */}
      {description && (
        <p className={`text-sm ${config.lightText}`}>
          {description}
        </p>
      )}

      {/* Progress Bar (optional) */}
      {typeof trend === 'string' && trend.includes('%') && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={config.lightText}>Progress</span>
            <span className={config.text}>{trend}</span>
          </div>
          <div className={`h-2 rounded-full ${config.iconBg} overflow-hidden`}>
            <div 
              className={`h-full ${config.iconColor} transition-all duration-500`}
              style={{ 
                width: trend.replace('%', '') > 100 ? '100%' : trend 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Also create a StatsCards component for grid layout
const StatsCards = ({ children, cols = 4, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[cols] || gridCols[4]} gap-4 ${className}`}>
      {children}
    </div>
  );
};

// Export both as named exports
export { StatsCard, StatsCards };

// Also export StatsCard as default for convenience
export default StatsCard;