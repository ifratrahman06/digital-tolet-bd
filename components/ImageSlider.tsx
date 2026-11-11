"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Building2, ShieldCheck, MapPin, PlusCircle, SlidersHorizontal, MessageSquareHeart } from "lucide-react";

interface Slide {
  image: string;
  badgeIcon: any;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const slides: Slide[] = [
  {
    image: "/images/slide1.png",
    badgeIcon: ShieldCheck,
    badge: "১০০% সম্পূর্ণ বিনামূল্যে ও দালালমুক্ত টু-লেট",
    title: "সহজেই খুঁজুন আপনার স্বপ্নের বাসস্থান",
    subtitle: "ঢাকা সহ সারা বাংলাদেশের যে কোনো প্রান্তে শিক্ষার্থী, ব্যাচেলর কিংবা ফ্যামিলির জন্য বিশ্বস্ত ও যাচাইকৃত বাসা। কোনো হিডেন চার্জ বা ব্রোকার ফি ছাড়াই সম্পূর্ণ ফ্রিতে ব্যবহার করুন।",
    buttonText: "বাসা ও ফ্ল্যাট ব্রাউজ করুন",
    buttonLink: "#browse-properties",
    secondaryButtonText: "বিনামূল্যে বিজ্ঞাপন দিন",
    secondaryButtonLink: "/post-ad",
  },
  {
    image: "/images/slide2.png",
    badgeIcon: Building2,
    badge: "সরাসরি বাড়িওয়ালার সাথে ১০০% ফ্রি যোগাযোগ",
    title: "কোনো থার্ড-পার্টি বা কমিশন ফি নেই",
    subtitle: "এক ক্লিকে সরাসরি বাড়িওয়ালার নম্বরে ফোন কল বা প্রাক-পূরণকৃত হোয়াটসঅ্যাপ মেসেজে কথা বলুন—কোনো চার্জ বা ব্রোকার ফি ছাড়াই বিনা খরচে।",
    buttonText: "উপলব্ধ লিস্টিং দেখুন",
    buttonLink: "#browse-properties",
    secondaryButtonText: "ফ্রি পোস্ট করুন",
    secondaryButtonLink: "/post-ad",
  },
  {
    image: "/images/slide3.png",
    badgeIcon: MapPin,
    badge: "লাইভ লোকেশন ম্যাপ ও প্রয়োজনীয় স্থানসমূহ",
    title: "স্মার্ট ফিল্টারিং ও বাজেট ফ্রেন্ডলি বাসা",
    subtitle: "হাসপাতাল, সুপারশপ, মেট্রোরেল, স্কুল ও পার্ক—আপনার প্রয়োজনীয় সুবিধার কাছে সেরা বাসাটি বেছে নিন বিনামূল্যে।",
    buttonText: "ফিল্টার করুন",
    buttonLink: "#browse-properties",
    secondaryButtonText: "মতামত দিন",
    secondaryButtonLink: "#feedback",
  },
];

interface ImageSliderProps {
  onOpenFeedback?: () => void;
}

export default function ImageSlider({ onOpenFeedback }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl shadow-xl border border-slate-200/80 bg-slate-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === current;
          const BadgeIcon = slide.badgeIcon;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* High-res Image Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Minimalist Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative z-20 h-full max-w-4xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start text-white space-y-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-emerald-300 font-bn">
                  <BadgeIcon className="w-4 h-4 text-emerald-400" />
                  {slide.badge}
                </span>

                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-bn leading-tight sm:leading-tight tracking-tight text-white drop-shadow-md max-w-2xl">
                  {slide.title}
                </h2>

                <p className="text-xs sm:text-base text-slate-200 font-bn max-w-xl leading-relaxed drop-shadow-sm">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={slide.buttonLink}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-brand-600/30 hover:scale-105 transition-all font-bn flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    {slide.buttonText}
                  </a>

                  {slide.secondaryButtonText && (
                    slide.secondaryButtonLink === "#feedback" ? (
                      <button
                        type="button"
                        onClick={onOpenFeedback}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm transition-all font-bn flex items-center gap-2"
                      >
                        <MessageSquareHeart className="w-4 h-4 text-emerald-400" />
                        {slide.secondaryButtonText}
                      </button>
                    ) : (
                      <Link
                        href={slide.secondaryButtonLink || "/post-ad"}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm transition-all font-bn flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" />
                        {slide.secondaryButtonText}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? "w-6 h-2 bg-brand-400" : "w-2 h-2 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
