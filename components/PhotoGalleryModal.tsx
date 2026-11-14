"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon, Sparkles } from "lucide-react";

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title: string;
}

export default function PhotoGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl animate-fade-in select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base truncate font-bn">{title}</h3>
            <span className="text-xs text-slate-400 font-mono">
              ছবি {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="বন্ধ করুন (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image View Area */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Current Image */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in"
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="px-4 py-4 bg-gradient-to-t from-black/90 to-transparent z-20">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                  idx === currentIndex
                    ? "ring-2 ring-emerald-400 scale-105 opacity-100"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
