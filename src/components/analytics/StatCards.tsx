import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'pink';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    icon: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    icon: 'bg-green-100',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    icon: 'bg-red-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
    icon: 'bg-yellow-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    icon: 'bg-purple-100',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    icon: 'bg-indigo-100',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
    icon: 'bg-pink-100',
  },
};

const sizeClasses = {
  small: {
    padding: 'p-4',
    titleSize: 'text-xs',
    valueSize: 'text-2xl',
  },
  medium: {
    padding: 'p-6',
    titleSize: 'text-sm',
    valueSize: 'text-3xl',
  },
  large: {
    padding: 'p-8',
    titleSize: 'text-base',
    valueSize: 'text-4xl',
  },
};

/**
 * Stat Card Component - Display key metrics
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'blue',
  size = 'medium',
  loading = false,
}) => {
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  const getChangeColor = () => {
    if (!change) return '';
    if (change.type === 'increase') return 'text-green-600';
    if (change.type === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeSymbol = () => {
    if (!change) return '';
    if (change.type === 'increase') return '↑';
    if (change.type === 'decrease') return '↓';
    return '→';
  };

  return (
    <div
      className={`rounded-lg border ${colorClass.border} ${colorClass.bg} ${sizeClass.padding} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${sizeClass.titleSize} font-medium text-gray-600`}>
            {title}
          </p>
          <div className="mt-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-300"></div>
            ) : (
              <p
                className={`${sizeClass.valueSize} font-bold ${colorClass.text}`}
              >
                {value}
              </p>
            )}
          </div>

          {change && !loading && (
            <div
              className={`mt-2 flex items-center text-sm font-medium ${getChangeColor()}`}
            >
              <span className="mr-1">{getChangeSymbol()}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>

        {icon && (
          <div
            className={`${colorClass.icon} rounded-lg p-2 text-xl ${colorClass.text}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatGridProps {
  stats: StatCardProps[];
  cols?: 2 | 3 | 4;
}

/**
 * Stat Grid - Responsive grid of stat cards
 */
export const StatGrid: React.FC<StatGridProps> = ({ stats, cols = 4 }) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridClass[cols]}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

interface MetricBadgeProps {
  label: string;
  value: string | number;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Metric Badge - Small badge for displaying metrics
 */
export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  variant = 'info',
}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${variantClasses[variant]}`}
    >
      <span>{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showPercentage?: boolean;
}

/**
 * Progress Bar - Visualize percentage/progress
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color = 'blue',
  showPercentage = true,
}) => {
  const percentage = (value / max) * 100;

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showPercentage && (
          <span className="text-sm font-semibold text-gray-900">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-2 transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  onClick?: () => void;
}

/**
 * KPI Card - Key Performance Indicator card
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  trend,
  onClick,
}) => {
  const trendIcon = {
    up: '📈',
    down: '📉',
    stable: '→',
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>

        {trend && (
          <div
            className={`text-2xl ${
              trend.direction === 'up'
                ? 'text-green-600'
                : trend.direction === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {trendIcon[trend.direction]}
          </div>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};
