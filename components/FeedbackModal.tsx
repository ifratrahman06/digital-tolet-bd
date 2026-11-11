"use client";

import { useState } from "react";
import { Star, X, MessageSquareHeart, CheckCircle2, Send, Sparkles } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("পরামর্শ (Suggestion)");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const categories = [
    "পরামর্শ (Suggestion)",
    "প্রশংসা (Appreciation)",
    "ফিচার রিকোয়েস্ট (Feature Request)",
    "অভিযোগ (Complaint)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("দয়া করে আপনার মতামত লিখুন।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          category,
          name,
          contact,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMessage("");
          setName("");
          setContact("");
          onClose();
        }, 2200);
      } else {
        setError(data.error || "ফিডব্যাক পাঠাতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setError("সার্ভার ত্রুটি, অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-brand-700 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-200">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-bn">আপনার মূল্যবান মতামত দিন</h3>
              <p className="text-xs text-emerald-100 font-bn">
                Digital To-Let BD-কে আরও উন্নত করতে আপনার মতামত খুব জরুরি
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {success ? (
            <div className="py-10 text-center space-y-3 font-bn animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">অসংখ্য ধন্যবাদ! 🎉</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                আপনার ফিডব্যাক সফলভাবে গ্রহণ করা হয়েছে। আমরা প্রতিনিয়ত এই প্ল্যাটফর্মকে আরও উন্নত করছি।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl font-bn">
                  {error}
                </div>
              )}

              {/* Star Rating */}
              <div className="text-center py-1 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-600 font-bn mb-1.5">
                  আমাদের সার্ভিস আপনার কেমন লেগেছে?
                </div>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 font-bn mt-1">
                  {rating === 5
                    ? "চমৎকার! (Excellent)"
                    : rating === 4
                    ? "খুব ভালো (Very Good)"
                    : rating === 3
                    ? "মোটামুটি (Good)"
                    : "উন্নতি দরকার (Needs Improvement)"}
                </div>
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bn">
                  মতামতের ধরন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 text-xs rounded-xl border text-left font-bold transition-all font-bn ${
                        category === cat
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">
                    আপনার নাম (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সাকিব হাসান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bn outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">
                    মোবাইল / ইমেইল (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    placeholder="018XXXXXXXX বা email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-bn">
                  আপনার মতামত বা পরামর্শ * :
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="আপনার কোনো সুবিধা, সমস্যা বা নতুন ফিচারের আইডিয়া থাকলে বিস্তারিত লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bn outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-brand-500 hover:from-emerald-700 hover:to-brand-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all font-bn flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>পাঠানো হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    ফিডব্যাক পাঠান
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
