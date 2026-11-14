"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Heart, Building2, Search, ArrowRight } from "lucide-react";
import { useBookmarks } from "@/components/BookmarkContext";
import PropertyCard from "@/components/PropertyCard";
import { IProperty } from "@/types/property";

export default function SavedPropertiesPage() {
  const { bookmarkedIds } = useBookmarks();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/properties");
      const data = await res.json();
      if (data.success && data.data) {
        setProperties(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const savedList = properties.filter((item) =>
    bookmarkedIds.includes(String(item._id || item.id))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in font-bn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-all shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              সংরক্ষিত ও পছন্দের বাসা
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {bookmarkedIds.length} টি সংরক্ষিত
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            আপনার পরবর্তীতে দেখার জন্য বুকমার্ক বা পছন্দ করে রাখা সকল টু-লেট লিস্টিং
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-80 border border-slate-200 animate-pulse p-4 space-y-4">
              <div className="h-44 bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : savedList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">
              কোনো বাসা এখনো সংরক্ষণ করা হয়নি
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              যেকোনো বাসা কার্ডের ওপরের বুকমার্ক বা হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় যুক্ত করে রাখুন।
            </p>
          </div>
          <Link
            href="/#browse-properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <Search className="w-4 h-4" />
            বাসা খুঁজুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((property) => (
            <PropertyCard key={property._id || property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
