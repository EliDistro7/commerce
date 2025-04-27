// File: components/admin/ReportCard.jsx
import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportCard({ title, icon, chartType, color, link, dateRange }) {
  // Function to render a placeholder chart based on chart type
  const renderChartPlaceholder = () => {
    switch (chartType) {
      case 'line':
        return (
          <svg className="w-full h-20" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path 
              d="M0,25 L10,20 L20,25 L30,15 L40,20 L50,5 L60,15 L70,10 L80,5 L90,15 L100,10" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-primary-500 opacity-70"
            />
          </svg>
        );
      case 'bar':
        return (
          <div className="flex items-end justify-between h-20 w-full">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`${color.replace('bg-', 'bg-opacity-70 bg-')} rounded-t w-3 mx-1`}
                style={{ height: `${Math.random() * 70 + 30}%` }}
              />
            ))}
          </div>
        );
      case 'pie':
        return (
          <div className="flex justify-center h-20">
            <svg width="60" height="60" viewBox="0 0 20 20">
              <circle r="10" cx="10" cy="10" fill="#e0e0e0" />
              <circle r="5" cx="10" cy="10" fill="white" />
              <path
                d="M10,0 A10,10 0 0,1 20,10 L10,10 Z"
                fill={color.replace('bg-', 'text-')}
                className="opacity-70"
              />
              <path
                d="M10,0 A10,10 0 0,1 15,19 L10,10 Z"
                fill={color.replace('bg-', 'text-')}
                className="opacity-50"
              />
            </svg>
          </div>
        );
      case 'table':
        return (
          <div className="flex flex-col h-20 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center w-full mb-2">
                <div className="w-5 h-2 bg-neutral-200 rounded mr-2"></div>
                <div className="flex-grow h-2 bg-neutral-100 rounded"></div>
                <div className="w-10 h-2 bg-neutral-200 rounded ml-2"></div>
              </div>
            ))}
          </div>
        );
      case 'geo':
        return (
          <div className="flex justify-center items-center h-20">
            <svg width="80" height="60" viewBox="0 0 80 60">
              <path
                d="M10,40 Q20,20 30,30 T40,20 T60,30 T70,15"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d="M10,40 Q20,20 30,30 T40,20 T60,30 T70,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary-500"
              />
            </svg>
          </div>
        );
      default:
        return <div className="h-20 bg-neutral-100 rounded-md"></div>;
    }
  };

  return (
    <Link href={`${link}?start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}`}>
      <div className="bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow p-4 h-full">
        <div className="flex items-center mb-3">
          <div className={`${color} text-white p-2 rounded-md mr-3`}>
            {icon}
          </div>
          <h3 className="font-semibold text-neutral-800">{title}</h3>
        </div>
        
        <div className="my-3">
          {renderChartPlaceholder()}
        </div>
        
        <div className="flex justify-end mt-2">
          <div className="flex items-center text-primary-500 text-sm font-medium">
            <span className="mr-1">View Report</span>
            <ArrowRightCircle size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}