"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell, FaHeart, FaUser } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { FaHome, FaSearch, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { User, User2, UserCircle2 } from "lucide-react"; // Import Lucide user icons

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const { language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  const getWishlistByUserId = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/wishlist/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch wishlist");
      const wishlistData = await response.json();

      if (wishlistData.message === "Wishlist not found") {
        toast.error("User not found");
        return;
      }

      const productArray = wishlistData.map((item) => ({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      }));

      if (wishlistData.length === 0) toast.error("Your wishlist is empty.");
      setWishlist(productArray);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist.");
    }
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(
          `/api/users/email/${session?.user?.email}`,
          { cache: "no-store" }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        
        data?.id ? getWishlistByUserId(data?.id) : toast.error("User not found");
      } catch (error) {
        console.error("Error fetching user by email:", error);
        toast.error("Failed to load user data.");
      }
    }
  };

  useEffect(() => {
    if (session?.user?.email) getUserByEmail();
  }, [session?.user?.email]);

  // User avatar component with fallback to Lucide icons
  const UserAvatar = ({ user }) => {
    return user?.image ? (
      <Image
        src={user.image}
        alt="User avatar"
        width={40}
        height={40}
        className="rounded-full border-2 border-primary-100 object-cover"
      />
    ) : (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 border-2 border-primary-200 text-primary-600">
        <UserCircle2 size={24} strokeWidth={1.5} />
      </div>
    );
  };

  // Admin avatar component with fallback to Lucide icons
  const AdminAvatar = ({ user }) => {
    return user?.image ? (
      <Image
        src={user.image}
        alt="Admin avatar"
        width={44}
        height={44}
        className="rounded-full border-2 border-primary-100 object-cover"
      />
    ) : (
      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-100 border-2 border-primary-200 text-primary-600">
        <User2 size={28} strokeWidth={1.5} />
      </div>
    );
  };

  return (
    <header className="bg-neutral-50 border-b border-neutral-200 shadow-sm">
      {!pathname.startsWith("/admin") && (
        <>
          <div className="h-24 flex items-center justify-between px-4 md:px-8 xl:px-16 max-w-screen-2xl mx-auto">
            {/* Branding */}
            <Link 
              href="/" 
              className="flex items-center gap-2 md:gap-3 group transition-transform hover:scale-105 min-w-[120px]"
            >
              <div className="flex flex-col">
                <span className="font-display text-2xl md:text-3xl tracking-wide text-primary-600">
                  KECHITA
                </span>
                <span className="font-display text-lg md:text-xl tracking-wider text-neutral-700 -mt-1">
                  FOODS
                </span>
              </div>
              <div className="h-12 w-[2px] bg-primary-400 mx-2"></div>
            </Link>

            {/* Desktop Search Input */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <SearchInput />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center rounded-full transition-all 
                  ${language === 'sw' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-600'}
                  w-10 h-10 md:w-12 md:h-12 hover:bg-primary-600 hover:text-white 
                  active:scale-95 shadow-sm hover:shadow-md`}
                  aria-label="Toggle language"
              >
                <span className="font-semibold text-sm md:text-base">
                  {language === 'sw' ? 'SW' : 'EN'}
                </span>
              </button>

              {/* Desktop Icons */}
              <div className="hidden md:flex gap-4 md:gap-6">
                <HeartElement 
                  wishQuantity={wishQuantity} 
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                />
                <CartElement 
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                />
                
                {/* User Profile */}
                {session?.user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
                      <UserAvatar user={session.user} />
                    </button>
                    <div className="absolute right-0 hidden group-hover:block bg-white shadow-layer rounded-lg p-4 w-48">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-neutral-700 hover:text-primary-600 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-2"
                  >
                    <User size={20} />
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu with Small Icons */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white border-t border-neutral-200 p-2 mb-8"
              >
                <nav className="flex justify-around">
                  <Link href="/" className="flex flex-col items-center text-neutral-700 hover:text-primary-600">
                    <FaHome size={20} />
                    <span className="text-xs mt-1">Home</span>
                  </Link>
                  <button className="flex flex-col items-center text-neutral-700 hover:text-primary-600">
                    <FaSearch size={20} />
                    <span className="text-xs mt-1">Search</span>
                  </button>
                  <Link href="/wishlist" className="flex flex-col items-center text-neutral-700 hover:text-primary-600">
                    <FaHeart size={20} />
                    <span className="text-xs mt-1">Favs</span>
                  </Link>
                  <Link href="/cart" className="flex flex-col items-center text-neutral-700 hover:text-primary-600">
                    <FaShoppingCart size={20} />
                    <span className="text-xs mt-1">Cart</span>
                  </Link>
                  {session?.user ? (
                    <Link href="/profile" className="flex flex-col items-center text-neutral-700 hover:text-primary-600">
                      <User size={20} />
                      <span className="text-xs mt-1">Profile</span>
                    </Link>
                  ) : (
                    <Link href="/login" className="flex flex-col items-center text-neutral-700 hover:text-primary-600">
                      <User size={20} />
                      <span className="text-xs mt-1">Sign In</span>
                    </Link>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Search Input */}
          <div className="md:hidden px-4 pb-4 -mt-2">
            <SearchInput />
          </div>
        </>
      )}

      {/* Admin Panel Header */}
      {pathname.startsWith("/admin") && (
        <div className="h-24 flex justify-between items-center px-8 xl:px-16 max-w-screen-2xl mx-auto">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 group"
          >
            <div className="flex flex-col">
              <span className="font-display text-2xl text-primary-600">
                KECHITA
              </span>
              <span className="font-display text-lg text-neutral-700 -mt-1">
                ADMIN
              </span>
            </div>
            <span className="text-primary-600 font-display text-xl border-l-2 border-neutral-200 pl-3">
              Dashboard
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className={`flex items-center justify-center rounded-full transition-all 
                ${language === 'sw' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-600'}
                w-12 h-12 hover:bg-primary-600 hover:text-white 
                active:scale-95 shadow-sm hover:shadow-md`}
              aria-label="Toggle language"
            >
              <span className="font-semibold text-base">
                {language === 'sw' ? 'SW' : 'EN'}
              </span>
            </button>
            
            {session?.user && (
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-neutral-100 rounded-full">
                  <FaBell className="text-neutral-600 w-6 h-6" />
                </button>
                <AdminAvatar user={session.user} />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;