// File: src/app/checkout/components/OrderSummary.js
import Image from "next/image";
import { useProductStore } from "../../_zustand/store";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

// Translations object
const translations = {
  en: {
    orderSummary: "Order Summary",
    quantity: "x",
    subtotal: "Subtotal",
    shipping: "Shipping",
    taxes: "Taxes",
    total: "Total",
    emptyCart: "Your cart is empty",
    estimatedTotal: "Estimated Total"
  },
  sw: {
    orderSummary: "Muhtasari wa Oda",
    quantity: "x",
    subtotal: "Jumla ndogo",
    shipping: "Usafirishaji",
    taxes: "Kodi",
    total: "Jumla",
    emptyCart: "Kikapu chako ni tupu",
    estimatedTotal: "Jumla Inayokadiriwa"
  }
};

export const OrderSummary = ({ products }) => {
  const { total } = useProductStore();
  
  // Get language from context
  const { language } = useLanguage();
  
  // Get translations based on current language
  const t = translations[language] || translations.en;
  
  // Calculate values
  const shipping = 0;
  const taxes = total / 5;
  const finalTotal = total === 0 ? 0 : (total + shipping);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="summary-heading"
      className="bg-white rounded-xl shadow-md px-6 pb-8 pt-6 sm:px-8 lg:col-start-2 lg:row-start-1 border border-gray-100"
    >
      <div className="mx-auto max-w-lg lg:max-w-none">
        <h2
          id="summary-heading"
          className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6"
        >
          {t.orderSummary}
        </h2>

        {products.length > 0 ? (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            role="list"
            className="divide-y divide-gray-200 text-sm font-medium text-gray-900 mb-6"
          >
            {products.map((product) => (
              <motion.li
                variants={itemVariants}
                key={product?.id}
                className="flex items-start space-x-4 py-4 group hover:bg-gray-50 rounded-lg px-3 transition-colors duration-200"
              >
                <div className="relative h-24 w-24 flex-none overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
                  <Image
                    src={product?.image ? `/${product?.image}` : "/product_placeholder.jpg"}
                    alt={product?.title}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-auto flex-col space-y-1 py-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-150">{product?.title}</h3>
                  <p className="text-gray-500">{t.quantity}{product?.amount}</p>
                </div>
                <p className="flex-none text-base font-medium text-gray-900 py-2">
                  TZS {product?.price.toFixed(2)}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <p className="mt-4 text-lg font-medium">{t.emptyCart}</p>
          </div>
        )}

        <div className="space-y-4 border-t border-gray-200 pt-6 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600 font-medium">{t.subtotal}</dt>
            <dd className="text-gray-900 font-semibold">TZS {total.toFixed(2)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600 font-medium">{t.shipping}</dt>
            <dd className="text-gray-900 font-semibold">TZS {shipping.toFixed(2)}</dd>
          </div>

         

          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-2">
            <dt className="text-lg font-bold">{t.estimatedTotal}</dt>
            <dd className="text-xl font-bold text-primary-600">
              TZS {finalTotal.toFixed(2)}
            </dd>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderSummary;