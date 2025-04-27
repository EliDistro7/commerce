 // src/components/checkout/useCheckoutForm.js
 import { useState } from 'react';
  
 export const useCheckoutForm = ({ cartItems, total, isAdmin = false }) => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState(null);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   
   const [formData, setFormData] = useState({
     name: '',
     lastname: '',
     phone: '',
     email: '',
     company: '',
     address: '',
     apartment: '',
     city: 'Dar es Salaam',
     country: 'Tanzania',
     postalCode: '',
     orderNotice: '',
     status: 'pending',
     total: total || 0,
     isAdmin: isAdmin,
     latitude: -6.7924, // Default Dar es Salaam coordinates
     longitude: 39.2083
   });
 
   const handleInputChange = (field, value) => {
     setFormData(prev => ({
       ...prev,
       [field]: value
     }));
   };
 
   const handleLocationSelected = ({ lat, lng, address }) => {
     setFormData(prev => ({
       ...prev,
       latitude: lat,
       longitude: lng,
       address: address || prev.address
     }));
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);
     setSubmitError(null);
 
     try {
       // First create the customer order
       const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/orders`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           name: formData.name,
           lastname: formData.lastname,
           phone: formData.phone,
           email: formData.email,
           company: formData.company || '',
           adress: formData.address, // Note: Backend uses "adress" (with one 'd')
           apartment: formData.apartment || '',
           postalCode: formData.postalCode || '',
           status: formData.status,
           city: formData.city,
           country: formData.country,
           orderNotice: formData.orderNotice || '',
           total: formData.total,
           latitude: formData.latitude,
           longitude: formData.longitude
         }),
       });
 
       if (!response.ok) {
         throw new Error('Failed to create order');
       }
 
       const orderData = await response.json();
       
       // Then create the order products
       if (cartItems && cartItems.length > 0) {
         for (const item of cartItems) {
           await fetch(`${process.env.NEXT_PUBLIC_SERVER}/order-products`, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               customerOrderId: orderData.id,
               productId: item.id,
               quantity: item.quantity
             }),
           });
         }
       }
 
       setSubmitSuccess(true);
       // Reset form or redirect as needed
       if (!isAdmin) {
         // Clear cart in local storage or context
         localStorage.removeItem('cart');
         // You could redirect to a thank you page here
       }
     } catch (error) {
       console.error('Error submitting order:', error);
       setSubmitError(error.message || 'Failed to submit order. Please try again.');
     } finally {
       setIsSubmitting(false);
     }
   };
 
   return {
     formData,
     isSubmitting,
     submitError,
     submitSuccess,
     handleInputChange,
     handleLocationSelected,
     handleSubmit
   };
 };