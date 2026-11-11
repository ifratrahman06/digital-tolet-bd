"use client";

import Link from "next/link";
import { Mail, Phone, MessageSquare, Heart, ShieldCheck, Star, ExternalLink, CheckCircle2, Home, PlusCircle, FileText, LayoutDashboard } from "lucide-react";
import { useFeedback } from "./FeedbackContext";

// Custom SVGs for platforms not in standard Lucide
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function XTwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface FooterProps {
  onOpenFeedback?: () => void;
}

export default function Footer({ onOpenFeedback }: FooterProps) {
  const { openFeedback: contextOpenFeedback } = useFeedback();
  const handleOpenFeedback = onOpenFeedback || contextOpenFeedback;
  const username = "ifratrahman06";
  const email = "ifratmirdha@gmail.com";
  const phone = "01862228188";

  const socialLinks = [
    {
      name: "Facebook",
      url: `https://facebook.com/${username}`,
      icon: FacebookIcon,
      color: "hover:bg-[#1877F2]/20 hover:text-[#1877F2] hover:border-[#1877F2]/40",
      textColor: "text-[#1877F2]",
    },
    {
      name: "Instagram",
      url: `https://instagram.com/${username}`,
      icon: InstagramIcon,
      color: "hover:bg-[#E4405F]/20 hover:text-[#E4405F] hover:border-[#E4405F]/40",
      textColor: "text-[#E4405F]",
    },
    {
      name: "TikTok",
      url: `https://www.tiktok.com/@${username}`,
      icon: TikTokIcon,
      color: "hover:bg-white/20 hover:text-white hover:border-white/40",
      textColor: "text-white",
    },
    {
      name: "LinkedIn",
      url: `https://linkedin.com/in/${username}`,
      icon: LinkedInIcon,
      color: "hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] hover:border-[#0A66C2]/40",
      textColor: "text-[#0A66C2]",
    },
    {
      name: "YouTube",
      url: `https://youtube.com/@${username}`,
      icon: YouTubeIcon,
      color: "hover:bg-[#FF0000]/20 hover:text-[#FF0000] hover:border-[#FF0000]/40",
      textColor: "text-[#FF0000]",
    },
    {
      name: "GitHub",
      url: `https://github.com/${username}`,
      icon: GitHubIcon,
      color: "hover:bg-slate-700 hover:text-white hover:border-slate-500",
      textColor: "text-slate-200",
    },
    {
      name: "Twitter (X)",
      url: `https://x.com/${username}`,
      icon: XTwitterIcon,
      color: "hover:bg-slate-700 hover:text-white hover:border-slate-500",
      textColor: "text-slate-200",
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md bg-brand-700 flex-shrink-0">
                <img src="/logo.svg" alt="Digital To-Let BD" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Digital <span className="text-brand-400">To-Let</span> BD
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-bn">
              বাংলাদেশের ব্যাচেলর শিক্ষার্থী, কর্মজীবী এবং পরিবারের জন্য ঝামেলাহীন বাসা খোঁজার সেরা ডিজিটাল প্ল্যাটফর্ম। কোনো দালাল বা তৃতীয় পক্ষ ছাড়াই সরাসরি যোগাযোগ করুন।
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold bg-brand-950/80 border border-brand-800/50 w-fit px-3 py-1.5 rounded-full font-bn">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              ১০০% ফ্রি সার্ভিস ও নিরাপদ লিস্টিং
            </div>

            {/* Feedback Button in Footer */}
            <button
              type="button"
              onClick={handleOpenFeedback}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all font-bn hover:scale-105"
            >
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              মতামত বা ফিডব্যাক দিন
            </button>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-bn">
              গুরুত্বপূর্ণ লিংকসমূহ
            </h4>
            <ul className="space-y-3 text-sm font-bn">
              <li>
                <Link href="/" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Home className="w-4 h-4 text-brand-400" />
                  বাসা ও রুম খুঁজুন
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  ফ্রি বিজ্ঞাপন প্রকাশ করুন
                </Link>
              </li>
              <li>
                <Link href="/my-ads" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-brand-400" />
                  আমার বিজ্ঞাপনসমূহ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  প্রাইভেসি পলিসি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  ব্যবহারের শর্তাবলী (Terms of Service)
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/88${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  সরাসরি WhatsApp সাপোর্ট
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-brand-400 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-brand-400" />
                  ইমেইল: {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Profile Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded-md border border-brand-800/40">
                FOUNDER & LEAD DEVELOPER
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-bn">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                অনলাইন সাপোর্ট
              </span>
            </div>

            {/* Profile Picture & Bio */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50 flex-shrink-0 bg-slate-800">
                  <img
                    src="/images/ifrat-rahman.jpg"
                    alt="Ifrat Rahman Hamim"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-brand-600 text-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-extrabold text-white text-lg tracking-tight">
                    Ifrat Rahman Hamim
                  </h5>
                </div>
                <p className="text-xs text-brand-300 font-semibold font-bn">
                  Department of Computer Science & Engineering (CSE)
                </p>
                <p className="text-xs text-slate-400 font-bn">
                  Canadian University of Bangladesh (CUB)
                </p>
              </div>
            </div>

            {/* Direct Contact Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all font-mono"
              >
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                {email}
              </a>
              <a
                href={`https://wa.me/88${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 transition-all font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                {phone}
              </a>
            </div>

            {/* Social Media Grid */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-bn flex items-center justify-between">
                <span>সোশ্যাল মিডিয়া প্রোফাইলস</span>
                <span className="font-mono text-emerald-400 text-xs font-bold">@{username}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {socialLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700/60 text-slate-300 transition-all duration-200 ${item.color} group`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Digital To-Let BD. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 font-bn">
              একটি উন্মুক্ত ডিজিটাল প্ল্যাটফর্ম | প্রতিষ্ঠাতা: <strong>Ifrat Rahman Hamim</strong> (@{username})
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bn">
            <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/terms" className="hover:text-brand-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
