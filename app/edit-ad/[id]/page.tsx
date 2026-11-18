"use client";

import { use, useEffect, useState } from "react";
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
  Save,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { BANGLADESH_DISTRICTS } from "@/lib/locations";

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const propertyId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    phone: "",
    whatsapp: "",
    ownerName: "",
    facilities: [] as string[],
    images: [] as string[],
    status: "available",
  });

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

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/properties/${propertyId}`);
      const data = await res.json();
      if (data.success && data.data) {
        const p = data.data;
        setFormData({
          title: p.title || "",
          category: p.category || "Family",
          price: String(p.price || ""),
          advance: String(p.advance || ""),
          area: p.location?.area || "",
          district: p.location?.district || "Dhaka",
          address: p.location?.address || "",
          mapQuery: p.location?.mapQuery || "",
          rooms: String(p.details?.rooms || "2"),
          baths: String(p.details?.baths || "2"),
          balcony: Boolean(p.details?.balcony),
          floor: String(p.details?.floor || "1"),
          sqft: String(p.details?.sqft || "1000"),
          genderPreference: p.details?.genderPreference || "Any",
          description: p.description || "",
          phone: p.contact?.phone || "",
          whatsapp: p.contact?.whatsapp || "",
          ownerName: p.contact?.ownerName || "",
          facilities: p.facilities || [],
          images: p.images || [],
          status: p.status || "available",
        });
      } else {
        setError("বিজ্ঞাপনটি লোড করা সম্ভব হয়নি।");
      }
    } catch {
      setError("সার্ভার ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const currentDistrictObj =
    BANGLADESH_DISTRICTS.find(
      (d) => d.name.toLowerCase() === formData.district.toLowerCase() || d.bn === formData.district
    ) || BANGLADESH_DISTRICTS[0];

  const handleFacilityToggle = (fac: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(fac)
        ? prev.facilities.filter((f) => f !== fac)
        : [...prev.facilities, fac],
    }));
  };

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
        setGpsStatus(`✅ লাইভ জিপিএস সফলভাবে আপডেট হয়েছে (${coordsStr})`);
        setGpsLoading(false);
      },
      () => {
        setGpsStatus("জিপিএস পারমিশন দিন অথবা ম্যানুয়ালি ঠিকানা পূরণ করুন।");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
    setSaving(true);
    setError("");

    if (!formData.title || !formData.price || !formData.area || !formData.phone) {
      setError("দয়া করে প্রয়োজনীয় সকল তারকা চিহ্নিত (*) তথ্য সঠিকভাবে পূরণ করুন।");
      setSaving(false);
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
        images: formData.images,
        status: formData.status,
      };

      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/properties/${propertyId}`);
        }, 1200);
      } else {
        setError(data.error || "বিজ্ঞাপন আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setError(err.message || "সার্ভার এরর!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-bn space-y-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">বিজ্ঞাপন এডিট তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 font-bn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/properties/${propertyId}`}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-all shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">বিজ্ঞাপন সম্পাদন করুন (Edit Ad)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            বাসার ভাড়া, সুযোগ-সুবিধা, লাইভ লোকেশন ও ছবি আপডেট করুন
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs font-bold">
            বিজ্ঞাপনটি সফলভাবে আপডেট হয়েছে! বিস্তারিত পাতায় নিয়ে যাওয়া হচ্ছে...
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="text-xs font-semibold">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            মৌলিক তথ্য
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">বিজ্ঞাপনের শিরোনাম *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ভাড়ার ধরন</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm bg-white"
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">কারা থাকতে পারবে?</label>
              <select
                value={formData.genderPreference}
                onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm bg-white"
              >
                <option value="Any">যেকোনো (Any)</option>
                <option value="Family Only">শুধু পরিবার</option>
                <option value="Male Only">শুধু ছাত্র / পুরুষ</option>
                <option value="Female Only">শুধু ছাত্রী / নারী</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">বর্তমান স্ট্যাটাস</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm bg-white font-bold"
              >
                <option value="available">পাওয়া যাচ্ছে (Available)</option>
                <option value="rented">ভাড়া হয়ে গেছে (Rented)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-600" />
            ভাড়া ও অগ্রিম (টাকা)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">মাসিক ভাড়া (টাকা) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">অগ্রিম / ডিপোজিট (টাকা)</label>
              <input
                type="number"
                value={formData.advance}
                onChange={(e) => setFormData({ ...formData, advance: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Location & GPS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              অবস্থান, ঠিকানা ও লাইভ জিপিএস লোকেশন
            </h2>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600" />
                লাইভ GPS লোকেশন রি-ক্যাপচার করুন
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                বর্তমান জায়গা থেকে এক ক্লিকে গুগল ম্যাপ আপডেট করুন
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetLiveLocation}
              disabled={gpsLoading}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-60 flex-shrink-0"
            >
              <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
              {gpsLoading ? "আপডেট হচ্ছে..." : "📍 লাইভ লোকেশন আপডেট"}
            </button>
          </div>

          {gpsStatus && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              {gpsStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">জেলা / বিভাগ *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm bg-white"
              >
                {BANGLADESH_DISTRICTS.map((dist) => (
                  <option key={dist.name} value={dist.name}>
                    {dist.bn} ({dist.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">এলাকা (Area) *</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">সম্পূর্ণ ঠিকানা (বাসা/রোড নং)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">গুগল ম্যাপ পিন বা কো-অর্ডিনেট</label>
            <input
              type="text"
              value={formData.mapQuery}
              onChange={(e) => setFormData({ ...formData, mapQuery: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm font-mono"
            />
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            ঘরের বিবরণ
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বেডরুম</label>
              <input
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বাথরুম</label>
              <input
                type="number"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">তলা (Floor)</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">আয়তন (Sqft)</label>
              <input
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.balcony}
                onChange={(e) => setFormData({ ...formData, balcony: e.target.checked })}
                className="rounded accent-brand-600 w-4 h-4"
              />
              বারান্দা আছে (Balcony available)
            </label>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-brand-600" />
            উপলব্ধ সুযোগ-সুবিধা
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {availableFacilities.map((fac) => {
              const isChecked = formData.facilities.includes(fac.id);
              return (
                <button
                  type="button"
                  key={fac.id}
                  onClick={() => handleFacilityToggle(fac.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                    isChecked
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input type="checkbox" checked={isChecked} readOnly className="accent-brand-600 rounded" />
                  <span>{fac.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-600" />
              ফ্ল্যাট বা রুমের ছবি
            </h2>
            <span className="text-[11px] text-slate-400">মোট ছবি: {formData.images.length}টি</span>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer relative bg-slate-50/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-700">ছবি আপলোড করতে ক্লিক করুন</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {formData.images.length > 0 && (
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
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-600" />
            যোগাযোগের তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">মোবাইল নম্বর *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp নম্বর</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href={`/properties/${propertyId}`}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
          >
            বাতিল
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তনগুলো সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
