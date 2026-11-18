"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  Building,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  FileText,
  Coins,
  CheckSquare,
  Camera,
  Layers,
  ShieldCheck,
  Check,
  Navigation,
  Crosshair,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { BANGLADESH_DISTRICTS } from "@/lib/locations";

export default function PostAdPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Family",
    price: "",
    advance: "",
    area: "",
    district: "Dhaka",
    address: "",
    mapQuery: "",
    rooms: "2",
    baths: "2",
    balcony: true,
    floor: "3",
    sqft: "1200",
    genderPreference: "Any",
    description: "",
    phone: user?.phone || "",
    whatsapp: user?.phone || "",
    ownerName: user?.name || "",
    facilities: ["Gas Line", "Water"] as string[],
    images: [] as string[],
  });

  const currentDistrictObj =
    BANGLADESH_DISTRICTS.find(
      (d) => d.name.toLowerCase() === formData.district.toLowerCase() || d.bn === formData.district
    ) || BANGLADESH_DISTRICTS[0];

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("আপনার ব্রাউজারে GPS লাইভ লোকেশন সাপোর্ট নেই।");
      return;
    }

    setGpsLoading(true);
    setGpsStatus("স্যাটেলাইট ও জিপিএস থেকে লাইভ লোকেশন নেওয়া হচ্ছে...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordsStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setFormData((prev) => ({
          ...prev,
          mapQuery: coordsStr,
          address: prev.address ? `${prev.address} (GPS: ${coordsStr})` : `লাইভ GPS পিন: ${coordsStr}`,
        }));
        setGpsStatus(`✅ লাইভ জিপিএস সফলভাবে সংযুক্ত হয়েছে (${coordsStr})`);
        setGpsLoading(false);
      },
      (err) => {
        setGpsStatus("জিপিএস পারমিশন দিন অথবা ম্যানুয়ালি ঠিকানা পূরণ করুন।");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const availableFacilities = [
    { id: "Lift", label: "লিফট (Lift)" },
    { id: "Gas Line", label: "গ্যাস লাইন (Gas Line)" },
    { id: "Generator", label: "জেনারেটর ব্যাকআপ" },
    { id: "Security", label: "২৪/৭ নিরাপত্তা গার্ড" },
    { id: "Parking", label: "গাড়ি পার্কিং" },
    { id: "WiFi", label: "ওয়াইফাই ইন্টারনেট" },
    { id: "Water", label: "সার্বক্ষণিক পানি" },
    { id: "CCTV", label: "সিসিটিভি সার্ভেইল্যান্স" },
  ];

  const handleFacilityToggle = (fac: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(fac)
        ? prev.facilities.filter((f) => f !== fac)
        : [...prev.facilities, fac],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      if (resData.success && resData.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, resData.url],
        }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title || !formData.price || !formData.area || !formData.phone) {
      setError("দয়া করে প্রয়োজনীয় সকল তারকা চিহ্নিত (*) তথ্য সঠিকভাবে পূরণ করুন।");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        advance: Number(formData.advance || 0),
        location: {
          area: formData.area,
          district: formData.district,
          address: formData.address || `${formData.area}, ${formData.district}`,
          mapQuery: formData.mapQuery || `${formData.area}, ${formData.district}`,
        },
        details: {
          rooms: Number(formData.rooms),
          baths: Number(formData.baths),
          balcony: formData.balcony,
          floor: Number(formData.floor),
          sqft: Number(formData.sqft || 1000),
          genderPreference: formData.genderPreference,
        },
        facilities: formData.facilities,
        description: formData.description,
        contact: {
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          ownerName: formData.ownerName || "বাড়িওয়ালা",
        },
        images: formData.images, // Empty array if no images provided
        status: "available",
        ...(user ? { postedBy: { userId: user.id, name: user.name, phone: user.phone } } : {}),
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(data.error || "বিজ্ঞাপন পোস্ট করতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setError(err.message || "সার্ভার এরর!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-all shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-bn">
              নতুন টু-লেট বিজ্ঞাপন দিন
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bn">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> আজীবন ফ্রি
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bn mt-0.5">
            ১০০% বিনামূল্যে কোনো ব্রোকার ফি ছাড়াই আপনার ফ্ল্যাট বা রুমের বিজ্ঞাপন প্রকাশ করুন
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 font-bn animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold">বিজ্ঞাপন সফলভাবে প্রকাশিত হয়েছে!</div>
            <div className="text-xs">কিছুক্ষণের মধ্যে আপনাকে হোমপেজে নিয়ে যাওয়া হচ্ছে...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 font-bn">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="text-xs font-semibold">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 font-bn flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            মৌলিক তথ্য
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
              বিজ্ঞাপনের শিরোনাম *
            </label>
            <input
              type="text"
              placeholder="যেমন: ধানমন্ডি ২৭ এ আলো-বাতাসপূর্ণ ৩ বেডরুমের আধুনিক ফ্ল্যাট ভাড়া"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-xs sm:text-sm font-bn"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                ভাড়ার ধরন (Category) *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-bn bg-white"
              >
                <option value="Family">Family / ফ্যামিলি</option>
                <option value="Bachelor Male">Bachelor Male / ব্যাচেলর (ছেলে)</option>
                <option value="Bachelor Female">Bachelor Female / ব্যাচেলর (মেয়ে)</option>
                <option value="Sublet">Sublet / সাবলেট</option>
                <option value="Hostel">Hostel / হোস্টেল</option>
                <option value="Office">Office / অফিস স্পেস</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                কারা থাকতে পারবে?
              </label>
              <select
                value={formData.genderPreference}
                onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-bn bg-white"
              >
                <option value="Any">যেকোনো (Any)</option>
                <option value="Family Only">শুধু পরিবার (Family Only)</option>
                <option value="Male Only">শুধু ছাত্র / পুরুষ (Male Only)</option>
                <option value="Female Only">শুধু ছাত্রী / নারী (Female Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 font-bn flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-600" />
            ভাড়া ও অগ্রিম (টাকা)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                মাসিক ভাড়া (টাকা) *
              </label>
              <input
                type="number"
                placeholder="যেমন: 22000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-xs sm:text-sm"
                required
                min="500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                অগ্রিম / ডিপোজিট (টাকা)
              </label>
              <input
                type="number"
                placeholder="যেমন: 44000"
                value={formData.advance}
                onChange={(e) => setFormData({ ...formData, advance: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-xs sm:text-sm"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-bn flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              অবস্থান, ঠিকানা ও লাইভ জিপিএস লোকেশন
            </h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold font-bn">
              লাইভ ম্যাপ সাপোর্টেড
            </span>
          </div>

          {/* GPS Live Location Auto-detection Button */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800 font-bn flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                বাড়িওয়ালার লাইভ GPS লোকেশন সংযুক্ত করুন
              </div>
              <div className="text-[11px] text-slate-500 font-bn mt-0.5">
                আপনার বর্তমান অবস্থান থেকে সরাসরি গুগল ম্যাপ পিন তৈরি করুন
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetLiveLocation}
              disabled={gpsLoading}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-bn shadow-xs transition-all disabled:opacity-60 flex-shrink-0"
            >
              <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
              {gpsLoading ? "লোকেশন নেওয়া হচ্ছে..." : "📍 বর্তমান লাইভ লোকেশন নিন"}
            </button>
          </div>

          {gpsStatus && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 font-bn">
              {gpsStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                জেলা / বিভাগ *
              </label>
              <select
                value={formData.district}
                onChange={(e) => {
                  const newDistrict = e.target.value;
                  const dObj = BANGLADESH_DISTRICTS.find(
                    (d) => d.name.toLowerCase() === newDistrict.toLowerCase() || d.bn === newDistrict
                  );
                  setFormData({
                    ...formData,
                    district: newDistrict,
                    area: dObj && dObj.areas.length > 0 ? dObj.areas[0].bn : formData.area,
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-bn bg-white"
              >
                {BANGLADESH_DISTRICTS.map((dist) => (
                  <option key={dist.name} value={dist.name}>
                    {dist.bn} ({dist.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                এলাকা (Area) *
              </label>
              <input
                type="text"
                placeholder="যেমন: ধানমন্ডি ২৭, মিরপুর-১০, উত্তরা সেক্টর ৪"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-bn"
                required
              />
            </div>
          </div>

          {/* Quick Area Suggestion Chips */}
          {currentDistrictObj && currentDistrictObj.areas.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 font-bn">
                {currentDistrictObj.bn}-এর জনপ্রিয় এলাকা নির্বাচন করুন:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentDistrictObj.areas.slice(0, 10).map((a) => (
                  <button
                    key={a.en}
                    type="button"
                    onClick={() => setFormData({ ...formData, area: a.bn })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bn font-semibold transition-all ${
                      formData.area === a.bn
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {a.bn}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
              সম্পূর্ণ ঠিকানা (বাসা/রোড নং)
            </label>
            <input
              type="text"
              placeholder="যেমন: বাড়ি ১২, রোড ৫/এ, ব্লক সি"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-bn"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
              গুগল ম্যাপ পিন বা কো-অর্ডিনেট (Google Map Query / Coordinates)
            </label>
            <input
              type="text"
              placeholder="যেমন: 23.7461, 90.3742 অথবা ধানমন্ডি ২৭"
              value={formData.mapQuery}
              onChange={(e) => setFormData({ ...formData, mapQuery: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-mono text-slate-700"
            />
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 font-bn flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            ঘরের বিবরণ
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">বেডরুম</label>
              <input
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bn"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">বাথরুম</label>
              <input
                type="number"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bn"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">বারান্দা</label>
              <select
                value={formData.balcony ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, balcony: e.target.value === "yes" })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bn bg-white"
              >
                <option value="yes">আছে</option>
                <option value="no">নেই</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">তলা (Floor)</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bn"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Facilities Checkboxes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 font-bn flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-brand-600" />
            সুযোগ-সুবিধাসমূহ
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {availableFacilities.map((fac) => {
              const isChecked = formData.facilities.includes(fac.id);
              return (
                <button
                  type="button"
                  key={fac.id}
                  onClick={() => handleFacilityToggle(fac.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all font-bn flex items-center gap-2 ${
                    isChecked
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="accent-brand-600 rounded"
                  />
                  <span>{fac.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-bn flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-600" />
              ফ্ল্যাট বা রুমের ছবি
            </h2>
            <span className="text-[11px] text-slate-400 font-bn">ঐচ্ছিক (ছবি না দিলেও চলবে)</span>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer relative bg-slate-50/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-700 font-bn">
              ছবি আপলোড করতে ক্লিক করুন
            </div>
            <div className="text-[11px] text-slate-400 font-bn mt-0.5">
              PNG, JPG ফরম্যাট সাপোর্ট করে
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {formData.images.length === 0 ? (
            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs font-medium text-amber-800 font-bn flex items-center gap-2">
              <span>💡</span>
              <span>
                আপনি যদি ছবি আপলোড না করেন, তবে সিস্টেমে ডিফল্ট <strong>"ছবি আপলোড করা হয়নি"</strong> আইকন দেখাবে যাতে গ্রাহকরা সরাসরি যোগাযোগ করে বাসাটি ভিজিট করতে পারেন।
              </span>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pt-2">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                  <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 shadow-xs"
                    title="ছবি মুছুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 font-bn flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-600" />
            যোগাযোগের তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                মোবাইল নম্বর *
              </label>
              <input
                type="tel"
                placeholder="018XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                WhatsApp নম্বর
              </label>
              <input
                type="tel"
                placeholder="018XXXXXXXX"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-sm shadow-md transition-all font-bn disabled:opacity-50"
        >
          {loading ? "বিজ্ঞাপন প্রকাশ করা হচ্ছে..." : "বিজ্ঞাপন প্রকাশ করুন"}
        </button>
      </form>
    </div>
  );
}
