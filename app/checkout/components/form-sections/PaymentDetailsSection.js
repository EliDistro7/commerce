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