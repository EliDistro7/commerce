// ProductsSection.tsx
'use client';

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useLanguage } from "@/context/LanguageContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const ProductsSection = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { language } = useLanguage();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const translations = {
    noProducts: {
      en: "No products found or failed to load.",
      sw: "Hakuna bidhaa zilizopatikana au kushindwa kupakua."
    },
    loading: {
      en: "Loading premium products...",
      sw: "Inapakia bidhaa bora..."
    }
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-50 to-transparent opacity-60" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-100 opacity-20" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-primary-50 opacity-30" />
      
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Heading
            title={language === 'sw' ? "Bidhaa Zetu" : "Featured Products"}
            subtitle={language === 'sw' ? "Pata Vyakula Bora" : "Discover Premium Quality"}
            align="center"
          />
        </motion.div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin mb-4" />
            <p className="text-neutral-600 font-medium">
              {translations.loading[language]}
            </p>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Desktop display - Grid */}
            <motion.div 
              className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {products.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </motion.div>
            
            {/* Mobile display - Swiper */}
            <div className="lg:hidden mt-12">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1.2}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2.2,
                  }
                }}
                className="pb-12"
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductItem product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : (
          <motion.div 
            className="col-span-full text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-soft inline-block">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M8 16l-4-4 4-4" />
                </svg>
              </div>
              <p className="text-neutral-600 text-lg font-medium">
                {translations.noProducts[language]}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;