// File: src/app/checkout/services/checkoutFormService.js
import toast from "react-hot-toast";
import { 
  isValidNameOrLastname, 
  isValidEmailAddressFormat, 
  isValidCardNumber, 
  isValidCreditCardExpirationDate, 
  isValidCreditCardCVVOrCVC 
} from "@/lib/utils";

export const checkoutFormService = {
  /**
   * Validates and processes the checkout form
   * @param {Object} formData - The checkout form data
   * @param {Array} products - Products in the cart
   * @param {number} total - Total price of products
   * @returns {Promise<{success: boolean}>} - Result of the operation
   */
  makePurchase: async (formData, products, total) => {
    // Check if all required fields are filled
    if (!checkoutFormService.areAllFieldsFilled(formData)) {
      toast.error("You need to enter values in the input fields");
      return { success: false };
    }

    // Validate all fields
    if (!checkoutFormService.validateAllFields(formData)) {
      return { success: false };
    }

    // Process the order
    try {
      const orderId = await checkoutFormService.processOrder(formData, total);
      
      // Process order products
      for (let i = 0; i < products.length; i++) {
        await checkoutFormService.addOrderProduct(
          orderId, 
          products[i].id, 
          products[i].amount
        );
      }
      
      return { success: true };
    } catch (error) {
      toast.error("Failed to process your order. Please try again.");
      console.error("Order processing error:", error);
      return { success: false };
    }
  },

  /**
   * Checks if all required fields are filled
   * @param {Object} formData - The form data to check
   * @returns {boolean} - Whether all fields are filled
   */
  areAllFieldsFilled: (formData) => {
    return (
      formData.name.length > 0 &&
      formData.lastname.length > 0 &&
      formData.phone.length > 0 &&
      formData.email.length > 0 &&
      formData.cardName.length > 0 &&
      formData.cardNumber.length > 0 &&
      formData.expirationDate.length > 0 &&
      formData.cvc.length > 0 &&
      formData.company.length > 0 &&
      formData.adress.length > 0 &&
      formData.apartment.length > 0 &&
      formData.city.length > 0 &&
      formData.country.length > 0 &&
      formData.postalCode.length > 0
    );
  },

  /**
   * Validates all form fields
   * @param {Object} formData - The form data to validate
   * @returns {boolean} - Whether all fields are valid
   */
  validateAllFields: (formData) => {
    if (!isValidNameOrLastname(formData.name)) {
      toast.error("You entered invalid format for name");
      return false;
    }

    if (!isValidNameOrLastname(formData.lastname)) {
      toast.error("You entered invalid format for lastname");
      return false;
    }

    if (!isValidEmailAddressFormat(formData.email)) {
      toast.error("You entered invalid format for email address");
      return false;
    }

    if (!isValidNameOrLastname(formData.cardName)) {
      toast.error("You entered invalid format for card name");
      return false;
    }

    if (!isValidCardNumber(formData.cardNumber)) {
      toast.error("You entered invalid format for credit card number");
      return false;
    }

    if (!isValidCreditCardExpirationDate(formData.expirationDate)) {
      toast.error("You entered invalid format for credit card expiration date");
      return false;
    }

    if (!isValidCreditCardCVVOrCVC(formData.cvc)) {
      toast.error("You entered invalid format for credit card CVC or CVV");
      return false;
    }

    return true;
  },

  /**
   * Processes the order
   * @param {Object} formData - The checkout form data
   * @param {number} total - Total price of products
   * @returns {Promise<string>} - ID of the created order
   */
  processOrder: async (formData, total) => {
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        lastname: formData.lastname,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        adress: formData.adress,
        apartment: formData.apartment,
        postalCode: formData.postalCode,
        status: "processing",
        total: total,
        city: formData.city,
        country: formData.country,
        orderNotice: formData.orderNotice,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data.id;
  },

  /**
   * Adds order product relationship
   * @param {string} orderId - ID of the order
   * @param {string} productId - ID of the product
   * @param {number} productQuantity - Quantity of the product
   * @returns {Promise<void>}
   */
  addOrderProduct: async (orderId, productId, productQuantity) => {
    const response = await fetch("http://localhost:3000/api/order-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add product to order');
    }
  }
};