'use client';

// File: pages/admin/products/index.jsx
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductTable from '@/components/admin/ProductTable';
import ProductHeader from '@/components/admin/ProductHeader';
import { LoadingSpinner, ErrorDisplay } from '@/components/admin/LoadingAndError';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilters } from '@/hooks/useProductFilters';

export default function AdminProducts() {
  const router = useRouter();
  const { products, isLoading, error, deleteProduct } = useProducts();
  const { 
    searchTerm, 
    sortField, 
    sortDirection, 
    handleSearch, 
    handleSort, 
    sortedProducts 
  } = useProductFilters(products);

  const handleViewProduct = (productId) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleEditProduct = (productId) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
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
      <div className="space-y-6">
        {/* Header with actions */}
        <ProductHeader 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
        />
        
        {/* Products Table */}
        <ProductTable 
          products={sortedProducts}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
        />
      </div>
    </AdminLayout>
  );
}