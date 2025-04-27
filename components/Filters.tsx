// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced version)
// Version: 2.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter with bilingual support
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { IoFilterSharp } from "react-icons/io5";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { language } = useLanguage();

  // Translations object
  const translations = {
    filters: {
      en: "Filters",
      sw: "Vichujio"
    },
    availability: {
      en: "Availability",
      sw: "Upatikanaji"
    },
    inStock: {
      en: "In stock",
      sw: "Inapatikana"
    },
    outOfStock: {
      en: "Out of stock",
      sw: "Haipatikani"
    },
    price: {
      en: "Price",
      sw: "Bei"
    },
    maxPrice: {
      en: "Max price",
      sw: "Bei ya juu"
    },
    minimumRating: {
      en: "Minimum Rating",
      sw: "Kiwango cha Chini"
    }
  };

  // Getting current page number from Zustand store
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  
  const { sortBy } = useSortStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 } 
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    // Setting URL params and after that putting them all in URL
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page, pathname, replace]);

  // Currency symbol based on locale
  const currencySymbol = language === 'en' ? '$' : 'TSh';

  return (
    <motion.div 
      className="filter-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center gap-2 mb-4"
        variants={itemVariants}
      >
        <IoFilterSharp className="text-primary-500 text-xl" />
        <h3 className="text-xl font-medium text-neutral-800">
          {translations.filters[language]}
        </h3>
      </motion.div>

      <motion.div 
        className="border-t border-neutral-200 pt-4 mb-5"
        variants={itemVariants}
      >
        <h4 className="text-lg font-medium text-neutral-700 mb-3">
          {translations.availability[language]}
        </h4>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={inputCategory.inStock.isChecked}
                onChange={() =>
                  setInputCategory({
                    ...inputCategory,
                    inStock: {
                      text: "instock",
                      isChecked: !inputCategory.inStock.isChecked,
                    },
                  })
                }
                className="appearance-none h-5 w-5 border border-neutral-300 rounded 
                          checked:bg-primary-500 checked:border-primary-500 
                          transition-colors duration-200"
              />
              {inputCategory.inStock.isChecked && (
                <svg
                  className="absolute inset-0 h-5 w-5 text-white pointer-events-none"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="ml-2 text-neutral-700 group-hover:text-neutral-900 transition-colors">
              {translations.inStock[language]}
            </span>
          </label>

          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={inputCategory.outOfStock.isChecked}
                onChange={() =>
                  setInputCategory({
                    ...inputCategory,
                    outOfStock: {
                      text: "outofstock",
                      isChecked: !inputCategory.outOfStock.isChecked,
                    },
                  })
                }
                className="appearance-none h-5 w-5 border border-neutral-300 rounded 
                          checked:bg-primary-500 checked:border-primary-500 
                          transition-colors duration-200"
              />
              {inputCategory.outOfStock.isChecked && (
                <svg
                  className="absolute inset-0 h-5 w-5 text-white pointer-events-none"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="ml-2 text-neutral-700 group-hover:text-neutral-900 transition-colors">
              {translations.outOfStock[language]}
            </span>
          </label>
        </div>
      </motion.div>

      <motion.div 
        className="border-t border-neutral-200 pt-4 mb-5"
        variants={itemVariants}
      >
        <h4 className="text-lg font-medium text-neutral-700 mb-3">
          {translations.price[language]}
        </h4>
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: Number(e.target.value),
                },
              })
            }
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer
                      accent-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-neutral-500">0 {currencySymbol}</span>
            <span className="text-sm text-neutral-500">3000 {currencySymbol}</span>
          </div>
          <div className="mt-3 text-primary-700 font-medium">
            {translations.maxPrice[language]}: {inputCategory.priceFilter.value} {currencySymbol}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="border-t border-neutral-200 pt-4"
        variants={itemVariants}
      >
        <h4 className="text-lg font-medium text-neutral-700 mb-3">
          {translations.minimumRating[language]}:
        </h4>
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={5}
            value={inputCategory.ratingFilter.value}
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                ratingFilter: { text: "rating", value: Number(e.target.value) },
              })
            }
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer
                      accent-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
            step="1"
          />
          <div className="w-full flex justify-between text-xs px-1 mt-1 text-neutral-500">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num} 
                className={`flex flex-col items-center ${
                  num <= inputCategory.ratingFilter.value ? 'text-primary-600 font-medium' : ''
                }`}
              >
                <span>{num}</span>
                {num <= inputCategory.ratingFilter.value && (
                  <div className="w-1 h-1 rounded-full bg-primary-500 mt-1"></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center mt-3">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <svg 
                  key={i}
                  className={`w-5 h-5 ${
                    i < inputCategory.ratingFilter.value ? 'text-yellow-400' : 'text-neutral-300'
                  }`} 
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-neutral-700">
              {inputCategory.ratingFilter.value} / 5
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Filters;