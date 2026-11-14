"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Wind,
  Check,
  Phone,
  MessageSquare,
  ShieldCheck,
  Share2,
  Heart,
  Send,
  Navigation,
  Compass,
  Building,
  GraduationCap,
  Hospital,
  ShoppingBag,
  Train,
  Shield,
  UtensilsCrossed,
  Waves,
  Landmark,
  User,
  Clock,
  Layers,
  Bookmark,
  Camera,
  BadgeCheck,
  Maximize2,
  Lock,
} from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { IProperty, IComment, INearbyPlace } from "@/types/property";
import { useAuth } from "@/components/AuthContext";
import { useBookmarks } from "@/components/BookmarkContext";
import PhotoGalleryModal from "@/components/PhotoGalleryModal";
import DirectMessageModal from "@/components/DirectMessageModal";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Gallery Modal & Direct Message Modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Reaction State
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Comments State
  const [comments, setComments] = useState<IComment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const propertyId = resolvedParams.id;
  const bookmarked = isBookmarked(propertyId);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (user?.name && !commenterName) {
      setCommenterName(user.name);
    }
  }, [user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/properties/${propertyId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProperty(data.data);
        setLikes(data.data.likes || 18);
        setComments(data.data.comments || []);

        try {
          const likedList = JSON.parse(localStorage.getItem("digital_tolet_liked_ids") || "[]");
          if (likedList.includes(propertyId)) {
            setIsLiked(true);
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to load property:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const likedList = JSON.parse(localStorage.getItem("digital_tolet_liked_ids") || "[]");
      if (nextLiked) {
        likedList.push(propertyId);
      } else {
        const idx = likedList.indexOf(propertyId);
        if (idx > -1) likedList.splice(idx, 1);
      }
      localStorage.setItem("digital_tolet_liked_ids", JSON.stringify(likedList));

      await fetch(`/api/properties/${propertyId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
    } catch (err) {
      console.warn("Like failed:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleBookmark = () => {
    toggleBookmark(propertyId);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    const authorName = commenterName.trim() || user?.name || "ভাড়াটিয়া অনুসন্ধানকারী";

    const optimisticComment: IComment = {
      id: Date.now().toString(),
      userName: authorName,
      userRole: user?.role || "tenant",
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setNewCommentText("");
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 2500);

    try {
      await fetch(`/api/properties/${propertyId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: authorName,
          userRole: user?.role || "tenant",
          text: optimisticComment.text,
        }),
      });
    } catch (err) {
      console.error("Comment submit error:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 font-bn animate-fade-in">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">বাসার বিস্তারিত তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 font-bn">
        <h2 className="text-xl font-bold text-slate-800">বাসাটির তথ্য পাওয়া যায়নি!</h2>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md"
        >
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const phone = property.contact?.phone || "01862228188";
  const whatsapp = property.contact?.whatsapp || phone;
  const whatsappClean = whatsapp.replace(/[^0-9]/g, "");
  const whatsappInternational = whatsappClean.startsWith("88")
    ? whatsappClean
    : whatsappClean.startsWith("0")
    ? "88" + whatsappClean
    : "880" + whatsappClean;

  const prefilledMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি Digital To-Let BD-তে আপনার "${property.title}" (${property.location.area}) বাসাটির বিজ্ঞাপনটি দেখেছি। বাসাটি কি এখনো ভাড়া দেওয়া বাকি আছে?`
  );

  const imagesList =
    property.images && property.images.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80"];

  const currentDisplayImage = imagesList[activeImageIdx] || imagesList[0];

  const getNearbyIcon = (cat: string) => {
    switch (cat) {
      case "hospital":
        return <Hospital className="w-4 h-4 text-rose-600" />;
      case "market":
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case "shopping":
        return <Building className="w-4 h-4 text-purple-600" />;
      case "education":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "transport":
        return <Train className="w-4 h-4 text-emerald-600" />;
      case "security":
        return <Shield className="w-4 h-4 text-indigo-600" />;
      case "dining":
        return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
      case "nature":
        return <Waves className="w-4 h-4 text-teal-600" />;
      case "mosque":
        return <Landmark className="w-4 h-4 text-emerald-700" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  const mapQueryEncoded = encodeURIComponent(
    property.location.mapQuery || `${property.location.area}, ${property.location.district}, Bangladesh`
  );
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQueryEncoded}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${mapQueryEncoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="pb-28 font-bn animate-fade-in">
      {/* Top Header Navigation */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            সব লিস্টিং দেখুন
          </Link>

          <div className="flex items-center gap-2">
            {/* BOOKMARK BUTTON */}
            <button
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                bookmarked
                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-rose-50/50"
              }`}
              title={bookmarked ? "সংরক্ষণ তালিকা থেকে সরান" : "পছন্দের তালিকায় সংরক্ষণ করুন"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-rose-600 text-rose-600" : ""}`} />
              <span className="hidden sm:inline">{bookmarked ? "সংরক্ষিত" : "পছন্দ"}</span>
            </button>

            {/* LIKE BUTTON */}
            <button
              onClick={handleToggleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                isLiked
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
              <span className="font-mono">{likes}</span>
            </button>

            {/* SHARE BUTTON */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "লিংক কপি হয়েছে!" : "শেয়ার"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* PHOTO SHOWCASE GALLERY & LIGHTBOX TRIGGER */}
        <div className="space-y-3">
          <div className="rounded-3xl bg-slate-900 h-72 sm:h-[430px] overflow-hidden border border-slate-200/80 relative shadow-md group cursor-pointer">
            <img
              src={currentDisplayImage}
              alt={property.title}
              onClick={() => setIsGalleryOpen(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-brand-600 text-white shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {property.status === "available" ? "পাওয়া যাচ্ছে" : "ভাড়া হয়ে গেছে"}
              </span>

              {/* VERIFICATION TRUST BADGE */}
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950/85 text-emerald-300 border border-emerald-400/40 backdrop-blur-md shadow-md flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                ১০০% ভেরিফায়েড বাসা
              </span>

              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-900 shadow-md">
                {property.category}
              </span>
            </div>

            {/* View Full Gallery Button Overlay */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-black/75 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md text-xs font-bold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              সব ছবি দেখুন ({imagesList.length}টি)
            </button>
          </div>

          {/* Gallery Thumbnails Row */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 sm:w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === idx
                      ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-105"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VERIFICATION TRUST GUARANTEE CARD */}
        <div className="bg-gradient-to-r from-emerald-950/5 via-teal-950/5 to-emerald-950/5 border border-emerald-300/80 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <BadgeCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  ডিজিটাল টু-লেট বিডি ভেরিফায়েড গ্যারান্টি
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    TRUST PASS
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  নিরাপদ ও নির্ভরযোগ্য বাসা নিশ্চিত করতে আমাদের টিম কর্তৃক প্রতিটি তথ্য যাচাইকৃত
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs font-semibold text-emerald-900">
              <span className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> এনআইডি ভেরিফায়েড
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> স্পট পরিদর্শনকৃত
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> ০% দালাল ফি
              </span>
            </div>
          </div>
        </div>

        {/* Title & Price Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>
                  {property.location.address || `${property.location.area}, ${property.location.district}`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {property.title}
              </h1>
            </div>

            <div className="md:text-right flex-shrink-0">
              <div className="text-xs text-slate-400">মাসিক ভাড়া</div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {formatBDT(property.price)}
                <span className="text-sm font-normal text-slate-500 ml-1">/ মাস</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                অগ্রিম / সিকিউরিটি:{" "}
                <strong className="text-slate-800">{formatBDT(property.advance)}</strong>
              </div>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Bed className="w-3.5 h-3.5 text-slate-500" />
                বেডরুম
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {property.details.rooms} টি
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Bath className="w-3.5 h-3.5 text-slate-500" />
                বাথরুম
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {property.details.baths} টি
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                বারান্দা
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {property.details.balcony ? "হ্যাঁ (আছে)" : "নেই"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                রুম সাইজ / তলা
              </div>
              <div className="text-base font-extrabold text-slate-800">
                {property.details.sqft ? `${property.details.sqft} sqft` : `${property.details.floor || 1}ম তলা`}
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            উপলব্ধ সুযোগ-সুবিধাসমূহ
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {property.facilities.map((fac, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200/80 text-slate-800"
              >
                <Check className="w-4 h-4 text-brand-600" />
                {fac}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            বিস্তারিত বিবরণ
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* DIRECT OWNER INQUIRY CARD */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              সরাসরি মালিকের সাথে কথা বলুন
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              বাসাটি দেখতে চান বা কিছু জানতে চান?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              মালিক: <strong>{property.contact.ownerName || "বাড়িওয়ালা"}</strong> • মোবাইল: {phone}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsMessageModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-slate-950" />
            সরাসরি মেসেজ পাঠান
          </button>
        </div>

        {/* LIVE LOCATION & INTERACTIVE MAP SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-600" />
                লাইভ লোকেশন ও ম্যাপ (Live Location Map)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                সরাসরি ম্যাপ দেখে সঠিক লোকেশন ও রুট যাচাই করুন
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
            >
              <Navigation className="w-3.5 h-3.5" />
              Google Maps-এ খুলুন
            </a>
          </div>

          {/* Interactive Map Embed */}
          <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
            <iframe
              title={`Location map of ${property.location.area}`}
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* NEAREST LANDMARKS & ESSENTIAL SERVICES BREAKDOWN */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-600" />
              কাছাকাছি গুরুত্বপূর্ণ স্থান ও নাগরিক সেবা (Nearby Landmarks & Services)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              বাসাটির আশেপাশের জরুরি স্বাস্থ্যসেবা, বাজার, মেট্রোরেল, স্কুল ও নিরাপত্তামূলক প্রতিষ্ঠান
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {property.nearbyPlaces && property.nearbyPlaces.length > 0 ? (
              property.nearbyPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start justify-between gap-3 hover:bg-slate-50 hover:border-brand-300 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                      {getNearbyIcon(place.category)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-snug">
                        {place.name}
                      </div>
                      {place.detail && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {place.detail}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded-full flex-shrink-0 font-mono">
                    {place.distance}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-full text-xs text-slate-500 p-4 bg-slate-50 rounded-2xl text-center">
                নিকটবর্তী স্থানসমূহের তথ্য শীঘ্রই আপডেট করা হবে।
              </div>
            )}
          </div>
        </div>

        {/* LIVE DISCUSSION & COMMENTS SECTION */}
        <div
          id="comments"
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-24"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                প্রশ্ন ও আলোচনা (Questions & Comments)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                বাসাটি সম্পর্কে যে কোনো প্রশ্ন বা মতামত লিখুন, বাড়িওয়ালা সরাসরি উত্তর দেবেন
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-mono">
              {comments.length}
            </span>
          </div>

          {/* New Comment Input Form */}
          <form
            onSubmit={handleAddComment}
            className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70"
          >
            {commentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
                আপনার প্রশ্ন বা মন্তব্যটি সফলভাবে প্রকাশিত হয়েছে!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  আপনার নাম:
                </label>
                <input
                  type="text"
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                আপনার প্রশ্ন বা মন্তব্য লিখুন:
              </label>
              <textarea
                required
                rows={3}
                placeholder="যেমন: বাসাটি কি আগামী মাসের ১ তারিখ থেকে খালি হবে? গ্যাস ও পানির বিল কি ফিক্সড?"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmittingComment ? "পোস্ট হচ্ছে..." : "মন্তব্য প্রকাশ করুন"}
              </button>
            </div>
          </form>

          {/* Existing Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                এখনো কোনো মন্তব্য বা প্রশ্ন করা হয়নি। আপনিই প্রথম প্রশ্নটি করুন!
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] uppercase">
                        {c.userName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{c.userName}</span>
                      {c.userRole === "landlord" && (
                        <span className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                          বাড়িওয়ালা
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 pl-8 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR WITH DIRECT MESSAGING & CALL */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-slate-200/80 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${phone}`}
            className="flex-1 py-3 px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">সরাসরি</span> কল ({phone})
          </a>

          <button
            type="button"
            onClick={() => setIsMessageModalOpen(true)}
            className="flex-1 py-3 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md hover:scale-102"
          >
            <MessageSquare className="w-4 h-4" />
            মেসেজ পাঠান
          </button>

          <a
            href={`https://wa.me/${whatsappInternational}?text=${prefilledMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3.5 rounded-xl bg-[#25d366] hover:bg-[#1ebc59] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all shadow-md"
            title="WhatsApp এ কথা বলুন"
          >
            <Send className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* FULL PHOTO GALLERY LIGHTBOX MODAL */}
      <PhotoGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={imagesList}
        initialIndex={activeImageIdx}
        title={property.title}
      />

      {/* DIRECT IN-APP MESSAGING MODAL */}
      <DirectMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        property={{
          id: propertyId,
          title: property.title,
          area: property.location.area,
          district: property.location.district,
          ownerName: property.contact.ownerName,
          phone: property.contact.phone,
          whatsapp: property.contact.whatsapp,
        }}
      />
    </div>
  );
}
