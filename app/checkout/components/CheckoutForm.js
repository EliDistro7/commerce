// src/components/checkout/CheckoutForm.jsx
import { ContactInfoSection, ShippingAddressSection, OrderStatusSection } from './form-sections';
import { LocationMapSection } from './LocationMapSection';
import { StatusAlert } from './StatusAlert';
import { SubmitButton } from './SubmitButton';
import { useCheckoutForm } from './useCheckoutForm';

export const CheckoutForm = ({ cartItems, total, isAdmin = false }) => {
  const {
    formData,
    isSubmitting,
    submitError,
    submitSuccess,
    handleInputChange,
    handleLocationSelected,
    handleSubmit
  } = useCheckoutForm({ cartItems, total, isAdmin });

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="space-y-6 md:space-y-8">
        {/* Form sections with improved responsive layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <ContactInfoSection formData={formData} onChange={handleInputChange} />
          </div>
          <div className="md:col-span-1">
            <ShippingAddressSection formData={formData} onChange={handleInputChange} />
          </div>
        </div>
        
        {/* Leaflet Map Location Selector */}
        <LocationMapSection 
          onLocationSelected={handleLocationSelected}
          initialCoordinates={{ lat: formData.latitude, lng: formData.longitude }}
        />
        
        {isAdmin && <OrderStatusSection formData={formData} onChange={handleInputChange} />}
        
        {submitError && (
          <StatusAlert 
            type="error" 
            message={submitError}
          />
        )}

        {submitSuccess && (
          <StatusAlert 
            type="success" 
            title="Order submitted successfully!" 
            message="Thank you for your order. We will contact you soon to confirm delivery details."
          />
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <SubmitButton isSubmitting={isSubmitting} isAdmin={isAdmin} />
        </div>
      </div>
    </form>
  );
};