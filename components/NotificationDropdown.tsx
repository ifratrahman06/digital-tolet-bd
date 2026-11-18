"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCheck, MessageSquare, BadgeCheck, Heart, Info, Trash2 } from "lucide-react";

export interface INotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "message" | "comment" | "verify" | "system";
  link?: string;
}

const DEFAULT_NOTIFICATIONS: INotification[] = [
  {
    id: "notif-1",
    title: "নতুন মেসেজ এসেছে",
    message: "একজন ভাড়াটিয়া আপনার ধানমন্ডি বাসার বিজ্ঞাপনে মেসেজ পাঠিয়েছেন।",
    time: "১০ মিনিট আগে",
    isRead: false,
    type: "message",
    link: "/my-ads",
  },
  {
    id: "notif-2",
    title: "বাসা যাচাই সম্পন্ন",
    message: "আপনার বিজ্ঞাপনে '১০০% ভেরিফায়েড' ব্যাজ যুক্ত করা হয়েছে।",
    time: "২ ঘণ্টা আগে",
    isRead: false,
    type: "verify",
    link: "/",
  },
  {
    id: "notif-3",
    title: "নতুন মন্তব্য",
    message: "আপনার বিজ্ঞাপনে একজন ইউজার নতুন প্রশ্ন করেছেন।",
    time: "১ দিন আগে",
    isRead: true,
    type: "comment",
    link: "/",
  },
  {
    id: "notif-4",
    title: "Digital To-Let BD তে স্বাগতম!",
    message: "সহজে ও নিরাপদে সরাসরি বাড়িওয়ালা ও ভাড়াটিয়ার সংযোগ তৈরি করতে আমরা প্রস্তুত।",
    time: "৩ দিন আগে",
    isRead: true,
    type: "system",
  },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("digital_tolet_notifications");
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        localStorage.setItem("digital_tolet_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    try {
      localStorage.setItem("digital_tolet_notifications", JSON.stringify(updated));
    } catch {}
  };

  const markSingleAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem("digital_tolet_notifications", JSON.stringify(updated));
    } catch {}
  };

  const clearAll = () => {
    setNotifications([]);
    try {
      localStorage.setItem("digital_tolet_notifications", JSON.stringify([]));
    } catch {}
  };

  const getIcon = (type: INotification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case "verify":
        return <BadgeCheck className="w-4 h-4 text-emerald-600" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/90 hover:border-emerald-300 transition-all shadow-xs group"
        title="নোটিফিকেশন"
        aria-label="নোটিফিকেশন"
      >
        <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-auto mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in font-bn">
          {/* Header */}
          <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm">নোটিফিকেশন</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                  {unreadCount}টি নতুন
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition-colors"
                  title="সবগুলো পড়া হয়েছে হিসেবে চিহ্নিত করুন"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  সব পড়া হয়েছে
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                  title="সব মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <Bell className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p>কোনো নতুন নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markSingleAsRead(n.id)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                    !n.isRead ? "bg-emerald-50/40" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs truncate ${!n.isRead ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                      {n.message}
                    </p>

                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[10px] font-bold text-emerald-700 hover:underline mt-1"
                      >
                        বিস্তারিত দেখুন →
                      </Link>
                    )}
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
