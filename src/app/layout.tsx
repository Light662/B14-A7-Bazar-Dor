import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { PriceTicker } from "@/components/price-ticker";
import { SiteFooter } from "@/components/site-footer";
import { ToastProvider } from "@/components/toaster";
import "./globals.css";

const bengali = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "বাজার দর | BazarDor",
    template: "%s | বাজার দর",
  },
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে দেখুন।",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={bengali.variable}>
      <body>
        <div className="app-shell">
          <SiteHeader />
          <PriceTicker />
          {children}
          <SiteFooter />
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
