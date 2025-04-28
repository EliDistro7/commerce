"use client";
import { motion } from "framer-motion";
import SearchInput from "./SearchInput";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const Hero = () => {
  const { language } = useLanguage();

  // Bilingual content
  const translations = {
    heading: {
      en: "Taste Kechita's Authentic taste",
      sw: "Onja ladha ya kweli kutoka Kechita Foods",
    },
    subheading: {
      en: "In Every Bite",
      sw: "Kwa Kila Bite",
    },
    description: {
      en: "Discover the rich flavors of East Africa with handcrafted recipes, fresh local ingredients, and unforgettable dining experiences.",
      sw: "Gundua ladha nzuri za Afrika Mashariki kwa mapishi ya kiganjani, viungo vya kienyeji, na uzoefu wa kula usahaulifu.",
    },
    tags: {
      en: ["Grilled Meat", "Ugali Special", "Zanzibar Mix", "Fresh Catch"],
      sw: ["Nyama Choma", "Ugali Maalum", "Mchanganyiko wa Zanzibar", "Samaki Mpya"],
    },
    buttons: {
      explore: {
        en: "Explore Menu",
        sw: "Angalia Menyu",
      },
      story: {
        en: "Watch Story",
        sw: "Tazama Hadithi",
      },
    },
    searchPlaceholder: {
      en: "Search dishes...",
      sw: "Tafuta vyakula...",
    },
  };

  return (
    <section 
      className="relative h-[70vh] md:h-[90vh] bg-neutral-900 overflow-hidden"
      aria-label={language === 'sw' ? "Sehemu kuu ya picha" : "Main hero section"}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/80 to-transparent" />
        <img
          src="/ugali-samaki.webp"
          alt={language === 'sw' ? "Chakula cha kitamaduni cha Tanzania" : "Traditional Tanzanian cuisine"}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl lg:max-w-4xl space-y-4 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-6xl font-display text-white leading-snug md:leading-tight">
              {translations.heading[language]}
              <span className="block text-primary-200 mt-1 md:mt-2 text-xl md:text-4xl">
                {translations.subheading[language]}
              </span>
            </h1>
            
            <p className="mt-3 md:mt-4 text-base md:text-xl text-neutral-100 font-sans max-w-2xl">
              {translations.description[language]}
            </p>
          </motion.div>

          {/* Search Input */}
         

          {/* Featured Tags */}
          <div className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-6">
            {translations.tags[language].map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full 
                         text-neutral-100 text-xs md:text-sm hover:bg-white/20 transition-all cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href='/shop' className="bg-secondary-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl 
                             hover:bg-secondary-600 transition-colors font-medium flex items-center justify-center gap-2">
              {translations.buttons.explore[language]}
              <span className="text-lg">→</span>
            </Link>
         
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
          </section>
  );
};

export default Hero;