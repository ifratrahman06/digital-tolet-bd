"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Home,
  MapPin,
  Bed,
  Bath,
  Coins,
  RefreshCw,
  AlertTriangle,
  LogIn,
  Edit3,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { IProperty } from "@/types/property";
import { formatBDT } from "@/lib/utils";

export default function MyAdsPage() {
  const { user, openLoginModal } = useAuth();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMyAds = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?userId=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.data || []);
      } else {
        setProperties([]);
      }
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMyAds();
    } else {
      setLoading(false);
    }
  }, [user, fetchMyAds]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) => prev.filter((p) => (p._id || p.id) !== id));
        showToast("success", "বিজ্ঞাপনটি সফলভাবে মুছে ফেলা হয়েছে।");
      } else {
        showToast("error", data.error || "মুছতে সমস্যা হয়েছে।");
      }
    } catch {
      showToast("error", "সার্ভার সংযোগ সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    const newStatus = currentStatus === "available" ? "rented" : "available";
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) =>
          prev.map((p) =>
            (p._id || p.id) === id ? { ...p, status: newStatus as "available" | "rented" } : p
          )
        );
        showToast(
          "success",
          newStatus === "rented"
            ? "বাসাটি \"ভাড়া হয়েছে\" হিসেবে চিহ্নিত করা হয়েছে।"
            : "বাসাটি আবার \"পাওয়া যাচ্ছে\" হিসেবে চিহ্নিত করা হয়েছে।"
        );
      } else {
        showToast("error", data.error || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch {
      showToast("error", "সার্ভার সংযোগ সমস্যা।");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Not Logged In ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 font-bn">লগইন করুন</h2>
            <p className="text-sm text-slate-500 font-bn mt-1">
              আপনার বিজ্ঞাপনগুলো দেখতে ও পরিচালনা করতে লগইন করুন।
            </p>
          </div>
          <button
            onClick={openLoginModal}
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold font-bn hover:bg-brand-600 transition-all"
          >
            লগইন করুন
          </button>
          <Link href="/" className="inline-block text-sm text-slate-500 hover:text-brand-600 font-bn">
            ← হোমপেজে ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <div className="h-8 bg-slate-100 rounded-xl w-56 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-3">
            <div className="h-5 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold font-bn flex items-center gap-2 animate-fade-in transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-all shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-slate-900 font-bn">আমার বিজ্ঞাপনসমূহ</h1>
          <p className="text-sm text-slate-500 font-bn mt-0.5">
            স্বাগতম, <span className="font-bold text-slate-800">{user.name}</span> — আপনার সকল টু-লেট বিজ্ঞাপন এখানে দেখুন ও পরিচালনা করুন
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={fetchMyAds}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all font-bn"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            রিফ্রেশ
          </button>
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-xl shadow-md transition-all font-bn"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">নতুন</span> বিজ্ঞাপন
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
          <div className="text-2xl font-black text-slate-900">{properties.length}</div>
          <div className="text-xs text-slate-500 font-bn mt-0.5">মোট বিজ্ঞাপন</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 text-center shadow-xs">
          <div className="text-2xl font-black text-emerald-700">
            {properties.filter((p) => p.status === "available").length}
          </div>
          <div className="text-xs text-emerald-600 font-bn mt-0.5">পাওয়া যাচ্ছে</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
          <div className="text-2xl font-black text-slate-500">
            {properties.filter((p) => p.status === "rented").length}
          </div>
          <div className="text-xs text-slate-500 font-bn mt-0.5">ভাড়া হয়েছে</div>
        </div>
      </div>

      {/* Empty State */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
            <Home className="w-7 h-7 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-bn">
              এখনো কোনো বিজ্ঞাপন নেই
            </h3>
            <p className="text-sm text-slate-500 font-bn mt-1">
              আপনার বাসা বা রুমের বিজ্ঞাপন বিনামূল্যে দিন এবং সরাসরি ভাড়াটিয়া খুঁজুন।
            </p>
          </div>
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-2xl font-bold text-sm transition-all font-bn shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            প্রথম বিজ্ঞাপন দিন
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const id = property._id || property.id || "";
            const isAvailable = property.status === "available";
            const coverImage =
              property.images && property.images.length > 0
                ? property.images[0]
                : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80";

            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-brand-300 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm font-bn ${
                        isAvailable
                          ? "bg-brand-600 text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      {isAvailable ? "পাওয়া যাচ্ছে" : "ভাড়া হয়েছে"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base leading-snug font-bn line-clamp-2">
                            {property.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 font-bn">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-600" />
                              {property.location.area}, {property.location.district}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-brand-600" />
                              {property.details.rooms} বেড
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-brand-600" />
                              {property.details.baths} বাথ
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-slate-400 font-bn">মাসিক ভাড়া</div>
                          <div className="text-base font-extrabold text-slate-900">
                            {formatBDT(property.price)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-bn">
                        <Coins className="w-3.5 h-3.5 text-slate-400" />
                        <span>অগ্রিম: {formatBDT(property.advance)}</span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {property.category}
                        </span>
                        {property.createdAt && (
                          <>
                            <span className="text-slate-300">•</span>
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(property.createdAt).toLocaleDateString("bn-BD", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      {/* View */}
                      <Link
                        href={`/properties/${id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all font-bn"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        দেখুন
                      </Link>

                      {/* Edit Ad */}
                      <Link
                        href={`/edit-ad/${id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all font-bn"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        এডিট
                      </Link>

                      {/* Toggle Status */}
                      <button
                        onClick={() => handleToggleStatus(id, property.status)}
                        disabled={updatingId === id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all font-bn disabled:opacity-60 ${
                          isAvailable
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {updatingId === id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : isAvailable ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {isAvailable ? "ভাড়া হয়েছে চিহ্নিত করুন" : "আবার উপলব্ধ করুন"}
                      </button>

                      {/* Delete */}
                      {confirmDeleteId === id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-xs text-rose-700 font-bn font-bold">নিশ্চিত?</span>
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={deletingId === id}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all font-bn disabled:opacity-60 flex items-center gap-1"
                          >
                            {deletingId === id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            হ্যাঁ, মুছুন
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all font-bn"
                          >
                            বাতিল
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all font-bn ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          মুছুন
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      {properties.length > 0 && (
        <div className="text-center pt-2">
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-2xl font-bold text-sm transition-all font-bn shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            আরেকটি নতুন বিজ্ঞাপন দিন
          </Link>
        </div>
      )}
    </div>
  );
}

