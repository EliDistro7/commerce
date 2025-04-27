// hooks/useProducts.js
import { useState, useEffect } from 'react';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/products`);
        
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Mock delete request
        // await fetch(`${process.env.SERVER}/api/products/${productId}`, {
        //   method: 'DELETE',
        // });
        
        // Optimistically update UI
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  return { products, setProducts, isLoading, error, deleteProduct };
}