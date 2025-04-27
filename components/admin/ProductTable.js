// components/admin/ProductTable.jsx
import { useState } from 'react';
import { Eye, Edit, Trash2, Upload, Link as LinkIcon } from 'lucide-react';

export default function ProductTable({ 
  products, 
  sortField, 
  sortDirection,
  onSort, 
  onView,
  onDelete 
}) {
  const [editingImageId, setEditingImageId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper for sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const currency = "TZS";

  const handleEditImage = (productId) => {
    setEditingImageId(productId);
    // Reset the image URL input when opening the edit form
    setImageUrl('');
  };

  const handleCancelEdit = () => {
    setEditingImageId(null);
    setImageUrl('');
  };

  const handleSubmitImageUrl = async (productId) => {
    if (!imageUrl.trim()) {
      alert('Please enter a valid image URL');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Find if there's an existing image to determine if we need PUT or POST
      const response = await fetch(`/api/product-images/${productId}`);
      const existingImages = await response.json();
      
      const method = existingImages && existingImages.length > 0 ? 'PUT' : 'POST';
      const url = method === 'PUT' 
        ? `/api/product-images/${productId}` 
        : '/api/product-images';
      
      const requestBody = {
        productID: productId,
        image: imageUrl
      };
      
      const updateResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update image: ${updateResponse.statusText}`);
      }
      
      // Refresh the current page to show updated image
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating product image:', error);
      alert('Failed to update product image. Please try again.');
    } finally {
      setIsSubmitting(false);
      setEditingImageId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  onClick={() => onSort('mainImage')}
                  className="flex items-center"
                >
                  Image
                  {getSortIndicator('mainImage')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  onClick={() => onSort('title')}
                  className="flex items-center"
                >
                  Title
                  {getSortIndicator('title')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  onClick={() => onSort('price')}
                  className="flex items-center"
                >
                  Price
                  {getSortIndicator('price')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  onClick={() => onSort('rating')}
                  className="flex items-center"
                >
                  Rating
                  {getSortIndicator('rating')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  onClick={() => onSort('manufacturer')}
                  className="flex items-center"
                >
                  Manufacturer
                  {getSortIndicator('manufacturer')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  onClick={() => onSort('inStock')}
                  className="flex items-center"
                >
                  Status
                  {getSortIndicator('inStock')}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingImageId === product.id ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="px-2 py-1 text-sm border border-neutral-300 rounded-md w-64"
                            placeholder="Enter image URL..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSubmitImageUrl(product.id)}
                            className="px-2 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
                            disabled={isSubmitting}
                          >
                            <LinkIcon size={12} className="mr-1" />
                            {isSubmitting ? 'Saving...' : 'Save URL'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center overflow-hidden">
                          {product.mainImage ? (
                            <img 
                              src={`/${product.mainImage}`} 
                              alt={product.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/placeholder/40/40";
                              }}
                            />
                          ) : (
                            <img 
                              src="/api/placeholder/40/40"
                              alt="Product placeholder"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-black">{product.title}</div>
                    <div className="text-xs text-neutral-500 truncate max-w-xs">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{currency} {parseFloat(product.price).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm">{product.rating}</span>
                      <span className="ml-1 text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.manufacturer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        parseInt(product.inStock) > 0 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-error-100 text-error-700'
                      }`}
                    >
                      {parseInt(product.inStock) > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onView(product.id)}
                        className="p-1 rounded-full hover:bg-neutral-100"
                        title="View Product"
                      >
                        <Eye size={18} className="text-neutral-500" />
                      </button>
                      <button 
                        onClick={() => handleEditImage(product.id)}
                        className="p-1 rounded-full hover:bg-neutral-100"
                        title="Update Image"
                      >
                        <Upload size={18} className="text-primary-500" />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-1 rounded-full hover:bg-neutral-100"
                        title="Delete Product"
                      >
                        <Trash2 size={18} className="text-error-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with pagination */}
      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
        <div className="text-sm text-neutral-500">
          Showing <span className="font-medium">{products.length}</span> products
        </div>
        
        {/* Simple pagination - can be expanded */}
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-neutral-200 rounded-md bg-white text-sm disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-neutral-200 rounded-md bg-white text-sm disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}