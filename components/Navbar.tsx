"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Building2, PlusCircle, Home, MessageSquareHeart, LogIn, LogOut, User, ChevronDown, ShieldCheck, Heart, LayoutDashboard, Bookmark } from "lucide-react";
import { useFeedback } from "./FeedbackContext";
import { useAuth } from "./AuthContext";
import { useBookmarks } from "./BookmarkContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const { openFeedback } = useFeedback();
  const { user, logout, openLoginModal } = useAuth();
  const { bookmarkCount } = useBookmarks();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-emerald-100/60 shadow-sm transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo with New Generated SVG */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200 flex-shrink-0 bg-brand-700">
            <img
              src="/logo.svg"
              alt="Digital To-Let BD Logo"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg tracking-tight text-slate-800 leading-none">
              Digital <span className="text-brand-600">To-Let</span>{" "}
              <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded-full font-bold ml-1">
                BD
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-bn leading-tight mt-0.5">
              ডিজিটাল বাসা ভাড়া প্ল্যাটফর্ম
            </div>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-700 hover:bg-emerald-50/80 rounded-lg transition-colors font-bn"
          >
            <Home className="w-4 h-4 text-brand-600" />
            বাসা খুঁজুন
          </Link>

          {/* Bookmarked / Saved Properties Link with Count Badge */}
          <Link
            href="/saved"
            className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-rose-50/80 hover:text-rose-600 border border-slate-200/90 hover:border-rose-300 rounded-xl transition-all font-bn shadow-xs group"
            title="সংরক্ষিত ও পছন্দের বাসা"
          >
            <Bookmark className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">পছন্দ</span>
            {bookmarkCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center -ml-0.5">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* In-App Notification Center */}
          <NotificationDropdown />

          {/* Feedback Modal Trigger */}
          <button
            type="button"
            onClick={openFeedback}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all font-bn shadow-xs hover:scale-105"
            title="মতামত বা ফিডব্যাক দিন"
          >
            <MessageSquareHeart className="w-4 h-4 text-brand-600" />
            <span className="hidden sm:inline">মতামত</span> দিন
          </button>

          {/* User Auth Section (Login or User Profile Dropdown) */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/70 text-slate-800 text-xs sm:text-sm font-bold font-bn transition-all shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[80px] sm:max-w-[110px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in font-bn">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900 text-sm truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.phone}</div>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                      {user.role === "landlord" ? "বাড়িওয়ালা (Landlord)" : "ভাড়াটিয়া (Tenant)"}
                    </span>
                  </div>

                  <Link
                    href="/post-ad"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-brand-700 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-brand-600" />
                    নতুন বিজ্ঞাপন দিন
                  </Link>

                  <Link
                    href="/my-ads"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-brand-700 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-600" />
                    আমার বিজ্ঞাপনসমূহ
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      openFeedback();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-brand-700 transition-colors"
                  >
                    <MessageSquareHeart className="w-4 h-4 text-brand-600" />
                    মতামত বা ফিডব্যাক দিন
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-bold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    লগআউট করুন (Log Out)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all font-bn shadow-xs hover:border-brand-400"
            >
              <LogIn className="w-4 h-4 text-brand-600" />
              <span>লগইন</span>
            </button>
          )}

          {/* Post Ad CTA */}
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all font-bn"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">+ ফ্রি</span> বিজ্ঞাপন দিন
          </Link>
        </div>
      </div>
    </header>
  );
}
