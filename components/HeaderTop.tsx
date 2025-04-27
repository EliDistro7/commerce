"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { 
  FaHeadphones, 
  FaRegEnvelope, 
  FaLocationDot,
  FaRegUser,
  FaUserPlus
} from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  }

  return (
    <div className="bg-primary-600 text-neutral-50 border-b border-primary-700">
      <div className="max-w-screen-2xl mx-auto px-8 xl:px-16 py-2">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          {/* Contact Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 hover:text-primary-100 transition-colors">
              <FaHeadphones className="w-4 h-4" />
              <a href="tel:+255123456789" className="hidden sm:inline">
                +255 123 456 789
              </a>
            </div>
            <div className="flex items-center gap-2 hover:text-primary-100 transition-colors">
              <FaRegEnvelope className="w-4 h-4" />
              <a href="mailto:info@tanzanianeats.tz" className="hidden sm:inline">
                info@tanzanianeats.tz
              </a>
            </div>
          </div>

          {/* Auth Links */}
          <div className="flex items-center gap-4 text-sm">
            {!session ? (
              <>
                <Link 
                  href="/login"
                  className="flex items-center gap-2 hover:text-primary-100 transition-colors group"
                >
                  <div className="p-1.5 rounded-full bg-primary-500 group-hover:bg-primary-400 transition-colors">
                    <FaRegUser className="w-4 h-4" />
                  </div>
                  <span>Sign In</span>
                </Link>
                <Link 
                  href="/register"
                  className="flex items-center gap-2 hover:text-primary-100 transition-colors group"
                >
                  <div className="p-1.5 rounded-full bg-primary-500 group-hover:bg-primary-400 transition-colors">
                    <FaUserPlus className="w-4 h-4" />
                  </div>
                  <span>Create Account</span>
                </Link>
              </>
            ) : (
              <>
                <span className="text-primary-100/80 text-sm">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-primary-100 transition-colors group"
                  aria-label="Log out"
                >
                  <div className="p-1.5 rounded-full bg-primary-500 group-hover:bg-primary-400 transition-colors">
                    <FaRegUser className="w-4 h-4" />
                  </div>
                  <span>Log Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;