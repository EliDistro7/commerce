// app/search/SearchPageClient.tsx (Client Component)
"use client";

import { ProductItem, SectionTitle } from "@/components";
import { useLanguage } from "@/context/LanguageContext";



const SearchPageClient = ({ products, search, translations }) => {
  const { language } = useLanguage();
  
  // Get translations based on current language
  const t = translations;

  const replacePlaceholder = (text, searchTerm) => {
    return searchTerm ? text.replace("{{search}}", searchTerm) : text;
  };

  return (
    <div className="bg-accent-ivory/50 min-h-screen pb-12">
      <SectionTitle title={t.searchPage} path={t.homePath} />
      <div className="max-w-screen-2xl mx-auto px-4">
        {search && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl font-heading text-primary-700">
            {t.showingResultsFor} <span className="text-primary-500 font-semibold">"{search}"</span>
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-8 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full col-span-full py-16">
              <div className="bg-secondary-50 p-8 rounded-xl shadow-soft border border-secondary-100 text-center max-w-lg">
                <svg 
                  className="w-16 h-16 mx-auto mb-4 text-secondary-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <h3 className="text-3xl max-[1000px]:text-2xl max-[500px]:text-xl font-heading text-neutral-800 mb-2">
                  {t.noProductsFound}
                </h3>
                <p className="text-neutral-600">
                  {replacePlaceholder(t.tryDifferentSearch, search)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPageClient;