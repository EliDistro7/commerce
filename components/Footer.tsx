"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const { language } = useLanguage();

  // Translation object
  const translations = {
    about: {
      en: "Kechita Foods - Preserving Tanzania's culinary heritage through authentic flavors and modern presentation.",
      sw: "Kechita Foods - Tunahimili urithi wa upishi wa Tanzania kupitia ladha asili na maonyesho ya kisasa."
    },
    quickLinks: {
      en: "Quick Links",
      sw: "Viungo Vya Haraka"
    },
    contact: {
      en: "Contact Us",
      sw: "Wasiliana Nasi"
    },
    address: {
      en: "Mikocheni B, Dar es Salaam, Tanzania",
      sw: "Mikocheni B, Dar es Salaam, Tanzania"
    },
    rights: {
      en: "All rights reserved",
      sw: "Haki zote zimehifadhiwa"
    },
    menu: {
      en: "Our Menu",
      sw: "Menu Yetu"
    },
    locations: {
      en: "Locations",
      sw: "Mikoa"
    },
    privacy: {
      en: "Privacy Policy",
      sw: "Sera ya Faragha"
    },
    terms: {
      en: "Terms of Service",
      sw: "Sheria za Matumizi"
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-100 border-t-4 border-primary-500">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-primary-300">KECHITA FOODS</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {translations.about[language]}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-lg text-primary-300">
              {translations.quickLinks[language]}
            </h4>
            <nav className="space-y-2">
              <Link href="/shop" className="block text-neutral-300 hover:text-primary-400 transition-colors">
                {translations.menu[language]}
              </Link>
              <Link href="/locations" className="block text-neutral-300 hover:text-primary-400 transition-colors">
                {translations.locations[language]}
              </Link>
              <Link href="/privacy" className="block text-neutral-300 hover:text-primary-400 transition-colors">
                {translations.privacy[language]}
              </Link>
              <Link href="/terms" className="block text-neutral-300 hover:text-primary-400 transition-colors">
                {translations.terms[language]}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-lg text-primary-300">
              {translations.contact[language]}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-300">
                <FaMapMarkerAlt className="flex-shrink-0" />
                <span>{translations.address[language]}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <FaPhone className="flex-shrink-0" />
                <a href="tel:+255123456789" className="hover:text-primary-400 transition-colors">
                  +255 123 456 789
                </a>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <FaEnvelope className="flex-shrink-0" />
                <a href="mailto:info@kechitafoods.com" className="hover:text-primary-400 transition-colors">
                  info@kechitafoods.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-lg text-primary-300">
              {language === 'en' ? 'Follow Us' : 'Tufuate'}
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Kechita Foods. {translations.rights[language]}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;