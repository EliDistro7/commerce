// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced by Claude)
// Version: 1.1
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount} />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality and bilingual support
// *********************
"use client";

import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const AddToCartSingleProductBtn = ({ product, quantityCount }: SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();
  const { language } = useLanguage();

  // Translations
  const translations = {
    addToCart: {
      en: "Add to cart",
      sw: "Ongeza kikapuni"
    },
    productAdded: {
      en: "Product added to the cart",
      sw: "Bidhaa imeongezwa kwenye kikapu"
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount
    });
    calculateTotals();
    toast.success(translations.productAdded[language], {
      duration: 3000,
      position: "top-center",
      className: "bg-primary-50 text-primary-700 border border-primary-200"
    });
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      className="relative overflow-hidden flex px-6 py-3 rounded-lg font-medium bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-all duration-300 ease-out md:min-w-[200px] w-full"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.span
        initial={{ y: 0 }}
        whileHover={{ y: -30 }}
        className="inline-block w-full"
      >
        {translations.addToCart[language]}
      </motion.span>
      
      <motion.span
        initial={{ y: 30 }}
        whileHover={{ y: 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
       
      </motion.span>
    </motion.button>
  );
};

export default AddToCartSingleProductBtn;