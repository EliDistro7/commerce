// File: src/app/checkout/components/form-sections/OrderStatusSection.js
export const OrderStatusSection = ({ formData, onChange }) => {
    const orderStatuses = [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "processing", label: "Processing" },
      { value: "delivering", label: "Out for Delivery" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" }
    ];
  
    return (
      <section aria-labelledby="order-status-heading" className="mt-10">
        <h2
          id="order-status-heading"
          className="text-lg font-medium text-gray-900"
        >
          Order Status
        </h2>
  
        <div className="mt-6">
          <label
            htmlFor="order-status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <div className="mt-1">
            <select
              id="order-status"
              name="order-status"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.status || "pending"}
              onChange={(e) => onChange('status', e.target.value)}
              disabled={!formData.isAdmin}
            >
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          {!formData.isAdmin && (
            <p className="mt-2 text-sm text-gray-500">
              Your order will be set to "Pending" until we confirm it.
            </p>
          )}
        </div>
      </section>
    );
  };