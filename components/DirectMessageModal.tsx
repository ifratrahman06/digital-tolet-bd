"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  MessageSquare,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  Building,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "./AuthContext";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    area?: string;
    district?: string;
    ownerName?: string;
    phone: string;
    whatsapp?: string;
  };
}

const PRESET_MESSAGES = [
  "বাসাটি কি এখনো ভাড়া দেওয়া বাকি আছে?",
  "কবে স্বশরীরে বাসাটি দেখতে যাওয়া সম্ভব?",
  "ভাড়া কি কিছুটা আলোচনা সাপেক্ষ?",
  "ইউটিলিটি ও গ্যাস বিল কি ভাড়ার অন্তর্ভুক্ত?",
];

export default function DirectMessageModal({
  isOpen,
  onClose,
  property,
}: DirectMessageModalProps) {
  const { user } = useAuth();
  const [senderName, setSenderName] = useState(user?.name || "");
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!senderName.trim() || !senderPhone.trim() || !messageText.trim()) {
      setError("দয়া করে আপনার নাম, মোবাইল নম্বর ও মেসেজ লিখুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          ownerPhone: property.phone,
          senderName: senderName.trim(),
          senderPhone: senderPhone.trim(),
          messageText: messageText.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "মেসেজ পাঠাতে সমস্যা হয়েছে।");
      }
    } catch {
      setError("সার্ভার এরর! দয়া করে সরাসরি ফোন বা হোয়াটসঅ্যাপে কথা বলুন।");
    } finally {
      setLoading(false);
    }
  };

  const whatsappPhone = (property.whatsapp || property.phone || "").replace(/[^0-9]/g, "");
  const formattedWhatsApp = whatsappPhone.startsWith("88") ? whatsappPhone : `88${whatsappPhone}`;
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    `আসসালামু আলাইকুম। আমি ডিজিটাল টু-লেট বিডি (Digital To-Let BD) থেকে আপনার "${property.title}" বাসাটির বিজ্ঞাপনের ব্যাপারে যোগাযোগ করছি। ${messageText || "বাসাটি কি এখনো পাওয়া যাবে?"}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-bold font-bn mb-1 border border-emerald-400/20">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> সরাসরি ও নিরাপদ যোগাযোগ
              </div>
              <h3 className="text-lg font-black font-bn leading-tight">
                বাড়িওয়ালার সাথে সরাসরি মেসেজ
              </h3>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-emerald-50 flex items-center gap-2 font-bn">
            <Building className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span className="truncate font-semibold">{property.title}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4 font-bn animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">মেসেজ সফলভাবে পৌঁছেছে!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  আপনার মেসেজ ও যোগাযোগের নম্বর বাড়িওয়ালা ({property.ownerName || "মালিক"}) এর নিকট পাঠানো হয়েছে।
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp এও কপি পাঠান
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-bn">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              {/* Preset Quick Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  দ্রুত প্রশ্ন নির্বাচন করুন (Optional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_MESSAGES.map((msg, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setMessageText(msg)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                        messageText === msg
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার মেসেজ বা জানতে চাওয়া বিষয় *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="যেমন: বাসাটি কি আগামী মাসের ১ তারিখ থেকে ভাড়া দেওয়া সম্ভব? আমি একটি চাকরিজীবী পরিবার..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              {/* Sender Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার নাম *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="আপনার পূর্ণ নাম"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button & WhatsApp Option */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <span>মেসেজ পাঠানো হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      মেসেজ পাঠান (Send Message)
                    </>
                  )}
                </button>

                <div className="text-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline pt-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    অথবা সরাসরি WhatsApp এ চ্যাট শুরু করুন
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
