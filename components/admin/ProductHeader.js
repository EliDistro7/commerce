// components/admin/ProductHeader.jsx
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default function ProductHeader({ searchTerm, onSearch }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-heading font-bold">Products</h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
            value={searchTerm}
            onChange={onSearch}
          />
        </div>
        
        <Link 
          href="/admin/new-product"
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </Link>
      </div>
    </div>
  );
}