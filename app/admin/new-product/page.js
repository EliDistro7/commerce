
'use client'

// File: pages/admin/products/new.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  AlertCircle,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewProduct() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    manufacturer: '',
    inStock: '0',
    rating: '0',
    categoryId: '',
    mainImage: null,
    additionalImages: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/categories`);
        
        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load product categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    
    if (!formData.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = "Price must be a valid positive number";
    }
    
    if (!formData.manufacturer.trim()) errors.manufacturer = "Manufacturer is required";
    
    if (isNaN(parseInt(formData.inStock)) || parseInt(formData.inStock) < 0) {
      errors.inStock = "Stock must be a valid non-negative number";
    }
    
    if (!formData.categoryId) errors.categoryId = "Please select a category";
    
    if (!formData.mainImage) errors.mainImage = "Main product image is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        mainImage: "Image size should be less than 5MB"
      });
      return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setFormData({
      ...formData,
      mainImage: file
    });
    
    // Clear validation error
    if (formErrors.mainImage) {
      setFormErrors({
        ...formErrors,
        mainImage: null
      });
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter out files larger than 5MB
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      setFormErrors({
        ...formErrors,
        additionalImages: "Some images were skipped because they were larger than 5MB"
      });
    }
    
    // Generate previews
    const newPreviews = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setAdditionalImagePreviews([...additionalImagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    setFormData({
      ...formData,
      additionalImages: [...formData.additionalImages, ...validFiles]
    });
  };

  const removeAdditionalImage = (index) => {
    const updatedImages = [...formData.additionalImages];
    updatedImages.splice(index, 1);
    
    const updatedPreviews = [...additionalImagePreviews];
    updatedPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      additionalImages: updatedImages
    });
    setAdditionalImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error if any
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      // Create a FormData object to handle file uploads
      const productData = new FormData();
      productData.append('title', formData.title);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('manufacturer', formData.manufacturer);
      productData.append('inStock', formData.inStock);
      productData.append('rating', formData.rating);
      productData.append('categoryId', formData.categoryId);
      
      if (formData.mainImage) {
        productData.append('mainImage', formData.mainImage);
      }
      
      formData.additionalImages.forEach(image => {
        productData.append('additionalImages', image);
      });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/products`, {
        method: 'POST',
        body: productData,
        // Note: Do not set Content-Type header, browser will set it with boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product.");
      }
      
      // Success!
      setSaveSuccess(true);
      
      // Redirect to products list after short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
      
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      
      // Scroll to error message
      setTimeout(() => {
        const errorEl = document.querySelector('.form-error');
        if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-neutral-600" />
            </button>
            <h1 className="text-2xl font-heading font-bold">Add New Product</h1>
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
        
        {/* Success message */}
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success-100 text-success-700 p-4 rounded-lg flex items-center"
          >
            <Check size={20} className="mr-2" />
            <span>Product created successfully! Redirecting...</span>
          </motion.div>
        )}
        
        {/* Error message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error-100 text-error-700 p-4 rounded-lg flex items-center form-error"
          >
            <AlertCircle size={20} className="mr-2" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {/* Main form */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Basic info */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium border-b pb-2">Product Information</h2>
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                    Product Title*
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formErrors.title ? 'border-error-300 ring-1 ring-error-300' : 'border-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300`}
                    placeholder="Enter product title"
                  />
                  {formErrors.title && (
                    <p className="text-error-500 text-xs mt-1 error-message">{formErrors.title}</p>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formErrors.description ? 'border-error-300 ring-1 ring-error-300' : 'border-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300`}
                    placeholder="Enter product description"
                  />
                  {formErrors.description && (
                    <p className="text-error-500 text-xs mt-1 error-message">{formErrors.description}</p>
                  )}
                </div>
                
                {/* Price and stock - two columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                      Price (TZS)*
                    </label>
                    <div className="relative">
                      <input
                        id="price"
                        name="price"
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-2 border ${formErrors.price ? 'border-error-300 ring-1 ring-error-300' : 'border-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300`}
                        placeholder="0.00"
                      />
                      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-neutral-50 border-r border-neutral-200 rounded-l-lg text-neutral-500">
                        TZS
                      </div>
                    </div>
                    {formErrors.price && (
                      <p className="text-error-500 text-xs mt-1 error-message">{formErrors.price}</p>
                    )}
                  </div>
                  
                  {/* Stock */}
                  <div>
                    <label htmlFor="inStock" className="block text-sm font-medium text-neutral-700 mb-1">
                      In Stock*
                    </label>
                    <input
                      id="inStock"
                      name="inStock"
                      type="number"
                      min="0"
                      value={formData.inStock}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.inStock ? 'border-error-300 ring-1 ring-error-300' : 'border-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300`}
                      placeholder="0"
                    />
                    {formErrors.inStock && (
                      <p className="text-error-500 text-xs mt-1 error-message">{formErrors.inStock}</p>
                    )}
                  </div>
                </div>
                
                {/* Manufacturer and rating */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Manufacturer */}
                  <div>
                    <label htmlFor="manufacturer" className="block text-sm font-medium text-neutral-700 mb-1">
                      Manufacturer*
                    </label>
                    <input
                      id="manufacturer"
                      name="manufacturer"
                      type="text"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${formErrors.manufacturer ? 'border-error-300 ring-1 ring-error-300' : 'border-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300`}
                      placeholder="Brand or manufacturer"
                    />
                    {formErrors.manufacturer && (
                      <p className="text-error-500 text-xs mt-1 error-message">{formErrors.manufacturer}</p>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-neutral-700 mb-1">
                      Initial Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value="0">0 - Not rated</option>
                      <option value="1">1 ★</option>
                      <option value="2">2 ★★</option>
                      <option value="3">3 ★★★</option>
                      <option value="4">4 ★★★★</option>
                      <option value="5">5 ★★★★★</option>
                    </select>
                  </div>
                </div>
                
                {/* Category */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formErrors.categoryId ? 'border-error-300 ring-1 ring-error-300' : 'border-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300`}
                  >
                    <option value="">Select a category</option>
                    {isLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))
                    )}
                  </select>
                  {formErrors.categoryId && (
                    <p className="text-error-500 text-xs mt-1 error-message">{formErrors.categoryId}</p>
                  )}
                </div>
              </div>
              
              {/* Right column - Images */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium border-b pb-2">Product Images</h2>
                
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Main Product Image*
                  </label>
                  
                  <div className={`border-2 border-dashed ${formErrors.mainImage ? 'border-error-300' : 'border-neutral-200'} rounded-lg p-4 text-center`}>
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="max-h-48 mx-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({...formData, mainImage: null});
                          }}
                          className="absolute top-2 right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer py-8"
                        onClick={() => document.getElementById('mainImage').click()}
                      >
                        <ImageIcon className="mx-auto h-12 w-12 text-neutral-400" />
                        <p className="mt-2 text-sm text-neutral-500">Click to upload main product image</p>
                        <p className="text-xs text-neutral-400">PNG, JPG, or JPEG (max 5MB)</p>
                      </div>
                    )}
                    
                    <input
                      id="mainImage"
                      name="mainImage"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                  </div>
                  
                  {formErrors.mainImage && (
                    <p className="text-error-500 text-xs mt-1 error-message">{formErrors.mainImage}</p>
                  )}
                </div>
                
                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Additional Images (Optional)
                  </label>
                  
                  <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4">
                    {/* Preview grid */}
                    {additionalImagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {additionalImagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square">
                            <img 
                              src={preview} 
                              alt={`Product image ${index + 1}`}
                              className="h-full w-full object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 bg-error-500 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className="cursor-pointer py-4 text-center"
                      onClick={() => document.getElementById('additionalImages').click()}
                    >
                      <Plus className="mx-auto h-8 w-8 text-neutral-400" />
                      <p className="mt-1 text-sm text-neutral-500">Add more images</p>
                      <p className="text-xs text-neutral-400">PNG, JPG, or JPEG (max 5MB each)</p>
                    </div>
                    
                    <input
                      id="additionalImages"
                      name="additionalImages"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleAdditionalImagesChange}
                      multiple
                      className="hidden"
                    />
                  </div>
                  
                  {formErrors.additionalImages && (
                    <p className="text-error-500 text-xs mt-1">{formErrors.additionalImages}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form actions */}
            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}