// src/components/checkout/CheckoutForm.jsx
"use client";
import { ContactInfoSection, ShippingAddressSection, OrderStatusSection } from './form-sections';
import { LocationMapSection } from './LocationMapSection';
import { StatusAlert } from './StatusAlert';
import { SubmitButton } from './SubmitButton';
import { useCheckoutForm } from './useCheckoutForm';
import { useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

export const CheckoutForm = ({ cartItems, total, isAdmin = false }) => {
  const { language } = useLanguage();
  const {
    formData,
    isSubmitting,
    submitError,
    submitSuccess,
    handleInputChange,
    handleLocationSelected,
    handleSubmit
  } = useCheckoutForm({ cartItems, total, isAdmin });

  // Bilingual content
  const translations = {
    sectionTitles: {
      contactInfo: {
        en: "Contact Information",
        sw: "Maelezo ya Mawasiliano"
      },
      shippingAddress: {
        en: "Shipping Address",
        sw: "Anwani ya Utoaji"
      },
      locationSelection: {
        en: "Select Your Location",
        sw: "Chagua Eneo Lako"
      },
      orderStatus: {
        en: "Order Status",
        sw: "Hali ya Oda"
      }
    },
    alerts: {
      success: {
        title: {
          en: "Order submitted successfully!",
          sw: "Oda imetumwa kwa mafanikio!"
        },
        message: {
          en: "Thank you for your order. We will contact you soon to confirm delivery details.",
          sw: "Asante kwa Oda lako. Tutawasiliana nawe hivi karibuni kuthibitisha maelezo ya kukufikishia."
        }
      }
    },
    buttons: {
      submit: {
        en: "Submit Order",
        sw: "Weka Oda"
      },
      submitting: {
        en: "Processing...",
        sw: "Inashughulikia..."
      },
      update: {
        en: "Update Order",
        sw: "Sasisha Oda"
      },
      updating: {
        en: "Updating...",
        sw: "Inasasisha..."
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="space-y-6 md:space-y-8">
        {/* Form sections with improved responsive layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {translations.sectionTitles.contactInfo[language]}
            </h3>
            <ContactInfoSection formData={formData} onChange={handleInputChange} language={language} />
          </div>
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {translations.sectionTitles.shippingAddress[language]}
            </h3>
            <ShippingAddressSection formData={formData} onChange={handleInputChange} language={language} />
          </div>
        </div>
        
        {/* Leaflet Map Location Selector */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {translations.sectionTitles.locationSelection[language]}
          </h3>
          <LocationMapSection 
            onLocationSelected={handleLocationSelected}
            initialCoordinates={{ lat: formData.latitude, lng: formData.longitude }}
            language={language}
          />
        </div>
        
        {isAdmin && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {translations.sectionTitles.orderStatus[language]}
            </h3>
            <OrderStatusSection formData={formData} onChange={handleInputChange} language={language} />
          </div>
        )}
        
        {submitError && (
          <StatusAlert 
            type="error" 
            message={submitError}
          />
        )}

        {submitSuccess && (
          <StatusAlert 
            type="success" 
            title={translations.alerts.success.title[language]} 
            message={translations.alerts.success.message[language]}
          />
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium
              ${isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'}
              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {isAdmin ? translations.buttons.updating[language] : translations.buttons.submitting[language]}
                </span>
              </>
            ) : (
              <span>
                {isAdmin ? translations.buttons.update[language] : translations.buttons.submit[language]}
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};