"use client";

import { useState } from "react";
import { X, LogIn, UserPlus, Phone, Lock, User, ShieldCheck, Sparkles, Building, KeyRound } from "lucide-react";
import { useAuth } from "./AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("দয়া করে মোবাইল নম্বর বা ইমেইল লিখুন।");
      return;
    }

    if (!password.trim()) {
      setError("পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (tab === "login") {
        login({
          name: phone.includes("@") ? phone.split("@")[0] : `ইউজার (${phone.slice(-4)})`,
          phone: phone,
          role: "tenant",
        });
      } else {
        if (!name.trim()) {
          setError("আপনার নাম লিখুন।");
          return;
        }
        signup({
          name: name.trim(),
          phone: phone,
          role: role,
        });
      }
      onClose();
    }, 600);
  };

  const handleDemoLogin = (demoRole: "tenant" | "landlord") => {
    if (demoRole === "landlord") {
      login({
        name: "বাড়িওয়ালা (হামিম সাহেব)",
        phone: "01862228188",
        role: "landlord",
      });
    } else {
      login({
        name: "ভাড়াটিয়া (সাকিব হাসান)",
        phone: "01712345678",
        role: "tenant",
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-brand-700 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-bn">
                {tab === "login" ? "অ্যাকাউন্টে লগইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
              </h3>
              <p className="text-xs text-emerald-100 font-bn">
                Digital To-Let BD — সহজ ও নিরাপদ বাসা ভাড়া
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all font-bn flex items-center justify-center gap-2 ${
              tab === "login"
                ? "bg-white text-brand-700 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LogIn className="w-4 h-4" />
            লগইন (Sign In)
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all font-bn flex items-center justify-center gap-2 ${
              tab === "signup"
                ? "bg-white text-brand-700 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            রেজিস্ট্রেশন (Sign Up)
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl font-bn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">
                  আপনার পূর্ণ নাম *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="যেমন: ইফরাত রহমান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bn outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">
                মোবাইল নম্বর বা ইমেইল *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="018XXXXXXXX বা email@domain.com"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                  আপনি কোন হিসেবে যুক্ত হতে চান?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("tenant")}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-bn text-center transition-all ${
                      role === "tenant"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🙋‍♂️ ভাড়াটিয়া (Tenant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("landlord")}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-bn text-center transition-all ${
                      role === "landlord"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🏢 বাড়িওয়ালা (Landlord)
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-brand-500 hover:from-emerald-700 hover:to-brand-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all font-bn flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : tab === "login" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  লগইন করুন
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  অ্যাকাউন্ট খুলুন
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-bn">
              অথবা ১-ক্লিকে টেস্ট ডেমো লগইন করুন
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("landlord")}
                className="flex-1 py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-bold font-bn transition-all flex items-center justify-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-brand-600" />
                বাড়িওয়ালা ডেমো
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("tenant")}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold font-bn transition-all flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                ভাড়াটিয়া ডেমো
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
