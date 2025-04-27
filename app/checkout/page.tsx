// File: src/app/checkout/page.js
"use client";
import { SectionTitle } from "@/components";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderSummary } from "./components/OrderSummary";
import { useRouter } from "next/navigation";
import { useProductStore } from "../_zustand/store";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { products } = useProductStore();
  const router = useRouter();

  // Calculate total from products
  const total = products.reduce((sum, product) => 
    sum + (product.price * (product.amount || 1)), 0);

  useEffect(() => {
    if (products.length === 0) {
      toast.error("You don't have items in your cart");
      router.push("/cart");
    }
  }, [products, router]);

  return (
    <div className="bg-white">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />
      {/* Background color split screen for large screens */}
      <div
        className="hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="hidden h-full w-1/2 bg-neutral-50 lg:block"
        aria-hidden="true"
      />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-8 md:gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>
        
        {/* Order Summary Section */}
        <OrderSummary products={products} />
        
        {/* Checkout Form Section - Added missing required props */}
        <CheckoutForm 
          cartItems={products} 
          total={total} 
          isAdmin={false}
        />
        <div className="h-8"></div>
      </main>
    </div>
  );
};

export default CheckoutPage;