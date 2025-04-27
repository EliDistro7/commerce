"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  path: string;
  titleSw?: string;  // Optional Swahili title
  pathSw?: string;   // Optional Swahili path
}

const SectionTitle = ({ title, path, titleSw, pathSw }: SectionTitleProps) => {
  const { language } = useLanguage();
  
  // If Swahili translations are provided, use them; otherwise, fall back to the provided title/path
  const displayTitle = language === 'sw' && titleSw ? titleSw : title;
  const displayPath = language === 'sw' && pathSw ? pathSw : path;
  
  return (
    <div className='relative h-[250px] border-b border-accent-mint bg-primary-500 mb-8 overflow-hidden max-sm:h-[200px]'>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-0 w-24 h-24 rounded-full bg-primary-400/20 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-12 w-48 h-48 rounded-full bg-primary-600/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary-500/20"></div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <motion.h1 
          className='font-display text-6xl text-center mb-4 text-white max-md:text-5xl max-sm:text-4xl'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayTitle}
        </motion.h1>
        
        <motion.div
          className="h-1 bg-accent-mint w-16 rounded-full mx-auto mb-4"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        
        <motion.p 
          className='font-sans text-lg text-center text-accent-ivory max-sm:text-base'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {displayPath}
        </motion.p>
      </div>
      
      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary-600 to-transparent"></div>
    </div>
  );
};

export default SectionTitle;