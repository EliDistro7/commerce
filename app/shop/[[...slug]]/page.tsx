'use client';

export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// Improve readability of category text, for example category text "smart-watches" will be "Smart Watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");
    // Capitalize first letter of each word
    textArray = textArray.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return textArray.join(" ");
  } else {
    // Capitalize first letter
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};

const ShopPage = (slug: any) => {
  const { language } = useLanguage();

  // Translations
  const translations = {
    allProducts: {
      en: "Today's Menu",
      sw: "Menu ya Leo"
    },
    shopBy: {
      en: "Shop By",
      sw: "Nunua Kwa"
    },
    showingResults: {
      en: "Showing results for",
      sw: "Inaonyesha matokeo ya"
    }
  };
  
  // Get current category name
  const currentCategory = slug?.params?.slug && slug?.params?.slug[0]?.length > 0
    ? improveCategoryText(slug?.params?.slug[0])
    : translations.allProducts[language];
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="text-black bg-gradient-to-b from-white to-neutral-50 min-h-screen pb-12">
      <motion.div 
        className="max-w-screen-2xl mx-auto px-6 md:px-10 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Breadcrumb />
        </motion.div>
        
        <motion.div
          className="mt-6 mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="h-10 w-1.5 bg-primary-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-neutral-800">
              {currentCategory}
            </h1>
          </div>
          {slug?.params?.slug && slug?.params?.slug[0]?.length > 0 && (
            <p className="text-neutral-600 mt-2 ml-3">
              {translations.showingResults[language]} "{currentCategory}"
            </p>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-x-10 gap-y-8">
          <motion.aside 
            className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 h-fit"
            variants={itemVariants}
          >
            <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {translations.shopBy[language]}
            </h2>
            <Filters />
          </motion.aside>
          
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100 flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-medium text-neutral-700">
                {currentCategory}
              </h2>
              <SortBy />
            </div>
            
            <motion.div 
              className="min-h-[500px]"
              variants={itemVariants}
            >
              <Products slug={slug} />
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-8"
              variants={itemVariants}
            >
              <Pagination />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShopPage;