
import React from 'react';

interface PlaceholderChartProps {
  type: 'line' | 'bar' | 'pie' | 'map';
}

const PlaceholderChart: React.FC<PlaceholderChartProps> = ({ type }) => {
  let icon;
  
  switch (type) {
    case 'line':
      icon = (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      );
      break;
    case 'bar':
      icon = (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="18" y="3" width="4" height="18"></rect>
          <rect x="10" y="8" width="4" height="13"></rect>
          <rect x="2" y="13" width="4" height="8"></rect>
        </svg>
      );
      break;
    case 'pie':
      icon = (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
      );
      break;
    case 'map':
      icon = (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
      break;
    default:
      icon = null;
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
      {icon}
      <p className="mt-2 text-sm">Chart visualization will appear here</p>
    </div>
  );
};

export default PlaceholderChart;
