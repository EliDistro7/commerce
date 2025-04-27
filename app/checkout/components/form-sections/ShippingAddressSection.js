// File: src/app/checkout/components/form-sections/ShippingAddressSection.js
export const ShippingAddressSection = ({ formData, onChange }) => {
    return (
      <section aria-labelledby="shipping-heading" className="mt-10">
        <h2
          id="shipping-heading"
          className="text-lg font-medium text-gray-900"
        >
          Delivery address
        </h2>
  
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company (optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="company"
                name="company"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.company || ''}
                onChange={(e) => onChange('company', e.target.value)}
              />
            </div>
          </div>
  
          <div className="sm:col-span-3">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="address"
                name="address"
                autoComplete="street-address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.address || ''}
                onChange={(e) => onChange('address', e.target.value)}
                required
              />
            </div>
          </div>
  
          <div className="sm:col-span-3">
            <label
              htmlFor="apartment"
              className="block text-sm font-medium text-gray-700"
            >
              Apartment, suite, etc. (optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="apartment"
                name="apartment"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.apartment || ''}
                onChange={(e) => onChange('apartment', e.target.value)}
              />
            </div>
          </div>
  
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.city || 'Dar es Salaam'}
                onChange={(e) => onChange('city', e.target.value)}
                required
              />
            </div>
          </div>
  
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="region"
                name="region"
                autoComplete="address-level1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.country || 'Tanzania'}
                onChange={(e) => onChange('country', e.target.value)}
                required
              />
            </div>
          </div>
  
          <div>
            <label
              htmlFor="postal-code"
              className="block text-sm font-medium text-gray-700"
            >
              Postal code (optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="postal-code"
                name="postal-code"
                autoComplete="postal-code"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.postalCode || ''}
                onChange={(e) => onChange('postalCode', e.target.value)}
              />
            </div>
          </div>
  
          <div className="sm:col-span-3">
            <label
              htmlFor="order-notice"
              className="block text-sm font-medium text-gray-700"
            >
              Order notice (optional)
            </label>
            <div className="mt-1">
              <textarea
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                id="order-notice"
                name="order-notice"
                autoComplete="order-notice"
                value={formData.orderNotice || ''}
                onChange={(e) => onChange('orderNotice', e.target.value)}
                rows="4"
                placeholder="Any special instructions for delivery or food preparation..."
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    );
  };