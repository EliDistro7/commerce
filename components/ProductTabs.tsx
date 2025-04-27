"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingPercentElement from "./RatingPercentElement";
import SingleReview from "./SingleReview";
import { formatCategoryName } from "@/utils/categoryFormating";
import { useLanguage } from "@/context/LanguageContext";

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);
  const { language } = useLanguage();

  // Translations
  const translations = {
    tabs: {
      description: {
        en: "Description",
        sw: "Maelezo"
      },
      additionalInfo: {
        en: "Additional Info", 
        sw: "Maelezo Zaidi"
      }
    },
    info: {
      manufacturer: {
        en: "Manufacturer",
        sw: "Mtengenezaji"
      },
      category: {
        en: "Category",
        sw: "Kategoria"
      },
      color: {
        en: "Color",
        sw: "Rangi"
      },
      noCategory: {
        en: "No category",
        sw: "Hakuna kategoria"
      }
    }
  };

  // Tab variants for animations
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-neutral-200">
        {[
          { id: 0, label: translations.tabs.description[language] },
          { id: 1, label: translations.tabs.additionalInfo[language] }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentProductTab(tab.id)}
            className={`relative px-6 py-4 text-lg font-medium transition-all duration-200 hover:bg-neutral-50 
              ${currentProductTab === tab.id 
                ? "text-primary-600" 
                : "text-neutral-600"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2`}
          >
            {tab.label}
            {currentProductTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {currentProductTab === 0 && (
            <motion.div
              key="description"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="prose prose-lg max-w-none"
            >
              <p className="text-lg text-neutral-700 leading-relaxed">
                {product?.description}
              </p>
            </motion.div>
          )}

          {currentProductTab === 1 && (
            <motion.div
              key="additionalInfo"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="overflow-hidden rounded-lg border border-neutral-200">
                <table className="min-w-full divide-y divide-neutral-200">
                  <tbody className="divide-y divide-neutral-200">
                    {/* Manufacturer row */}
                    <tr className="hover:bg-neutral-50 transition-colors">
                      <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500 w-1/3">
                        {translations.info.manufacturer[language]}:
                      </th>
                      <td className="px-6 py-4 text-sm text-neutral-800 font-medium">
                        {product?.manufacturer}
                      </td>
                    </tr>
                    {/* Category row */}
                    <tr className="hover:bg-neutral-50 transition-colors">
                      <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500 w-1/3">
                        {translations.info.category[language]}:
                      </th>
                      <td className="px-6 py-4 text-sm text-neutral-800 font-medium">
                        {product?.category?.name
                          ? formatCategoryName(product?.category?.name)
                          : translations.info.noCategory[language]}
                      </td>
                    </tr>
                    {/* Color row */}
                    <tr className="hover:bg-neutral-50 transition-colors">
                      <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500 w-1/3">
                        {translations.info.color[language]}:
                      </th>
                      <td className="px-6 py-4 text-sm text-neutral-800 font-medium">
                        <div className="flex items-center gap-3">
                          <span>Silver, LightSlateGray, Blue</span>
                          <div className="flex gap-1">
                            <span className="inline-block w-4 h-4 rounded-full bg-gray-300" title="Silver"></span>
                            <span className="inline-block w-4 h-4 rounded-full bg-slate-400" title="LightSlateGray"></span>
                            <span className="inline-block w-4 h-4 rounded-full bg-blue-500" title="Blue"></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductTabs;