// *********************
// Role of the component: Buy Now button that adds product to the cart and redirects to the checkout page
// Name of the component: BuyNowSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced by Claude)
// Version: 1.1
// Component call: <BuyNowSingleProductBtn product={product} quantityCount={quantityCount} />
// Input parameters: SingleProductBtnProps interface
// Output: Button with buy now functionality and bilingual support
// *********************

"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();
  const { language } = useLanguage();

  // Translations
  const translations = {
    buyNow: {
      en: "Buy Now",
      sw: "Nunua Sasa"
    },
    productAdded: {
      en: "Product added to the cart",
      sw: "Bidhaa imeongezwa kwenye kikapu"
    },
    redirecting: {
      en: "Redirecting to checkout...",
      sw: "Inaelekeza kwenye malipo..."
    }
  };

  const handleBuyNow = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
    });
    calculateTotals();
    
    toast.success(translations.productAdded[language], {
      duration: 2000,
    });
    
    // Show redirecting message with a slight delay
    setTimeout(() => {
      toast.loading(translations.redirecting[language], {
        duration: 1500,
      });
    }, 300);
    
    // Navigate to checkout after a brief delay
    setTimeout(() => {
      router.push("/checkout");
    }, 800);
  };
  
  return (
    <motion.button
      onClick={handleBuyNow}
      className="relative px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-all duration-300 md:min-w-[200px] w-full"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center">
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
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>{translations.buyNow[language]}</span>
      </div>
      
      {/* Animated background effect on hover */}
      <motion.div
        className="absolute inset-0 -z-10 bg-primary-600 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default BuyNowSingleProductBtn;