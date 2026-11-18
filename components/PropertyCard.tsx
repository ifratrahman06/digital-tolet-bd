"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Wind,
  ArrowRight,
  Check,
  Heart,
  MessageSquare,
  ShieldCheck,
  Bookmark,
  Camera,
  Send,
  BadgeCheck,
} from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { IProperty } from "@/types/property";
import { useBookmarks } from "./BookmarkContext";
import DirectMessageModal from "./DirectMessageModal";
import NoImagePlaceholder from "./NoImagePlaceholder";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const propertyId = String(property._id || property.id || "1");
  const isAvailable = property.status === "available";
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(propertyId);

  // Reaction State with LocalStorage persistence
  const [likes, setLikes] = useState(property.likes || 12);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    try {
      const likedList = JSON.parse(localStorage.getItem("digital_tolet_liked_ids") || "[]");
      if (likedList.includes(propertyId)) {
        setIsLiked(true);
      }
    } catch {}
  }, [propertyId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking) return;
    setIsLiking(true);

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const likedList = JSON.parse(localStorage.getItem("digital_tolet_liked_ids") || "[]");
      if (nextLiked) {
        likedList.push(propertyId);
      } else {
        const idx = likedList.indexOf(propertyId);
        if (idx > -1) likedList.splice(idx, 1);
      }
      localStorage.setItem("digital_tolet_liked_ids", JSON.stringify(likedList));

      await fetch(`/api/properties/${propertyId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
    } catch (err) {
      console.warn("Like sync failed:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(propertyId);
  };

  const handleOpenMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMessageModalOpen(true);
  };

  const categoryBadgeColors: Record<string, string> = {
    Family: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    "Bachelor Male": "bg-slate-100 text-slate-800 border-slate-200",
    "Bachelor Female": "bg-teal-50 text-teal-800 border-teal-200/80",
    Sublet: "bg-zinc-100 text-zinc-800 border-zinc-200",
    Hostel: "bg-blue-50 text-blue-800 border-blue-200",
    Office: "bg-neutral-100 text-neutral-800 border-neutral-200",
  };

  const badgeClass =
    categoryBadgeColors[property.category] || "bg-slate-100 text-slate-800 border-slate-200";

  const hasImage = Boolean(property.images && property.images.length > 0 && property.images[0]);
  const coverImage = hasImage ? property.images[0] : "";

  const photoCount = property.images ? property.images.length : 0;
  const commentsCount = property.comments ? property.comments.length : 0;
  const isVerified = property.isVerified !== false;

  return (
    <>
      <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/80 shadow-xs hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 relative">
        {/* Top Banner / Image Showcase */}
        <div className="relative h-52 bg-slate-100 overflow-hidden">
          <Link href={`/properties/${propertyId}`} className="block w-full h-full">
            {hasImage ? (
              <img
                src={coverImage}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <NoImagePlaceholder compact className="w-full h-full" />
            )}
          </Link>

          {/* Gradient Overlay for Top Badges */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />

          {/* Status & Verification Badges - Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isAvailable ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1 font-bn">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                পাওয়া যাচ্ছে
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700 text-white shadow-sm font-bn">
                ভাড়া হয়েছে
              </span>
            )}

            {/* TRUST VERIFICATION BADGE */}
            {isVerified && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-xs flex items-center gap-1 font-bn"
                title="১০০% যাচাইকৃত ও নিরাপদ বাসা"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                ১০০% ভেরিফায়েড
              </span>
            )}
          </div>

          {/* Action Buttons Top Right: Category, Bookmark, Reaction */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs font-bn ${badgeClass}`}
            >
              {property.category}
            </span>

            {/* BOOKMARK BUTTON */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                bookmarked
                  ? "bg-rose-500 text-white shadow-rose-500/30 scale-110"
                  : "bg-white/80 hover:bg-white text-slate-700 border border-white/50"
              }`}
              title={bookmarked ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় সংরক্ষণ করুন"}
              aria-label="Bookmark property"
            >
              <Bookmark
                className={`w-3.5 h-3.5 transition-colors ${
                  bookmarked ? "fill-white text-white" : ""
                }`}
              />
            </button>

            {/* Like Reaction Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isLiked
                  ? "bg-rose-50 text-rose-600 border border-rose-200 scale-110"
                  : "bg-white/80 hover:bg-white text-slate-700 border border-white/50"
              }`}
              title={isLiked ? "Unlike" : "Like this listing"}
              aria-label="React to listing"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isLiked ? "fill-rose-600 text-rose-600" : ""
                }`}
              />
            </button>
          </div>

          {/* Photo Count Pill */}
          {photoCount > 1 && (
            <div className="absolute top-12 right-3 z-10">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white border border-white/20 backdrop-blur-md flex items-center gap-1 font-mono">
                <Camera className="w-3 h-3 text-emerald-300" />
                {photoCount} ছবি
              </span>
            </div>
          )}

          {/* Bottom image overlay with room metrics */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-emerald-400" />
                {property.details.rooms} বেড
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-emerald-400" />
                {property.details.baths} বাথ
              </span>
              {property.details.balcony && (
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  বারান্দা
                </span>
              )}
            </div>
            {property.details.sqft && (
              <span className="text-[10px] text-slate-200 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                {property.details.sqft} sqft
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
              <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">
                {property.location.area}, {property.location.district}
              </span>
            </div>

            {/* Title */}
            <Link href={`/properties/${propertyId}`}>
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-brand-700 transition-colors font-bn">
                {property.title}
              </h3>
            </Link>

            {/* Facilities preview tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {property.facilities.slice(0, 3).map((fac, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80 flex items-center gap-1 font-bn"
                >
                  <Check className="w-3 h-3 text-brand-600" />
                  {fac}
                </span>
              ))}
              {property.facilities.length > 3 && (
                <span className="text-[11px] font-medium text-slate-400 self-center font-bn">
                  +{property.facilities.length - 3}টি
                </span>
              )}
            </div>
          </div>

          {/* Footer: Price & Direct Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] text-slate-400 font-bn">মাসিক ভাড়া</div>
              <div className="text-lg font-extrabold text-slate-900 tracking-tight">
                {formatBDT(property.price)}
                <span className="text-xs font-normal text-slate-500 ml-1 font-bn">/ মাস</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Direct Message Action */}
              <button
                type="button"
                onClick={handleOpenMessage}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all font-bn shadow-xs hover:scale-105"
                title="বাড়িওয়ালাকে সরাসরি মেসেজ পাঠান"
              >
                <Send className="w-3.5 h-3.5 text-brand-600" />
                <span className="hidden sm:inline">মেসেজ</span>
              </button>

              {/* View Details Button */}
              <Link
                href={`/properties/${propertyId}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all font-bn shadow-xs group/btn"
              >
                বিস্তারিত
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Messaging Modal */}
      <DirectMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        property={{
          id: propertyId,
          title: property.title,
          area: property.location.area,
          district: property.location.district,
          ownerName: property.contact.ownerName,
          phone: property.contact.phone,
          whatsapp: property.contact.whatsapp,
        }}
      />
    </>
  );
}
