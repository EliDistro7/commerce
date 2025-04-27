"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

const HeartElement = ({ wishQuantity, className }: { 
  wishQuantity: number;
  className?: string;
}) => {
  return (
    <div className={`relative group ${className}`}>
      <Link
        href="/wishlist"
        className="flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-all duration-200"
        aria-label="Wishlist"
      >
        <FaHeart className="w-6 h-6 text-primary-500 group-hover:text-primary-600 transition-colors" />
        {wishQuantity > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-chili text-white rounded-full flex items-center justify-center text-xs font-display shadow-sm border border-white">
            {wishQuantity > 9 ? "9+" : wishQuantity}
          </span>
        )}
      </Link>
    </div>
  );
};

export default HeartElement;