import React from 'react';

interface DataCardProps {
  title: string;
  size: 'small' | 'large';
  type: 'line' | 'bar' | 'donut' | 'summary';
  value?: string; // For summary type cards
  change?: string; // For summary type cards
}

const DataCard: React.FC<DataCardProps> = ({ title, size, type, value, change }) => {
  
  // Set height dynamically based on size prop
  const cardHeight = size === 'large' ? 'h-96' : 'h-64';

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg ${cardHeight}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h3>

      {/* Conditional Rendering for Summary vs. Chart */}
      {type === 'summary' && value ? (
        <div className="flex flex-col justify-center items-center h-full -mt-6">
          <p className="text-5xl font-extrabold text-blue-600 mb-2">{value}</p>
          <p className={`text-lg font-medium ${change?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </p>
          <div className="text-sm text-gray-500 mt-2">Total Users Reached</div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          {/* Placeholder for actual chart component */}
          <div className={`text-gray-400 text-sm italic`}>
             [{type.toUpperCase()} Chart Goes Here] 
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCard;