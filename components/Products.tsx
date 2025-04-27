// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced version)
// Version: 2.0
// Component call: <Products slug={slug} />
// Input parameters: { slug }: any
// Output: bilingual products grid with loading states and improved aesthetics
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import { useLanguage } from "@/context/LanguageContext";
import { IoBasketOutline } from "react-icons/io5";

// TypeScript interface for product
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  inStock: number;
  category: string;
  imageUrl?: string;
  // Add other properties as needed
}

const Products = async ({ slug }: any) => {
  // Language context for translations
  const { language } = useLanguage();

  // Translations object
  const translations = {
    noProducts: {
      en: "No products found for specified query",
      sw: "Hakuna bidhaa zilizopatikana kwa hoja iliyobainishwa"
    },
    loading: {
      en: "Loading products...",
      sw: "Inapakia bidhaa..."
    }
  };

  // Getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = slug?.searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = slug?.searchParams?.outOfStock === "true" ? 1 : 0;
  const page = slug?.searchParams?.page ? Number(slug?.searchParams?.page) : 1;

  let stockMode: string = "lte";
  
  // Preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1) {
    stockMode = "equals";
  }
  // If out of stock checkbox is checked, stockMode is "lt"
  if (outOfStockNum === 1) {
    stockMode = "lt";
  }
  // If in stock and out of stock checkboxes are checked, stockMode is "lte"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte";
  }
  // If in stock and out of stock checkboxes aren't checked, stockMode is "gt"
  if (inStockNum === 0 && outOfStockNum === 0) {
    stockMode = "gt";
  }

  // Sending API request with filtering, sorting and pagination for getting all products
  const data = await fetch(
    `http://localhost:3000/api/products?filters[price][$lte]=${
      slug?.searchParams?.price || 3000
    }&filters[rating][$gte]=${
      Number(slug?.searchParams?.rating) || 0
    }&filters[inStock][$${stockMode}]=1&${
      slug?.params?.slug?.length > 0
        ? `filters[category][$equals]=${slug?.params?.slug}&`
        : ""
    }sort=${slug?.searchParams?.sort}&page=${page}`
  );

  const products = await data.json();

  // Skeleton loader for products when loading
  const ProductSkeleton = () => (
    <div className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-100 h-80 w-full">
      <div className="h-48 bg-neutral-200"></div>
      <div className="p-4">
        <div className="h-5 bg-neutral-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-64 opacity-100 transition-opacity duration-500 ease-in">
      {products ? (
        products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <div 
                key={product.id} 
                className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <ProductItem key={product.id} product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 w-full text-center px-4 transition-all duration-300 ease-in-out">
            <div className="w-16 h-16 mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <IoBasketOutline className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-medium text-neutral-700">
              {translations.noProducts[language]}
            </h3>
            <p className="mt-2 text-neutral-500 max-w-md">
              {language === 'en' 
                ? 'Try adjusting your filters or search criteria to find more products.' 
                : 'Jaribu kubadilisha vichujio vyako au vigezo vya utafutaji ili kupata bidhaa zaidi.'}
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductSkeleton key={i} />
          ))}
          <div className="col-span-full text-center py-8 text-neutral-500">
            {translations.loading[language]}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;