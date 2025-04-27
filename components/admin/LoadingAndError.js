// components/admin/LoadingAndError.jsx
import { Loader2, AlertCircle } from 'lucide-react';

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-2" />
      <div className="text-gray-600">{message}</div>
    </div>
  );
}

  
  export function ErrorDisplay({ message }) {
    return (
      <div className="bg-error-100 p-4 rounded-lg text-error-700 flex items-center">
        <AlertCircle className="mr-2" size={20} />
        <span>Error loading products: {message}</span>
      </div>
    );
  }