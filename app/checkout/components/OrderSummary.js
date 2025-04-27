// File: src/app/checkout/components/OrderSummary.js
import Image from "next/image";
import { useProductStore } from "../../_zustand/store";
import { useLanguage } from "@/context/LanguageContext";

// Translations object
const translations = {
  en: {
    orderSummary: "Order Summary",
    quantity: "x",
    subtotal: "Subtotal",
    shipping: "Shipping",
    taxes: "Taxes",
    total: "Total"
  },
  sw: {
    orderSummary: "Muhtasari wa Oda",
    quantity: "x",
    subtotal: "Jumla ndogo",
    shipping: "Usafirishaji",
    taxes: "Kodi",
    total: "Jumla"
  }
};

export const OrderSummary = ({ products }) => {
  const { total } = useProductStore();
  
  // Get language from context
  const { language } = useLanguage();
  
  // Get translations based on current language
  const t = translations[language] || translations.en;
  
  // Calculate values
  const shipping = 5;
  const taxes = total / 5;
  const finalTotal = total === 0 ? 0 : Math.round(total + taxes + shipping);

  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-gray-50 rounded-lg shadow-sm px-6 pb-8 pt-6 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-white lg:px-8 lg:pb-16"
    >
      <div className="mx-auto max-w-lg lg:max-w-none">
        <h2
          id="summary-heading"
          className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4"
        >
          {t.orderSummary}
        </h2>

        <ul
          role="list"
          className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
        >
          {products.map((product) => (
            <li
              key={product?.id}
              className="flex items-start space-x-4 py-6 group hover:bg-gray-50 rounded-md px-2 transition-colors duration-150"
            >
              <div className="relative h-24 w-24 flex-none overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                <Image
                  src={product?.image ? `/${product?.image}` : "/product_placeholder.jpg"}
                  alt={product?.title}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-auto flex-col space-y-1">
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-150">{product?.title}</h3>
                <p className="text-gray-500">{t.quantity}{product?.amount}</p>
              </div>
              <p className="flex-none text-base font-medium text-gray-900">
                ${product?.price.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-4 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 mt-4">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">{t.subtotal}</dt>
            <dd className="text-gray-900">${total.toFixed(2)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">{t.shipping}</dt>
            <dd className="text-gray-900">${shipping.toFixed(2)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">{t.taxes}</dt>
            <dd className="text-gray-900">${taxes.toFixed(2)}</dd>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-2">
            <dt className="text-lg font-semibold">{t.total}</dt>
            <dd className="text-lg font-semibold text-primary-600">
              ${finalTotal.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};