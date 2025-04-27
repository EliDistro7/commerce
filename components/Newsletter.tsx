// *********************
// Role of the component: Signup to the newsletter component by leaving email address
// Name of the component: Newsletter.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced version)
// Version: 2.0
// Component call: <Newsletter />
// Input parameters: no input parameters
// Output: Section with the email input and bilingual text
// *********************


'use client';
import React, { useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { IoMailOutline } from "react-icons/io5";

const Newsletter = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Translations object
  const translations = {
    title: {
      en: "Want product news and updates?",
      sw: "Unataka habari na masasisho ya bidhaa?"
    },
    subtitle: {
      en: "Sign up for our newsletter.",
      sw: "Jiandikishe kwa jarida letu."
    },
    emailPlaceholder: {
      en: "Enter your email",
      sw: "Ingiza barua pepe yako"
    },
    subscribe: {
      en: "Subscribe",
      sw: "Jiandikishe"
    },
    privacyNotice: {
      en: "We care about your data. Read our",
      sw: "Tunajali data yako. Soma"
    },
    privacyPolicy: {
      en: "privacy policy",
      sw: "sera ya faragha"
    },
    thankYou: {
      en: "Thank you for subscribing!",
      sw: "Asante kwa kujisajili!"
    },
    emailLabel: {
      en: "Email address",
      sw: "Anwani ya barua pepe"
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically handle the actual submission
      setIsSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-neutral-50 py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <motion.div 
        className="relative z-10 mx-auto max-w-screen-xl px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto grid justify-items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="max-w-xl lg:col-span-7 text-center lg:text-left"
            variants={itemVariants}
          >
            <div className="inline-flex items-center justify-center lg:justify-start mb-4">
              <div className="h-10 w-1.5 bg-primary-500 rounded-full mr-3 hidden sm:block"></div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-800 max-w-lg">
                {translations.title[language]}
              </h2>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-medium text-neutral-600">
              {translations.subtitle[language]}
            </p>
          </motion.div>
          
          <motion.div 
            className="w-full max-w-md lg:col-span-5 lg:pt-2"
            variants={itemVariants}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative shadow-lg rounded-lg overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoMailOutline className="h-5 w-5 text-neutral-500" />
                  </div>
                  <label htmlFor="email-address" className="sr-only">
                    {translations.emailLabel[language]}
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-20 py-4 border-0 text-neutral-900 
                            placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                            bg-white rounded-lg sm:text-sm"
                    placeholder={translations.emailPlaceholder[language]}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 mr-1 my-1 border border-transparent
                                rounded-md bg-primary-500 text-white hover:bg-primary-600 
                                transition-colors duration-200 focus:outline-none focus:ring-2 
                                focus:ring-primary-400 focus:ring-offset-1 shadow-sm font-medium"
                    >
                      {translations.subscribe[language]}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 text-center lg:text-left">
                  {translations.privacyNotice[language]}{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-800 underline transition-colors">
                    {translations.privacyPolicy[language]}
                  </a>.
                </p>
              </form>
            ) : (
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg border border-primary-100 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">
                  {translations.thankYou[language]}
                </h3>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;