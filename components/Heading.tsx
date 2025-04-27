"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface HeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

const Heading = ({ title, subtitle, align = "left" }: HeadingProps) => {
  const alignmentClass = 
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  
  const showUnderline = align === "center";
  
  return (
    <div className={alignmentClass}>
      <h1 className="text-2xl font-bold">
        {title.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </h1>
      {showUnderline && (
        <motion.div
          className="h-1 bg-blue-500 mx-auto mt-2 mb-4 w-16 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '4rem' }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      )}
      {subtitle && (
        <motion.p
          className="text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default Heading;