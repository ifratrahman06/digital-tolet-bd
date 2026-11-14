"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BookmarkContextType {
  bookmarkedIds: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => boolean; // returns next state (true if now bookmarked)
  bookmarkCount: number;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarkedIds: [],
  isBookmarked: () => false,
  toggleBookmark: () => false,
  bookmarkCount: 0,
});

export const useBookmarks = () => useContext(BookmarkContext);

const STORAGE_KEY = "digital_tolet_saved_properties";

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarkedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored bookmarks:", e);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setBookmarkedIds(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isBookmarked = (id: string): boolean => {
    if (!id) return false;
    return bookmarkedIds.includes(String(id));
  };

  const toggleBookmark = (id: string): boolean => {
    if (!id) return false;
    const strId = String(id);
    const exists = bookmarkedIds.includes(strId);
    let nextList: string[];

    if (exists) {
      nextList = bookmarkedIds.filter((item) => item !== strId);
    } else {
      nextList = [strId, ...bookmarkedIds];
    }

    setBookmarkedIds(nextList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage:", e);
    }

    return !exists;
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedIds: isMounted ? bookmarkedIds : [],
        isBookmarked,
        toggleBookmark,
        bookmarkCount: isMounted ? bookmarkedIds.length : 0,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
