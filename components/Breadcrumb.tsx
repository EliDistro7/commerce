'use client';

// *********************
// Role of the component: Component that displays current page location in the application 
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced by [Your Name])
// Version: 2.0
// Component call: <Breadcrumb />
// Input parameters: No input parameters
// Output: Page location in the application with bilingual support
// *********************

import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

const Breadcrumb = () => {
  const { language } = useLanguage();

  // Translations object
  const translations = {
    home: {
      en: "Home",
      sw: "Nyumbani"
    },
    shop: {
      en: "Shop",
      sw: "Duka"
    },
    allProducts: {
      en: "All products",
      sw: "Bidhaa Zote"
    }
  };

  return (
    <div className="py-5 pb-6 overflow-x-auto">
      <nav aria-label="breadcrumb">
        <ol className="flex items-center flex-wrap text-sm md:text-base text-neutral-600">
          <li className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center text-primary-600 hover:text-primary-800 transition-colors"
            >
              <FaHouse className="mr-1.5 text-primary-500" />
              <span>{translations.home[language]}</span>
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
          </li>
          
          <li className="flex items-center">
            <Link 
              href="/shop" 
              className="text-primary-600 hover:text-primary-800 transition-colors"
            >
              {translations.shop[language]}
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
          </li>
          
          <li>
            <span className="font-medium text-neutral-800">
              {translations.allProducts[language]}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;