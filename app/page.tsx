"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
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
  Bookmark,
  BadgeCheck,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import ImageSlider from "@/components/ImageSlider";
import { useFeedback } from "@/components/FeedbackContext";
import { useBookmarks } from "@/components/BookmarkContext";
import { IProperty } from "@/types/property";
import { formatBDT } from "@/lib/utils";
import { BANGLADESH_DISTRICTS } from "@/lib/locations";

const AVAILABLE_FACILITIES = [
  "Lift",
  "Gas Line",
  "Generator",
  "Security",
  "Parking",
  "WiFi",
  "Water",
  "CCTV",
];

export default function HomePage() {
  const { openFeedback } = useFeedback();
  const { bookmarkedIds } = useBookmarks();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Basic category chip filter
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Advanced Filters State
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minSqft, setMinSqft] = useState<string>("");
  const [maxSqft, setMaxSqft] = useState<string>("");
  const [selectedRooms, setSelectedRooms] = useState<string>("all");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filterChips = [
    { id: "all", label: "সব বাসা", icon: Building2 },
    { id: "Family", label: "ফ্যামিলি", icon: Users },
    { id: "Bachelor Male", label: "ব্যাচেলর (ছেলে)", icon: User },
    { id: "Bachelor Female", label: "ব্যাচেলর (মেয়ে)", icon: UserCheck },
    { id: "Sublet", label: "সাবলেট", icon: Bed },
    { id: "saved", label: `সংরক্ষিত (${bookmarkedIds.length})`, icon: Bookmark },
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

  const handleFacilityToggle = (fac: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((item) => item !== fac) : [...prev, fac]
    );
  };

  const resetAllFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedDistrict("all");
    setSelectedArea("all");
    setMinPrice("");
    setMaxPrice("");
    setMinSqft("");
    setMaxSqft("");
    setSelectedRooms("all");
    setSelectedFacilities([]);
    setVerifiedOnly(false);
  };

  // Active advanced filters counter
  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDistrict !== "all") count++;
    if (selectedArea !== "all") count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (minSqft) count++;
    if (maxSqft) count++;
    if (selectedRooms !== "all") count++;
    if (selectedFacilities.length > 0) count += selectedFacilities.length;
    if (verifiedOnly) count++;
    return count;
  }, [selectedDistrict, selectedArea, minPrice, maxPrice, minSqft, maxSqft, selectedRooms, selectedFacilities, verifiedOnly]);

  // Main filtering logic
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // 1. Category / Saved filter
      if (activeCategory === "saved") {
        if (!bookmarkedIds.includes(String(item._id || item.id))) return false;
      } else if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }

      // 2. Verified only
      if (verifiedOnly && item.isVerified === false) {
        return false;
      }

      // 3. District filter
      if (selectedDistrict !== "all") {
        const dObj = BANGLADESH_DISTRICTS.find((d) => d.name === selectedDistrict);
        const itemDist = (item.location?.district || "").toLowerCase();
        const targetEn = selectedDistrict.toLowerCase();
        const targetBn = (dObj?.bn || "").toLowerCase();
        if (!itemDist.includes(targetEn) && !itemDist.includes(targetBn)) {
          return false;
        }
      }

      // 4. Area filter
      if (selectedArea !== "all") {
        const aLower = selectedArea.toLowerCase();
        const itemArea = (item.location?.area || "").toLowerCase();
        const itemAddr = (item.location?.address || "").toLowerCase();
        if (!itemArea.includes(aLower) && !itemAddr.includes(aLower)) {
          return false;
        }
      }

      // 5. Price Range
      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;

      // 6. Room count (Bedrooms)
      if (selectedRooms !== "all") {
        const roomsNum = item.details?.rooms || 1;
        if (selectedRooms === "4+" && roomsNum < 4) return false;
        if (selectedRooms !== "4+" && roomsNum !== Number(selectedRooms)) return false;
      }

      // 7. Sqft Range (Room size)
      const sqft = item.details?.sqft || 0;
      if (minSqft && sqft < Number(minSqft)) return false;
      if (maxSqft && sqft > Number(maxSqft)) return false;

      // 8. Facilities multi-select
      if (selectedFacilities.length > 0) {
        const itemFacilities = item.facilities || [];
        const hasAll = selectedFacilities.every((f) => itemFacilities.includes(f));
        if (!hasAll) return false;
      }

      // 9. Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchArea = item.location.area.toLowerCase().includes(q);
        const matchDistrict = item.location.district.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchDesc = (item.description || "").toLowerCase().includes(q);
        if (!matchTitle && !matchArea && !matchDistrict && !matchCategory && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [
    properties,
    activeCategory,
    bookmarkedIds,
    verifiedOnly,
    selectedDistrict,
    selectedArea,
    minPrice,
    maxPrice,
    selectedRooms,
    minSqft,
    maxSqft,
    selectedFacilities,
    searchQuery,
  ]);

  return (
    <div className="space-y-12 animate-fade-in font-bn">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs sm:text-sm font-semibold tracking-wide animate-fade-in text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            বাংলাদেশের আধুনিক ও ১০০% সম্পূর্ণ ফ্রি ডিজিটাল টু-লেট প্ল্যাটফর্ম
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-tight animate-slide-up text-white">
            আপনার পছন্দের বাসস্থান খুঁজুন <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300">
              সহজে ও সরাসরি বাড়িওয়ালার সাথে
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            ফ্যামিলি, ব্যাচেলর কিংবা সাবলেট—ঢাকা সহ সারাদেশে দালাল ফি ছাড়াই ১০০% ফ্রি ফোন কল বা সরাসরি মেসেজে যোগাযোগ করে বাসা ভাড়া নিন।
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
                className="w-full py-2.5 px-2 text-slate-900 placeholder-slate-400 text-sm sm:text-base outline-none"
              />
              <a
                href="#browse-properties"
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 sm:px-7 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex-shrink-0"
              >
                খুঁজুন
              </a>
            </div>
          </div>

          {/* 100% FREE & VERIFIED HIGHLIGHT PILL */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/20 text-xs sm:text-sm text-emerald-100">
            <span className="inline-flex items-center gap-1.5 font-bold text-white bg-emerald-600 px-3 py-1 rounded-full text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> ১০০% ফ্রি সার্ভিস
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-200">
              <BadgeCheck className="w-4 h-4 text-emerald-400" /> ভেরিফায়েড লিস্টিং
            </span>
            <span className="hidden sm:inline">•</span>
            <span>০% দালাল বা ব্রোকার কমিশন</span>
            <span className="hidden sm:inline">•</span>
            <span>সরাসরি বাড়িওয়ালা ও ভাড়াটিয়া মেসেজিং</span>
          </div>

          {/* QUICK METRICS */}
          <div className="pt-6 grid grid-cols-3 max-w-md mx-auto gap-4 border-t border-emerald-500/20 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{properties.length}+</div>
              <div className="text-xs text-emerald-200/80">মোট ভেরিফায়েড লিস্টিং</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">১০০%</div>
              <div className="text-xs text-emerald-200/80">বিনামূল্যে ব্যবহারযোগ্য</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">০%</div>
              <div className="text-xs text-emerald-200/80">দালাল কমিশন</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PHOTO SLIDER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              ডিজিটাল টু-লেট বিডি হাইলাইটস
            </h2>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold hidden sm:inline">
            ১০০% সম্পূর্ণ ফ্রি প্ল্যাটফর্ম
          </span>
        </div>
        <ImageSlider onOpenFeedback={openFeedback} />
      </section>

      {/* FILTER CHIPS BAR & ADVANCED FILTER TOGGLE */}
      <section id="browse-properties" className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 scroll-mt-24 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {filterChips.map((chip) => {
              const isActive = activeCategory === chip.id;
              const Icon = chip.icon;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveCategory(chip.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-950/20 scale-105"
                      : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? "text-emerald-400"
                        : chip.id === "saved"
                        ? "text-rose-500"
                        : "text-slate-500"
                    }`}
                  />
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* ADVANCED FILTER TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all shadow-xs flex-shrink-0 ${
              showAdvancedFilter || activeAdvancedFilterCount > 0
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-white text-slate-800 border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>অ্যাডভান্সড ফিল্টার</span>
            {activeAdvancedFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-[11px] font-mono font-bold flex items-center justify-center">
                {activeAdvancedFilterCount}
              </span>
            )}
            {showAdvancedFilter ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>

        {/* QUICK AREA CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 whitespace-nowrap pl-1">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            জনপ্রিয় এলাকা:
          </span>
          {["all", "ধানমন্ডি", "মিরপুর", "গুলশান", "বনানী", "উত্তরা", "বসুন্ধরা", "মোহাম্মদপুর", "বাড্ডা", "মগবাজার", "শান্তিনগর"].map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area === "all" ? "all" : area)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                (selectedArea === "all" && area === "all") || selectedArea === area
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {area === "all" ? "সব এলাকা" : area}
            </button>
          ))}
        </div>

        {/* EXPANDABLE ADVANCED FILTER PANEL */}
        {showAdvancedFilter && (
          <div className="bg-white rounded-3xl border border-emerald-200/80 p-5 sm:p-7 shadow-xl space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">
                  নির্দিষ্ট পছন্দ অনুযায়ী ফিল্টার করুন
                </h3>
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                সব ফিল্টার রিসেট
              </button>
            </div>

            {/* District & Area Filter Row */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  জেলা বা বিভাগ নির্বাচন করুন
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedArea("all");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white outline-none focus:border-emerald-500"
                >
                  <option value="all">সব জেলা (সমগ্র বাংলাদেশ)</option>
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.bn} ({d.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-600" />
                  নির্দিষ্ট এলাকা (Area) নির্বাচন করুন
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white outline-none focus:border-emerald-500"
                >
                  <option value="all">সব এলাকা</option>
                  {(
                    BANGLADESH_DISTRICTS.find((d) => d.name === selectedDistrict)?.areas ||
                    BANGLADESH_DISTRICTS[0].areas
                  ).map((a) => (
                    <option key={a.en} value={a.bn}>
                      {a.bn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Price Range */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-brand-600" />
                  ভাড়া রেঞ্জ (টাকা / মাস)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="সর্বনিম্ন (যেমন: ৫,০০০)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="সর্বোচ্চ (যেমন: ৩০,০০০)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                {/* Quick Price Range Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: "≤১০,০০০", max: "10000" },
                    { label: "১০-২৫ হাজার", min: "10000", max: "25000" },
                    { label: "২৫-৫০ হাজার", min: "25000", max: "50000" },
                    { label: "৫০,০০০+", min: "50000" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMinPrice(preset.min || "");
                        setMaxPrice(preset.max || "");
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Room Size & Bedrooms */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-brand-600" />
                  রুমের সংখ্যা ও সাইজ (Sqft)
                </label>
                <div className="flex gap-1.5">
                  {["all", "1", "2", "3", "4+"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRooms(r)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        selectedRooms === r
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {r === "all" ? "যেকোনো" : `${r} বেড`}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="number"
                    placeholder="Min Sqft (যেমন: ৫০০)"
                    value={minSqft}
                    onChange={(e) => setMinSqft(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Max Sqft (যেমন: ২০০০)"
                    value={maxSqft}
                    onChange={(e) => setMaxSqft(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* 3. Facilities Checkbox Multi-Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  প্রয়োজনীয় সুবিধা নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVAILABLE_FACILITIES.map((fac) => {
                    const isChecked = selectedFacilities.includes(fac);
                    return (
                      <button
                        type="button"
                        key={fac}
                        onClick={() => handleFacilityToggle(fac)}
                        className={`text-[11px] px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all text-left ${
                          isChecked
                            ? "bg-emerald-50 text-emerald-800 border-emerald-400"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </span>
                        {fac}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Verified Toggle & Results Counter */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  শুধুমাত্র ভেরিফায়েড বাসা প্রদর্শন করুন (Verified Only)
                </span>
              </label>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500">
                  {filteredProperties.length} টি বাসা ফিল্টারে মিলেছে
                </span>
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilter(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all ml-auto sm:ml-0"
                >
                  ফলাফল দেখুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE FILTERS CHIPS BAR */}
        {activeAdvancedFilterCount > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-slate-400 font-bold">সক্রিয় ফিল্টার:</span>
            {minPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                ভাড়া ≥ {formatBDT(Number(minPrice))}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMinPrice("")} />
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                ভাড়া ≤ {formatBDT(Number(maxPrice))}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice("")} />
              </span>
            )}
            {selectedRooms !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                {selectedRooms} বেডরুম
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRooms("all")} />
              </span>
            )}
            {selectedFacilities.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-semibold"
              >
                {f}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleFacilityToggle(f)} />
              </span>
            ))}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold">
                ভেরিফায়েড
                <X className="w-3 h-3 cursor-pointer" onClick={() => setVerifiedOnly(false)} />
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-slate-400 hover:text-rose-600 underline text-xs ml-1"
            >
              সব মুছুন
            </button>
          </div>
        )}
      </section>

      {/* PROPERTY LISTINGS GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              উপলব্ধ বাসা সমূহ
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-mono">
              {filteredProperties.length} টি পাওয়া গেছে
            </span>
          </div>

          <Link
            href="/post-ad"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            + নতুন বিজ্ঞাপন দিন
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 border border-slate-200 animate-pulse p-4 space-y-4">
                <div className="h-44 bg-slate-100 rounded-2xl" />
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
            <h3 className="text-lg font-bold text-slate-800">
              আপনার ফিল্টার অনুযায়ী কোনো বাসা পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500">
              অন্য কোনো এলাকা বা ফিল্টার ট্রাই করুন অথবা নিজের বাসা ভাড়ার জন্য বিজ্ঞাপন দিন।
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              সব ফিল্টার রিসেট করুন
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

      {/* USER FEEDBACK CALLOUT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-300 mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ব্যবহারকারীদের মূল্যবান মতামত
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              আমাদের সার্ভিস কেমন লাগছে? আপনার মতামত দিন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              আপনার একটি গঠনমূলক পরামর্শ বা অভিযোগ আমাদের প্ল্যাটফর্মকে বাংলাদেশের সাধারণ মানুষের জন্য আরও সহজ ও কার্যকরী করতে সাহায্য করবে।
            </p>
          </div>

          <button
            type="button"
            onClick={openFeedback}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <MessageSquareHeart className="w-4 h-4 text-emerald-700" />
            মতামত / ফিডব্যাক লিখুন
          </button>
        </div>
      </section>
    </div>
  );
}
