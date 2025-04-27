// *********************
// Role of the component: Stock availability component for displaying current stock status of the product
// Name of the component: StockAvailabillity.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced by Claude)
// Version: 1.1
// Component call: <StockAvailabillity stock={stock} inStock={inStock} />
// Input parameters: { stock: number, inStock: number }
// Output: styled text that displays current stock status on the single product page with bilingual support
// *********************


'use client';
import React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { FaXmark } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const StockAvailabillity = ({ stock, inStock } : { stock: number, inStock: number }) => {
  const { language } = useLanguage();

  // Translations
  const translations = {
    availability: {
      en: "Availability",
      sw: "Upatikanaji"
    },
    inStock: {
      en: "In stock",
      sw: "Ipo stoo"
    },
    outOfStock: {
      en: "Out of stock",
      sw: "Haipo stoo"
    },
    remainingItems: {
      en: "items remaining",
      sw: "bidhaa zilizobaki"
    },
    lowStock: {
      en: "Low stock",
      sw: "Stoki ndogo"
    }
  };

  // Determine stock status
  const isLowStock = inStock === 1 && stock <= 5;
  
  return (
    <div className="flex flex-col gap-2 max-[500px]:items-center">
      <p className='text-xl flex items-center gap-x-2 font-medium text-neutral-700'>
        {translations.availability[language]}: 
        {inStock === 1 ? (
          <motion.span 
            className={`flex items-center gap-x-1 px-2 py-1 rounded-md ${isLowStock ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLowStock ? translations.lowStock[language] : translations.inStock[language]}
            <FaCheck className={`${isLowStock ? 'text-amber-500' : 'text-green-500'}`} />
          </motion.span>
        ) : (
          <motion.span 
            className='flex items-center gap-x-1 px-2 py-1 bg-red-50 text-red-600 rounded-md'
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {translations.outOfStock[language]}
            <FaXmark className="text-red-500" />
          </motion.span>
        )}
      </p>
      
      {/* Stock count indicator for in-stock items */}
      {inStock === 1 && (
        <div className="flex items-center mt-1">
          <div className="w-full max-w-[150px] bg-neutral-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                stock <= 5 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (stock / 20) * 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="ml-3 text-sm text-neutral-600">
            {stock} {translations.remainingItems[language]}
          </span>
        </div>
      )}
    </div>
  );
};

export default StockAvailabillity;