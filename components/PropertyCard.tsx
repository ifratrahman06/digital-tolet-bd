"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Bed, Bath, Wind, ArrowRight, Check, Heart, MessageSquare, Compass, ShieldCheck } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { IProperty } from "@/types/property";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const propertyId = property._id || property.id || "1";
  const isAvailable = property.status === "available";

  // Reaction State with LocalStorage persistence
  const [likes, setLikes] = useState(property.likes || 12);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    try {
      const likedList = JSON.parse(localStorage.getItem("digital_tolet_liked_ids") || "[]");
      if (likedList.includes(propertyId)) {
        setIsLiked(true);
      }
    } catch (e) {}
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

  const categoryBadgeColors: Record<string, string> = {
    Family: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    "Bachelor Male": "bg-slate-100 text-slate-800 border-slate-200",
    "Bachelor Female": "bg-teal-50 text-teal-800 border-teal-200/80",
    Sublet: "bg-zinc-100 text-zinc-800 border-zinc-200",
    Hostel: "bg-blue-50 text-blue-800 border-blue-200",
    Office: "bg-neutral-100 text-neutral-800 border-neutral-200",
  };

  const badgeClass = categoryBadgeColors[property.category] || "bg-slate-100 text-slate-800 border-slate-200";

  const coverImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80";

  const commentsCount = property.comments ? property.comments.length : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-500/80 shadow-xs hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Top Banner / Real Image Showcase */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-600 text-white shadow-sm flex items-center gap-1 font-bn">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              পাওয়া যাচ্ছে
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700 text-white shadow-sm font-bn">
              ভাড়া হয়েছে
            </span>
          )}
        </div>

        {/* Category & Reaction Buttons Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${badgeClass}`}>
            {property.category}
          </span>

          {/* Interactive Heart Reaction Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isLiked
                ? "bg-rose-50 text-rose-600 border border-rose-200 scale-110"
                : "bg-white/80 hover:bg-white text-slate-700 border border-white/40"
            }`}
            title={isLiked ? "Unlike" : "Like this listing"}
            aria-label="React to listing"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
          </button>
        </div>

        {/* Bottom image overlay with room metrics */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
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
            <span className="text-[10px] text-slate-300 font-mono">
              {property.details.sqft} sqft
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Location with Icon */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{property.location.area}, {property.location.district}</span>
          </div>

          {/* Title */}
          <Link href={`/properties/${propertyId}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-brand-700 transition-colors font-bn">
              {property.title}
            </h3>
          </Link>

          {/* Facilities preview tags (Icons not emojis) */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {property.facilities.slice(0, 3).map((fac, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80 flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-brand-600" />
                {fac}
              </span>
            ))}
            {property.facilities.length > 3 && (
              <span className="text-[11px] font-medium text-slate-400 self-center">
                +{property.facilities.length - 3}টি
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price, Reactions & Details Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-bn">মাসিক ভাড়া</div>
            <div className="text-lg font-extrabold text-slate-900 tracking-tight">
              {formatBDT(property.price)}
              <span className="text-xs font-normal text-slate-500 ml-1">/ মাস</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Comments Counter link */}
            <Link
              href={`/properties/${propertyId}#comments`}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-brand-600 transition-colors"
              title="প্রশ্ন ও মন্তব্য দেখুন"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{commentsCount}</span>
            </Link>

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
  );
}
