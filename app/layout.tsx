import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeedbackProvider } from "@/components/FeedbackContext";
import { AuthProvider } from "@/components/AuthContext";
import { BookmarkProvider } from "@/components/BookmarkContext";

export const metadata: Metadata = {
  title: "Digital To-Let BD | আধুনিক ও নির্ভরযোগ্য ডিজিটাল বাসা খোঁজা",
  description: "বাংলাদেশের সবচেয়ে সহজ, নির্ভরযোগ্য ও দালালমুক্ত ডিজিটাল বাসা খোঁজা ও টু-লেট প্ল্যাটফর্ম। ব্যাচেলর, ফ্যামিলি ও সাবলেট বাসা সহজেই খুঁজুন।",
  keywords: ["to-let", "to let bangladesh", "house rent dhaka", "bachelor mess dhaka", "sublet bd", "flat rent"],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#f8faf9] text-[#0f172a] antialiased" suppressHydrationWarning>
        <AuthProvider>
          <BookmarkProvider>
            <FeedbackProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </FeedbackProvider>
          </BookmarkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
