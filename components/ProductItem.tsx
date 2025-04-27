'use client';

// ProductItem.tsx
import Image from "next/image";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const ProductItem = ({ product }: { product: Product }) => {
  const { language } = useLanguage();

  const translations = {
    viewProduct: {
      en: "View Product",
      sw: "Angalia Bidhaa"
    },
    currency: {
      en: "TZS",
      sw: "TSh"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100"
    >
      <Link 
        href={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <Image
            src={`/${product.mainImage}` || "/product_placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 to-transparent" />
        
        {/* Sale badge - If you have a sale property, you can uncomment this */}
        {/* {product.onSale && (
          <div className="absolute top-4 right-4 bg-error-500 text-white text-sm font-bold py-1 px-3 rounded-full z-10">
            Sale
          </div>
        )} */}
      </Link>

      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="font-sans text-lg font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          <ProductItemRating productRating={product.rating} />
          <p className="text-2xl font-bold text-primary-600 flex items-center gap-1">
            <span className="text-sm font-medium text-neutral-500">
              {translations.currency[language]}
            </span>
            {product.price.toLocaleString()}
          </p>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-300 group-hover:shadow-lg transform group-hover:-translate-y-1"
        >
          <span>{translations.viewProduct[language]}</span>
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </motion.svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductItem;