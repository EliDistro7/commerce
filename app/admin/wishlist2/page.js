'use client';

// File: pages/admin/wishlist/new.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { LoadingSpinner, ErrorDisplay } from '@/components/admin/LoadingAndError';
import { Loader2, AlertCircle}  from  'lucide-react';
   
export default function NewWishlistItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: '',
    productId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // State for dropdown options
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Fetch users and products for dropdowns
  useEffect(() => {
    async function fetchOptions() {
      setIsLoadingOptions(true);
      setLoadError(null);
      
      try {
        // Fetch users
        const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/users`);
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        
        // Fetch products
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/products`);
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        setUsers(usersData);
        setProducts(productsData);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId) {
      newErrors.userId = 'User is required';
    }
    
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to wishlist');
      }
      
      // Item added successfully
      router.push('/admin/wishlist');
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/wishlist');
  };

  if (isLoadingOptions) {
    return (
      <AdminLayout>
        <div className="p-6">
          <LoadingSpinner message="Loading data..." />
        </div>
      </AdminLayout>
    );
  }

  if (loadError) {
    return (
      <AdminLayout>
        <div className="p-6">
          <ErrorDisplay message={loadError} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Item to Wishlist</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
              <AlertCircle className="mr-3 text-red-500" size={20} />
              <p>{submitError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User *
              </label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  errors.userId ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isSubmitting}
              >
                <option value="">Select a User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email || user.username || user.id}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  errors.productId ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isSubmitting}
              >
                <option value="">Select a Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (${product.price?.toFixed(2) || '0.00'})
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                    Adding
                  </div>
                ) : (
                  'Add to Wishlist'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}