"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Filter,
  Home,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Building,
  Building2,
  Users,
  User,
  UserCheck,
  Bed,
  Coins,
  ArrowUpDown,
  MessageSquareHeart,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import ImageSlider from "@/components/ImageSlider";
import { useFeedback } from "@/components/FeedbackContext";
import { IProperty } from "@/types/property";

export default function HomePage() {
  const { openFeedback } = useFeedback();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filterChips = [
    { id: "all", label: "সব বাসা", icon: Building2 },
    { id: "Family", label: "ফ্যামিলি", icon: Users },
    { id: "Bachelor Male", label: "ব্যাচেলর (ছেলে)", icon: User },
    { id: "Bachelor Female", label: "ব্যাচেলর (মেয়ে)", icon: UserCheck },
    { id: "Sublet", label: "সাবলেট", icon: Bed },
    { id: "budget", label: "বাজেট (≤১৫,০০০)", icon: Coins },
    { id: "lift", label: "লিফট আছে", icon: ArrowUpDown },
  ];

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
      console.error("Failed to load properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter properties in client
  const filteredProperties = properties.filter((item) => {
    // Category filter
    if (activeFilter === "Family" && item.category !== "Family") return false;
    if (activeFilter === "Bachelor Male" && item.category !== "Bachelor Male") return false;
    if (activeFilter === "Bachelor Female" && item.category !== "Bachelor Female") return false;
    if (activeFilter === "Sublet" && item.category !== "Sublet") return false;
    if (activeFilter === "budget" && item.price > 15000) return false;
    if (activeFilter === "lift" && !item.facilities.includes("Lift")) return false;

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchArea = item.location.area.toLowerCase().includes(q);
      const matchDistrict = item.location.district.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchArea && !matchDistrict && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="space-y-12">
      {/* HERO SECTION — VIBRANT BANGLADESH EMERALD-TEAL THEME & 100% FREE HIGHLIGHT */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white pt-16 pb-20 px-4 sm:px-6">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs sm:text-sm font-semibold tracking-wide animate-fade-in font-bn text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            বাংলাদেশের আধুনিক ও ১০০% সম্পূর্ণ ফ্রি ডিজিটাল টু-লেট প্ল্যাটফর্ম
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-tight font-bn animate-slide-up text-white">
            আপনার পছন্দের বাসস্থান খুঁজুন <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300">
              সহজে ও সরাসরি বাড়িওয়ালার সাথে
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bn">
            ব্যাচেলর, ফ্যামিলি, কিংবা সাবলেট—ঢাকা সহ সারাদেশে কোনো মধ্যস্থতাকারী ফি বা সাবস্ক্রিপশন চার্জ ছাড়াই ১০০% সম্পূর্ণ বিনামূল্যে সরাসরি ফোন কল বা হোয়াটসঅ্যাপে যোগাযোগ করে বাসা ভাড়া নিন।
          </p>

          {/* SEARCH BOX */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white p-2 rounded-2xl shadow-2xl border border-emerald-200/50 flex items-center gap-2 transition-all focus-within:ring-4 focus-within:ring-emerald-400/30">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-brand-600" />
              </div>
              <input
                type="text"
                placeholder="এলাকা বা জেলা লিখুন... (যেমন: ধানমন্ডি ২৭, গুলশান, মিরপুর, উত্তরা)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 px-2 text-slate-900 placeholder-slate-400 text-sm sm:text-base outline-none font-bn"
              />
              <a
                href="#browse-properties"
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 sm:px-7 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex-shrink-0 font-bn"
              >
                খুঁজুন
              </a>
            </div>
          </div>

          {/* 100% FREE PROMINENT HIGHLIGHT PILL */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/20 text-xs sm:text-sm text-emerald-100 font-bn">
            <span className="inline-flex items-center gap-1.5 font-bold text-white bg-emerald-600 px-3 py-1 rounded-full text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> ১০০% ফ্রি সার্ভিস
            </span>
            <span>কোনো রেজিস্ট্রেশন চার্জ নেই</span>
            <span className="hidden sm:inline">•</span>
            <span>০% দালাল বা ব্রোকার কমিশন</span>
            <span className="hidden sm:inline">•</span>
            <span>সরাসরি বাড়িওয়ালা ও ভাড়াটিয়া চ্যাট</span>
          </div>

          {/* QUICK METRICS */}
          <div className="pt-6 grid grid-cols-3 max-w-md mx-auto gap-4 border-t border-emerald-500/20 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{properties.length}+</div>
              <div className="text-xs text-emerald-200/80 font-bn">মোট ভেরিফায়েড লিস্টিং</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">১০০%</div>
              <div className="text-xs text-emerald-200/80 font-bn">বিনামূল্যে ব্যবহারযোগ্য</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">০%</div>
              <div className="text-xs text-emerald-200/80 font-bn">দালাল কমিশন</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PHOTO SLIDER — HIGH QUALITY SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-bn">
              ডিজিটাল টু-লেট বিডি হাইলাইটস
            </h2>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bn font-bold hidden sm:inline">
            ১০০% সম্পূর্ণ ফ্রি প্ল্যাটফর্ম
          </span>
        </div>
        <ImageSlider onOpenFeedback={openFeedback} />
      </section>

      {/* 100% FREE VALUE PROPOSITION CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-950/[0.03] via-teal-950/[0.04] to-emerald-950/[0.03] border border-emerald-200/70 rounded-3xl p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bn">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              সবার জন্য উন্মুক্ত ও আজীবন ফ্রি
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-bn">
              কেন ডিজিটাল টু-লেট বিডি সম্পূর্ণ বিনামূল্যে ব্যবহার করবেন?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-bn">
              বাংলাদেশের সাধারণ ছাত্র, ব্যাচেলর ও পরিবারকে দালালের হয়রানি ও অতিরিক্ত কমিশন থেকে মুক্তি দিতে আমাদের এই উন্মুক্ত উদ্যোগ।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Coins className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-bn">০ টাকা ফি</h4>
              <p className="text-xs text-slate-500 font-bn leading-relaxed">
                রেজিস্ট্রেশন বা অ্যাকাউন্ট খুলতে কোনো টাকা দিতে হবে না। আজীবন ১০০% ফ্রি।
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-bn">কোনো দালাল কমিশন নেই</h4>
              <p className="text-xs text-slate-500 font-bn leading-relaxed">
                ভাড়াটিয়া বা বাড়িওয়ালা কারো কাছ থেকেই কোনো কমিশন বা মধ্যস্থতাকারী ফি নেওয়া হয় না।
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-bn">আনলিমিটেড ফ্রি বিজ্ঞাপন</h4>
              <p className="text-xs text-slate-500 font-bn leading-relaxed">
                বাড়িওয়ালারা যত খুশি ফ্ল্যাট, সাবলেট বা মেস রুমের বিজ্ঞাপন সম্পূর্ণ ফ্রিতে দিতে পারবেন।
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm font-bn">লাইভ ম্যাপ ও জরুরি সেবা</h4>
              <p className="text-xs text-slate-500 font-bn leading-relaxed">
                হাসপাতাল, বাজার, মেট্রোরেল ও থানা—এলাকার জরুরি সব স্থান ও দূরত্ব ম্যাপসহ উন্মুক্ত।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS BAR — MINIMALIST LUCIDE ICONS (NO EMOJIS) */}
      <section id="browse-properties" className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 scroll-mt-24">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 font-bn ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-950/20 scale-105"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* PROPERTY LISTINGS GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-bn">
              উপলব্ধ বাসা সমূহ
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bn font-mono">
              {filteredProperties.length} টি পাওয়া গেছে
            </span>
          </div>

          <Link
            href="/post-ad"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 font-bn"
          >
            + নতুন বিজ্ঞাপন দিন
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse p-4 space-y-4">
                <div className="h-44 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-bn">
              আপনার ফিল্টার অনুযায়ী কোনো বাসা পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 font-bn">
              অন্য কোনো এলাকা বা ফিল্টার ট্রাই করুন অথবা নিজের বাসা ভাড়ার জন্য বিজ্ঞাপন দিন।
            </p>
            <button
              onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-bn"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id || property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* USER FEEDBACK CALLOUT — MINIMALIST */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-300 font-bn mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ব্যবহারকারীদের মূল্যবান মতামত
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-bn tracking-tight">
              আমাদের সার্ভিস কেমন লাগছে? আপনার মতামত দিন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-bn max-w-xl">
              আপনার একটি গঠনমূলক পরামর্শ বা অভিযোগ আমাদের প্ল্যাটফর্মকে বাংলাদেশের সাধারণ মানুষের জন্য আরও সহজ ও কার্যকরী করতে সাহায্য করবে।
            </p>
          </div>

          <button
            type="button"
            onClick={openFeedback}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all font-bn flex items-center gap-2 flex-shrink-0"
          >
            <MessageSquareHeart className="w-4 h-4 text-emerald-700" />
            মতামত / ফিডব্যাক লিখুন
          </button>
        </div>
      </section>
    </div>
  );
}
