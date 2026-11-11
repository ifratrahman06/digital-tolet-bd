import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Digital To-Let BD",
  description: "Digital To-Let BD এর গোপনীয়তা ও তথ্য সুরক্ষা নীতিমালা।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      {/* Top Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors font-bn"
        >
          <ArrowLeft className="w-4 h-4" />
          হোমপেজে ফিরে যান
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-bn tracking-tight">
              গোপনীয়তা নীতিমালা (Privacy Policy)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bn">
              সর্বশেষ আপডেট: নভেম্বর ২০২৬ | Digital To-Let BD
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 font-bn leading-relaxed text-sm sm:text-base">
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 text-emerald-900">
          <p className="font-medium">
            <strong>Digital To-Let BD</strong> একটি উন্মুক্ত ও ১০০% ফ্রি ডিজিটাল প্ল্যাটফর্ম যা বাংলাদেশের সাধারণ ভাড়াটিয়া এবং বাড়িওয়ালাদের সরাসরি যোগাযোগের উদ্দেশ্যে তৈরি। আমরা আপনার তথ্যের সর্বোচ্চ নিরাপত্তা এবং গোপনীয়তা রক্ষায় অঙ্গীকারাবদ্ধ।
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ১. আমরা কী কী তথ্য সংগ্রহ করি? (Information We Collect)
          </h2>
          <p>
            আমাদের প্ল্যাটফর্মের সার্ভিস ব্যবহার করার সময় আপনি স্বেচ্ছায় যে তথ্য প্রদান করেন, আমরা শুধুমাত্র সেগুলোই সংরক্ষণ করি:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>বিজ্ঞাপন সংক্রান্ত তথ্য:</strong> বাড়ির শিরোনাম, এলাকা, বিস্তারিত বিবরণ, মাসিক ভাড়া, সুবিধাসমূহ এবং ফ্ল্যাট/রুমের ছবি।</li>
            <li><strong>যোগাযোগের তথ্য:</strong> বাড়িওয়ালার মোবাইল নম্বর ও হোয়াটসঅ্যাপ নম্বর (যাতে ভাড়াটিয়া সরাসরি যোগাযোগ করতে পারে)।</li>
            <li><strong>ফিডব্যাক ও মতামত:</strong> আমাদের সার্ভিস সম্পর্কে আপনার রেটিং, পরামর্শ, নাম এবং ঐচ্ছিক ইমেইল বা ফোন নম্বর।</li>
            <li><strong>ব্যবহার সংক্রান্ত সাধারণ তথ্য:</strong> ব্রাউজারের ধরন এবং ব্যবহারকারী কোন এলাকা বেশি খুঁজছেন—সে সম্পর্কিত অজ্ঞাত বিশ্লেষণমূলক ডাটা।</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ২. তথ্যের ব্যবহার (How We Use Information)
          </h2>
          <p>
            সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করা হয়:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>ভাড়াটিয়াদের কাছে বাড়িওয়ালার সঠিক তথ্য প্রদর্শন করা।</li>
            <li>প্ল্যাটফর্মের নিরাপত্তা রক্ষা এবং কোনো ভুয়া বিজ্ঞাপন প্রতিরোধ করা।</li>
            <li>ব্যবহারকারীদের মতামত ও ফিডব্যাকের ভিত্তিতে ওয়েবসাইটের কার্যকারিতা বৃদ্ধি করা।</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ৩. তথ্যের নিরাপত্তা ও তৃতীয় পক্ষ (Data Security & Third Parties)
          </h2>
          <p>
            আমরা কখনো কোনো ব্যবহারকারীর ব্যক্তিগত তথ্য, মোবাইল নম্বর বা ইমেইল কোনো তৃতীয় পক্ষের বিজ্ঞাপনদাতা বা এজেন্সির কাছে বিক্রি করি না। 
          </p>
          <p>
            আমাদের ব্যবহৃত ক্লাউড ডাটাবেস (MongoDB Atlas / Supabase) ইন্ডাস্ট্রি স্ট্যান্ডার্ড এনক্রিপশন ও সিকিউরিটি প্রোটোকল মেনে চলে।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ৪. কুকিজ ও লোকাল স্টোরেজ (Cookies & LocalStorage)
          </h2>
          <p>
            আপনার ব্রাউজিং অভিজ্ঞতা সহজ করার জন্য (যেমন: আপনি কোন ফিল্টারটি সিলেক্ট করেছিলেন বা আপনার লগইন সেশন মনে রাখার জন্য) আমরা ব্রাউজারের LocalStorage ব্যবহার করি। এটি আপনার ডিভাইসের বাইরে কোনো তথ্য পাঠায় না।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ৫. যোগাযোগ ও অভিযোগ (Contact Us)
          </h2>
          <p>
            আমাদের গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন, বিজ্ঞাপন অপসারণের অনুরোধ বা আপত্তি থাকলে সরাসরি ফাউন্ডারের সাথে যোগাযোগ করুন:
          </p>
          <div className="bg-slate-100 rounded-2xl p-4 space-y-2 text-sm font-sans">
            <div><strong>Founder:</strong> Ifrat Rahman Hamim</div>
            <div><strong>Email:</strong> <a href="mailto:ifratmirdha@gmail.com" className="text-brand-600 underline">ifratmirdha@gmail.com</a></div>
            <div><strong>WhatsApp / Call:</strong> +8801862228188</div>
            <div><strong>Location:</strong> Dhaka, Bangladesh</div>
          </div>
        </section>
      </div>
    </div>
  );
}
