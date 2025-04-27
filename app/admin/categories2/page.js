'use client';

// File: pages/admin/categories/index.jsx
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { LoadingSpinner, ErrorDisplay } from '@/components/admin/LoadingAndError';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// Hook for fetching and managing categories
function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (err) {
      setError(err.message);
    }
  };

  return { categories, isLoading, error, deleteCategory };
}

// Hook for filtering and sorting categories
function useCategoryFilters(categories) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return {
    searchTerm,
    sortField,
    sortDirection,
    handleSearch,
    handleSort,
    sortedCategories
  };
}

// CategoryHeader component
function CategoryHeader({ onAddCategory, onSearch, searchValue }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-0">Categories</h1>
      <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full p-2 border rounded pl-10"
            value={searchValue}
            onChange={onSearch}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <button
          onClick={onAddCategory}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors w-full md:w-auto"
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>
    </div>
  );
}

// CategoryTable component
function CategoryTable({
  categories,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete
}) {
  const confirmDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      onDelete(id);
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ml-1" />;
    return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name {renderSortIcon('name')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('productsCount')}
            >
              <div className="flex items-center">
                Products Count {renderSortIcon('productsCount')}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.products?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(category.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit(category.id)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDelete(category.id, category.name)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminCategories() {
  const router = useRouter();
  const { categories, isLoading, error, deleteCategory } = useCategories();
  const {
    searchTerm,
    sortField,
    sortDirection,
    handleSearch,
    handleSort,
    sortedCategories
  } = useCategoryFilters(categories);

  const handleViewCategory = (categoryId) => {
    router.push(`/admin/categories/${categoryId}`);
  };

  const handleEditCategory = (categoryId) => {
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  const handleAddCategory = () => {
    router.push('/admin/categories/new');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Loading categories..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <ErrorDisplay message={error} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header with actions */}
        <CategoryHeader
          onAddCategory={handleAddCategory}
          onSearch={handleSearch}
          searchValue={searchTerm}
        />
        
        {/* Categories Table */}
        <CategoryTable
          categories={sortedCategories}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onView={handleViewCategory}
          onEdit={handleEditCategory}
          onDelete={deleteCategory}
        />
      </div>
    </AdminLayout>
  );
}