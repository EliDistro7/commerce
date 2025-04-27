// File: src/app/checkout/components/form-sections/ContactInfoSection.js
import { useLanguage } from '@/context/LanguageContext'; // Assuming this hook exists

export const ContactInfoSection = ({ formData, onChange }) => {
  const { language } = useLanguage(); // Destructure the current active language
  
  // Bilingual text content
  const content = {
    english: {
      title: "Contact information",
      name: "Name",
      lastname: "Lastname",
      phone: "Phone number",
      email: "Email address"
    },
    swahili: {
      title: "Maelezo ya mawasiliano",
      name: "Jina",
      lastname: "Jina la ukoo",
      phone: "Namba ya simu",
      email: "Barua pepe"
    }
  };

  // Get text based on current language
  const text = content[language] || content.english;

  return (
    <div className="w-full bg-white rounded-lg shadow-soft p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-heading font-semibold text-primary-500 mb-4">
        {text.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor="name-input" 
            className="block text-sm font-medium text-neutral-800"
          >
            {text.name}
          </label>
          <input
            value={formData?.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            type="text"
            id="name-input"
            name="name-input"
            autoComplete="text"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="lastname-input" 
            className="block text-sm font-medium text-neutral-800"
          >
            {text.lastname}
          </label>
          <input
            value={formData?.lastname || ''}
            onChange={(e) => onChange('lastname', e.target.value)}
            type="text"
            id="lastname-input"
            name="lastname-input"
            autoComplete="text"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="phone-input" 
            className="block text-sm font-medium text-neutral-800"
          >
            {text.phone}
          </label>
          <input
            value={formData?.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            type="tel"
            id="phone-input"
            name="phone-input"
            autoComplete="tel"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="email-address" 
            className="block text-sm font-medium text-neutral-800"
          >
            {text.email}
          </label>
          <input
            value={formData?.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            type="email"
            id="email-address"
            name="email-address"
            autoComplete="email"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required
          />
        </div>
      </div>
    </div>
  );
};