"use client";
import Link from 'next/link';
import React from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import { useProductStore } from "@/app/_zustand/store";

const CartElement = ({ className }: { className?: string }) => {
  const { allQuantity } = useProductStore();
  
  return (
    <div className={`relative group ${className}`}>
      <Link
        href="/cart"
        className="flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-all duration-200"
        aria-label="Shopping Cart"
      >
        <FaCartShopping className="w-6 h-6 text-primary-600 group-hover:text-primary-700 transition-colors" />
        {allQuantity > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-chili text-white rounded-full flex items-center justify-center text-xs font-display shadow-sm border border-white">
            {allQuantity > 9 ? "9+" : allQuantity}
          </span>
        )}
      </Link>
    </div>
  );
};

export default CartElement;