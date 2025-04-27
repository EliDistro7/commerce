// File: src/app/checkout/components/form-sections/index.js
// File: src/app/checkout/components/form-sections/index.js
import { useLanguage } from '@/context/LanguageContext'; // Adjust path as needed


export * from './ShippingAddressSection';
export * from './OrderStatusSection';
export * from './PaymentDetailsSection';

// File: src/app/checkout/components/form-sections/ContactInfoSection.js

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
    <section aria-labelledby="contact-info-heading" className="bg-white rounded-lg shadow-soft p-4 md:p-6">
      <h2
        id="contact-info-heading"
        className="text-lg md:text-xl font-heading font-medium text-primary-500"
      >
        {text.title}
      </h2>

      <div className="mt-4 md:mt-6">
        <label
          htmlFor="name-input"
          className="block text-sm font-medium text-neutral-700"
        >
          {text.name}
        </label>
        <div className="mt-1">
          <input
            value={formData?.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            type="text"
            id="name-input"
            name="name-input"
            autoComplete="text"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        <label
          htmlFor="lastname-input"
          className="block text-sm font-medium text-neutral-700"
        >
          {text.lastname}
        </label>
        <div className="mt-1">
          <input
            value={formData?.lastname || ''}
            onChange={(e) => onChange('lastname', e.target.value)}
            type="text"
            id="lastname-input"
            name="lastname-input"
            autoComplete="text"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        <label
          htmlFor="phone-input"
          className="block text-sm font-medium text-neutral-700"
        >
          {text.phone}
        </label>
        <div className="mt-1">
          <input
            value={formData?.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            type="tel"
            id="phone-input"
            name="phone-input"
            autoComplete="tel"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        <label
          htmlFor="email-address"
          className="block text-sm font-medium text-neutral-700"
        >
          {text.email}
        </label>
        <div className="mt-1">
          <input
            value={formData?.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            type="email"
            id="email-address"
            name="email-address"
            autoComplete="email"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>
    </section>
  );
};

// File: src/app/checkout/components/form-sections/PaymentDetailsSection.js
export const PaymentDetailsSection = ({ formData, onChange }) => {
  return (
    <section aria-labelledby="payment-heading" className="mt-10">
      <h2
        id="payment-heading"
        className="text-lg font-medium text-gray-900"
      >
        Payment details
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
        <div className="col-span-3 sm:col-span-4">
          <label
            htmlFor="name-on-card"
            className="block text-sm font-medium text-gray-700"
          >
            Name on card
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name-on-card"
              name="name-on-card"
              autoComplete="cc-name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.cardName}
              onChange={(e) => onChange('cardName', e.target.value)}
            />
          </div>
        </div>

        <div className="col-span-3 sm:col-span-4">
          <label
            htmlFor="card-number"
            className="block text-sm font-medium text-gray-700"
          >
            Card number
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="card-number"
              name="card-number"
              autoComplete="cc-number"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.cardNumber}
              onChange={(e) => onChange('cardNumber', e.target.value)}
            />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <label
            htmlFor="expiration-date"
            className="block text-sm font-medium text-gray-700"
          >
            Expiration date (MM/YY)
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="expiration-date"
              id="expiration-date"
              autoComplete="cc-exp"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.expirationDate}
              onChange={(e) => onChange('expirationDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="cvc"
            className="block text-sm font-medium text-gray-700"
          >
            CVC or CVV
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="cvc"
              id="cvc"
              autoComplete="csc"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.cvc}
              onChange={(e) => onChange('cvc', e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// File: src/app/checkout/components/form-sections/ShippingAddressSection.js
export const ShippingAddressSection = ({ formData, onChange }) => {
  const { language } = useLanguage();
  
  const content = {
    english: {
      title: "Shipping address",
      company: "Company",
      address: "Address",
      apartment: "Apartment, suite, etc.",
      city: "City",
      country: "Country",
      postalCode: "Postal code",
      orderNotice: "Order notice"
    },
    swahili: {
      title: "Anwani ya usafirishaji",
      company: "Kampuni",
      address: "Anwani",
      apartment: "Ghorofa, suite, n.k.",
      city: "Mji",
      country: "Nchi",
      postalCode: "Msimbo wa posta",
      orderNotice: "Taarifa ya agizo"
    }
  };

  const text = content[language] || content.english;

  return (
    <section aria-labelledby="shipping-heading" className="mt-8 md:mt-10 bg-white rounded-lg shadow-soft p-4 md:p-6">
      <h2
        id="shipping-heading"
        className="text-lg md:text-xl font-heading font-medium text-primary-500"
      >
        {text.title}
      </h2>

      <div className="mt-4 md:mt-6 grid grid-cols-1 gap-x-4 gap-y-4 md:gap-y-6 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.company}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="company"
              name="company"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={formData?.company || ''}
              onChange={(e) => onChange('company', e.target.value)}
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.address}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="address"
              name="address"
              autoComplete="street-address"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={formData?.adress || ''}
              onChange={(e) => onChange('adress', e.target.value)}
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="apartment"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.apartment}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="apartment"
              name="apartment"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={formData?.apartment || ''}
              onChange={(e) => onChange('apartment', e.target.value)}
            />
          </div>
        </div>

        <div className="col-span-1">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.city}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="city"
              name="city"
              autoComplete="address-level2"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={formData?.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
            />
          </div>
        </div>

        <div className="col-span-1">
          <label
            htmlFor="region"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.country}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="region"
              name="region"
              autoComplete="address-level1"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={formData?.country || ''}
              onChange={(e) => onChange('country', e.target.value)}
            />
          </div>
        </div>

        <div className="col-span-1">
          <label
            htmlFor="postal-code"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.postalCode}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="postal-code"
              name="postal-code"
              autoComplete="postal-code"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={formData?.postalCode || ''}
              onChange={(e) => onChange('postalCode', e.target.value)}
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="order-notice"
            className="block text-sm font-medium text-neutral-700"
          >
            {text.orderNotice}
          </label>
          <div className="mt-1">
            <textarea
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm min-h-32"
              id="order-notice"
              name="order-notice"
              rows="4"
              value={formData?.orderNotice || ''}
              onChange={(e) => onChange('orderNotice', e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </section>
  );
};


// File: src/app/checkout/components/form-sections/OrderStatusSection.js
// File: src/app/checkout/components/form-sections/OrderStatusSection.js

export const OrderStatusSection = ({ formData, onChange }) => {
  const { language } = useLanguage();
  
  const content = {
    english: {
      title: "Order Status",
      status: "Status",
      pendingMessage: "Your order will be set to \"Pending\" until we confirm it."
    },
    swahili: {
      title: "Hali ya Order",
      status: "Hali",
      pendingMessage: "Oda yako litawekwa \"Inasubiri\" hadi tutakapolithibitisha."
    }
  };

  const text = content[language] || content.english;

  const orderStatuses = language === 'swahili' ? [
    { value: "pending", label: "Inasubiri" },
    { value: "confirmed", label: "Imethibitishwa" },
    { value: "processing", label: "Inachakatwa" },
    { value: "delivering", label: "Katika Usafirishaji" },
    { value: "delivered", label: "Imepokelewa" },
    { value: "cancelled", label: "Imeghairiwa" }
  ] : [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "delivering", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <section aria-labelledby="order-status-heading" className="mt-8 md:mt-10 bg-white rounded-lg shadow-soft p-4 md:p-6">
      <h2
        id="order-status-heading"
        className="text-lg md:text-xl font-heading font-medium text-primary-500"
      >
        {text.title}
      </h2>

      <div className="mt-4 md:mt-6">
        <label
          htmlFor="order-status"
          className="block text-sm font-medium text-neutral-700"
        >
          {text.status}
        </label>
        <div className="mt-1">
          <select
            id="order-status"
            name="order-status"
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={formData?.status || "pending"}
            onChange={(e) => onChange('status', e.target.value)}
            disabled={!formData?.isAdmin}
          >
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        {!formData?.isAdmin && (
          <p className="mt-2 text-sm text-neutral-500">
            {text.pendingMessage}
          </p>
        )}
      </div>
    </section>
  );
};

