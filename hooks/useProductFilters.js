// hooks/useProductFilters.js
import { useState, useMemo } from 'react';

export function useProductFilters(products) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search filter
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      // Handle numerical fields
      if (['price', 'rating'].includes(sortField)) {
        return sortDirection === 'asc' 
          ? parseFloat(a[sortField]) - parseFloat(b[sortField])
          : parseFloat(b[sortField]) - parseFloat(a[sortField]);
      }
      
      // Handle string fields
      if (sortDirection === 'asc') {
        return a[sortField].localeCompare(b[sortField]);
      } else {
        return b[sortField].localeCompare(a[sortField]);
      }
    });
  }, [filteredProducts, sortField, sortDirection]);

  return { 
    searchTerm, 
    sortField, 
    sortDirection, 
    handleSearch, 
    handleSort, 
    sortedProducts,
    filteredProducts
  };
}