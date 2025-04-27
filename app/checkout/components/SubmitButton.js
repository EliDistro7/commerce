// src/components/checkout/SubmitButton.jsx
export const SubmitButton = ({ isSubmitting, isAdmin }) => (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isSubmitting ? 'Processing...' : isAdmin ? 'Save Order' : 'Complete Order'}
    </button>
  );
  
 