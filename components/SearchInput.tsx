"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();
  const { language } = useLanguage();

  // Translation object
  const translations = {
    searchButton: {
      en: "Search",
      sw: "Tafuta"
    },
    ariaLabel: {
      en: "Submit search",
      sw: "Wasilisha utafutaji"
    }
  };

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?search=${searchInput}`);
    setSearchInput("");
  };

  return (
    <form 
      onSubmit={searchProducts}
      className="flex items-center w-full max-w-2xl relative group"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={placeholder || (language === 'sw' ? "Tafuta vyakula vya Tanzania..." : "Search Tanzanian dishes...")}
          className="w-full pl-12 pr-6 py-3 text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl transition-all 
                   focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50
                   hover:border-neutral-300 placeholder:text-neutral-400"
          id="search-input"
          aria-label={language === 'sw' ? "Tafuta vyakula" : "Search for dishes"}
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-neutral-500" />
      </div>
      
      <button
        type="submit"
        className="ml-3 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 
                 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 
                 focus:ring-offset-2 flex items-center gap-2"
        aria-label={translations.ariaLabel[language]}
      >
        <span className="hidden sm:inline">{translations.searchButton[language]}</span>
        <FaSearch className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchInput;