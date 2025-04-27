// *********************
// Role of the component: Pagination for navigating the shop page
// Name of the component: Pagination.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced version)
// Version: 2.0
// Component call: <Pagination />
// Input parameters: no input parameters
// Output: Bilingual component with the current page and buttons for incrementing and decrementing page
// *********************

"use client";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { useLanguage } from "@/context/LanguageContext";
import React from "react";
import { motion } from "framer-motion";

const Pagination = () => {
  // Getting from Zustand store current page and methods for incrementing and decrementing current page
  const { page, incrementPage, decrementPage } = usePaginationStore();
  const { language } = useLanguage();

  // Translations object
  const translations = {
    page: {
      en: "Page",
      sw: "Ukurasa"
    },
    previous: {
      en: "Previous",
      sw: "Iliyotangulia"
    },
    next: {
      en: "Next",
      sw: "Ifuatayo"
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 } 
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="inline-flex items-center rounded-lg shadow-sm bg-white border border-neutral-200 overflow-hidden">
        <button
          className="px-4 py-2 md:px-5 md:py-3 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 
                    border-r border-neutral-200 transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-primary-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => decrementPage()}
          disabled={page <= 1}
          aria-label={translations.previous[language]}
        >
          <span className="sr-only md:not-sr-only md:inline-block md:mr-1">
            {translations.previous[language]}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="px-4 py-2 md:px-6 md:py-3 bg-primary-50 border-r border-neutral-200">
          <div className="flex items-center">
            <span className="text-neutral-600 mr-1">
              {translations.page[language]}
            </span>
            <span className="font-medium text-primary-700">{page}</span>
          </div>
        </div>
        
        <button
          className="px-4 py-2 md:px-5 md:py-3 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 
                    focus:ring-offset-1"
          onClick={() => incrementPage()}
          aria-label={translations.next[language]}
        >
          <span className="sr-only md:not-sr-only md:inline-block md:mr-1">
            {translations.next[language]}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Pagination;