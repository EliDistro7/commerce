"use client";

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack, FaHeart } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

// Translations object
const translations = {
  en: {
    addToWishlist: "ADD TO WISHLIST",
    removeFromWishlist: "REMOVE FROM WISHLIST",
    addedSuccess: "Product added to the wishlist",
    removedSuccess: "Product removed from the wishlist",
    loginRequired: "You need to be logged in to add a product to the wishlist"
  },
  sw: {
    addToWishlist: "ONGEZA KWENYE ORODHA YA VIPENDWA",
    removeFromWishlist: "ONDOA KUTOKA ORODHA YA VIPENDWA",
    addedSuccess: "Bidhaa imeongezwa kwenye orodha ya vipendwa",
    removedSuccess: "Bidhaa imeondolewa kwenye orodha ya vipendwa",
    loginRequired: "Unahitaji kuingia ili kuongeza bidhaa kwenye orodha ya vipendwa"
  }
};



const AddToWishlistBtn = ({ product, slug }) => {
  const { data: session, status } = useSession();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isProductInWishlist, setIsProductInWishlist] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get language from context
  const { language } = useLanguage();
  
  // Get translations based on current language
  const t = translations[language] || translations.en;

  const addToWishlistFun = async () => {
    // Don't allow multiple clicks while processing
    if (isLoading) return;
    
    setIsLoading(true);
    
    // getting user by email so I can get his user id
    if (session?.user?.email) {
      try {
        // sending fetch request to get user id because we will need it for saving wish item
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT}/api/users/email/${session?.user?.email}`,
          { cache: "no-store" }
        );
        const userData = await userResponse.json();

        const wishlistResponse = await fetch(`${process.env.NEXT_PUBLIC_CLIENT}/api/wishlist`, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product?.id, userId: userData?.id }),
        });
        
        const wishlistData = await wishlistResponse.json();
        
        addToWishlist({
          id: product?.id,
          title: product?.title,
          price: product?.price,
          image: product?.mainImage,
          slug: product?.slug,
          stockAvailabillity: product?.inStock,
        });
        
        toast.success(t.addedSuccess);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error(error.message || "Failed to add to wishlist");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(t.loginRequired);
      setIsLoading(false);
    }
  };

  const removeFromWishlistFun = async () => {
    // Don't allow multiple clicks while processing
    if (isLoading) return;
    
    setIsLoading(true);
    
    if (session?.user?.email) {
      try {
        // sending fetch request to get user id because we will need to delete wish item
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT}/api/users/email/${session?.user?.email}`,
          { cache: "no-store" }
        );
        const userData = await userResponse.json();

        await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT}/api/wishlist/${userData?.id}/${product?.id}`,
          { method: "DELETE" }
        );
        
        removeFromWishlist(product?.id);
        toast.success(t.removedSuccess);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error(error.message || "Failed to remove from wishlist");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isInWishlist = async () => {
    // sending fetch request to get user id because we will need it for checking whether the product is in wishlist
    if (session?.user?.email) {
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT}/api/users/email/${session?.user?.email}`,
          { cache: "no-store" }
        );
        const userData = await userResponse.json();

        // checking is product in wishlist
        const wishlistResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT}/api/wishlist/${userData?.id}/${product?.id}`
        );
        const wishlistData = await wishlistResponse.json();

        setIsProductInWishlist(!!wishlistData[0]?.id);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsProductInWishlist(false);
      }
    }
  };

  useEffect(() => {
    isInWishlist();
  }, [session?.user?.email, wishlist]);

  // Determine button appearance based on wishlist status
  const buttonClass = `
    flex items-center gap-x-2 cursor-pointer
    transition-all duration-300 py-2 px-4 rounded-md
    hover:bg-gray-100 border border-gray-200
    ${isProductInWishlist ? 'text-rose-600' : 'text-custom-black'}
  `;

  return (
    <button
      className={buttonClass}
      onClick={isProductInWishlist ? removeFromWishlistFun : addToWishlistFun}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-custom-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm md:text-base font-medium">
            {isProductInWishlist ? t.removeFromWishlist : t.addToWishlist}
          </span>
        </span>
      ) : (
        <>
          {isProductInWishlist ? (
            <FaHeartCrack className="text-xl" />
          ) : (
            <FaHeart className="text-xl" />
          )}
          <span className="text-sm md:text-base font-medium">
            {isProductInWishlist ? t.removeFromWishlist : t.addToWishlist}
          </span>
        </>
      )}
    </button>
  );
};

export default AddToWishlistBtn;