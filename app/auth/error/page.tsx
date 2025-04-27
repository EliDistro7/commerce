// app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { language } = useLanguage();
  
  // Bilingual content
  const translations = {
    title: {
      en: "Authentication Error",
      sw: "Hitilafu ya Uthibitishaji"
    },
    errors: {
      default: {
        en: "An authentication error occurred",
        sw: "Hitilafu ya uthibitishaji imetokea"
      },
      CredentialsSignin: {
        en: "Invalid email or password",
        sw: "Barua pepe au nenosiri si sahihi"
      },
      SessionRequired: {
        en: "You must be signed in to access this page",
        sw: "Lazima uwe umeingia ili kufikia ukurasa huu"
      },
      AccessDenied: {
        en: "You do not have permission to access this resource",
        sw: "Huna ruhusa ya kufikia rasilimali hii"
      },
      CallbackRouteError: {
        en: "There was a problem with the authentication callback",
        sw: "Kulikuwa na tatizo na mrejesho wa uthibitishaji"
      }
    },
    returnToSignIn: {
      en: "Return to sign in",
      sw: "Rudi kwenye ukurasa wa kuingia"
    }
  };
  
  // Get the appropriate error message
  let errorType = error || "default";
  // Make sure we have a translation for this error, otherwise use default
  const errorMessage = translations.errors[errorType as keyof typeof translations.errors] || 
                      translations.errors.default;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-ivory min-h-screen flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-soft border border-primary-100"
      >
        <h1 className="text-2xl font-heading font-semibold text-center text-error-600">
          {translations.title[language]}
        </h1>
        
        <div className="p-4 bg-error-50 border border-error-100 rounded-lg">
          <p className="text-center text-error-700">
            {errorMessage[language]}
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link href="/login" 
            className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
            {translations.returnToSignIn[language]}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}