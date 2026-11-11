"use client";

import React, { createContext, useContext, useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { MessageSquareHeart, Star } from "lucide-react";

interface FeedbackContextType {
  isOpen: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType>({
  isOpen: false,
  openFeedback: () => {},
  closeFeedback: () => {},
});

export const useFeedback = () => useContext(FeedbackContext);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openFeedback = () => setIsOpen(true);
  const closeFeedback = () => setIsOpen(false);

  return (
    <FeedbackContext.Provider value={{ isOpen, openFeedback, closeFeedback }}>
      {children}
      <FeedbackModal isOpen={isOpen} onClose={closeFeedback} />

      {/* Floating Feedback Action Button on Bottom Right */}
      <button
        onClick={openFeedback}
        className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-2xl shadow-emerald-950/40 border border-emerald-400/30 hover:scale-105 active:scale-95 transition-all font-bn group"
        aria-label="Give Feedback"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
        <MessageSquareHeart className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
        <span>মতামত দিন</span>
      </button>
    </FeedbackContext.Provider>
  );
}
