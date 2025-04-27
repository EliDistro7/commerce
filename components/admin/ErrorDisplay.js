// components/admin/ErrorDisplay.jsx
import { AlertCircle } from 'lucide-react';

export function ErrorDisplay({ message }) {
  return (
    <div className="bg-error-100 p-4 rounded-lg text-error-700 flex items-center">
      <AlertCircle className="mr-2" size={20} />
      <span>Error loading products: {message}</span>
    </div>
  );
}