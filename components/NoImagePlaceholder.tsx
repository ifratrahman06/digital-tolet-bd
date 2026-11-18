import React from "react";
import { ImageOff, Home, BedDouble } from "lucide-react";

interface NoImagePlaceholderProps {
  className?: string;
  compact?: boolean;
}

export default function NoImagePlaceholder({
  className = "w-full h-full min-h-[200px]",
  compact = false,
}: NoImagePlaceholderProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-200 text-slate-500 overflow-hidden select-none border border-dashed border-slate-300 ${className}`}
    >
      {/* Background architectural room outline pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 text-slate-600 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <rect x="20" y="30" width="160" height="140" rx="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="20" y1="90" x2="180" y2="90" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="90" x2="80" y2="170" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="60" r="15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="110" y="110" width="50" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center p-4">
        {/* Room Illustration Circle */}
        <div className="relative mb-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
            <Home className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-xs">
              <ImageOff className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <span className="font-bn font-bold text-slate-700 text-xs sm:text-sm">
          ছবি আপলোড করা হয়নি
        </span>

        {!compact && (
          <p className="font-bn text-[11px] text-slate-500 mt-0.5 max-w-[220px]">
            বাড়িওয়ালার সাথে যোগাযোগ করে সরাসরি দেখে নিন
          </p>
        )}

        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 text-[10px] font-bn font-semibold">
          <BedDouble className="w-3 h-3 text-slate-500" />
          রুমের ছবি খালি
        </div>
      </div>
    </div>
  );
}
