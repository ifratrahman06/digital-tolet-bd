import Link from "next/link";
import { FileCheck, ArrowLeft, AlertTriangle, ShieldCheck, Scale, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Digital To-Let BD",
  description: "Digital To-Let BD ব্যবহারের নিয়ম ও শর্তাবলী।",
};

export default function TermsPage() {
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
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-bn tracking-tight">
              ব্যবহারের শর্তাবলী (Terms of Service)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bn">
              Digital To-Let BD ব্যবহারের পূর্বে অনুগ্রহ করে শর্তাবলী পড়ুন
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 font-bn leading-relaxed text-sm sm:text-base">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium text-sm">
            <strong>গুরুত্বপূর্ণ সতর্কতা:</strong> Digital To-Let BD কোনো আর্থিক লেনদেন পরিচালনা করে না। বাসা ভাড়া নেওয়া বা অগ্রিম টাকা দেওয়ার পূর্বে অবশ্যই সরেজমিনে বাসা পরিদর্শন করে এবং বাড়িওয়ালার পরিচয় যাচাই করে লেনদেন করুন।
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ১. প্ল্যাটফর্মের ধরন ও সেবা (Nature of Service)
          </h2>
          <p>
            Digital To-Let BD একটি উন্মুক্ত তথ্যভিত্তিক অনলাইন মাধ্যম। এর মূল উদ্দেশ্য হলো বাংলাদেশে বাড়িভাড়া খোঁজার ঝামেলা এবং মধ্যস্থতাকারী (দালাল) কমিশন মুক্ত রাখা। আমরা কোনো মধ্যস্থতাকারী বা কমিশন এজেন্ট নই।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ২. বাড়িওয়ালা বা বিজ্ঞাপনদাতার দায়বদ্ধতা (Landlord Responsibilities)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>বিজ্ঞাপনে প্রদানকৃত ঠিকানা, ভাড়া, সুযোগ-সুবিধা এবং ছবি শতভাগ সত্য ও সঠিক হতে হবে।</li>
            <li>কোনো বিভ্রান্তিকর বা ভুয়া তথ্য প্রদান করলে যেকোনো সময় সংশ্লিষ্ট বিজ্ঞাপন অপসারণ করা হতে পারে।</li>
            <li>বাসা ভাড়া হয়ে গেলে স্ট্যাটাস "ভাড়া হয়েছে (Rented)" হিসেবে আপডেট করতে হবে।</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ৩. ভাড়াটিয়াদের দায়িত্ব ও নিরাপত্তা নির্দেশিকা (Tenant Guidelines)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>বাসা দেখতে যাওয়ার পূর্বে সবসময় নিরাপদে যোগাযোগ করুন।</li>
            <li>অনলাইনে বা বিকাশে অগ্রিম কোনো বুকিং মানি পাঠাবেন না। বাসা পরিদর্শন করে লিখিত রসিদ বা চুক্তিপত্রের মাধ্যমে লেনদেন করুন।</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ৪. দায়মুক্তি (Disclaimer of Liability)
          </h2>
          <p>
            Digital To-Let BD প্ল্যাটফর্মটি সম্পূর্ণ বিনামূল্যে সেবা প্রদান করে। ভাড়াটিয়া এবং বাড়িওয়ালার মধ্যকার যেকোনো চুক্তি, ভাড়া নির্ধারণ, বকেয়া বা বিরোধের বিষয়ে প্ল্যাটফর্ম কর্তৃপক্ষ কোনো আইনি বা আর্থিক দায় বহন করবে না।
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            ৫. শর্তাবলীর পরিমার্জন
          </h2>
          <p>
            কর্তৃপক্ষ প্রয়োজনে এই শর্তাবলীতে যেকোনো সময় পরিবর্তন বা সংযোজন করার অধিকার সংরক্ষণ করে।
          </p>
        </section>
      </div>
    </div>
  );
}
